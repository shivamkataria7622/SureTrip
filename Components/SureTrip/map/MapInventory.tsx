// map/MapInventory.tsx
// Full premium navigation: tab-bar hide · line slicing · speed · pitch camera · snap-to-route
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar, ScrollView,
  TouchableOpacity, Animated, PanResponder, Dimensions, ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MapShopView from './components/MapShopView';
import SearchBar from './components/SearchBar';
import TagFilter from './components/TagFilter';
import StoreCard from './components/StoreCard';
import { DUMMY_SHOPS, FILTER_TAGS, type Shop, type FilterCategory } from './data/shopsData';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type LatLng = { latitude: number; longitude: number };
type RouteResult = { coords: LatLng[]; distKm: number; durMin: number };

interface Props {
  onNavigationChange?: (isNavigating: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// OSRM – road-following route
// ─────────────────────────────────────────────────────────────────────────────
async function fetchRoute(from: LatLng, to: LatLng): Promise<RouteResult> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
    `?overview=full&geometries=geojson&steps=false`;
  try {
    const res  = await fetch(url, { headers: { Accept: 'application/json' } });
    const json = await res.json();
    if (json.code !== 'Ok' || !json.routes?.[0]?.geometry?.coordinates?.length) {
      const distKm = haversineKm(from, to);
      return { coords: [from, to], distKm, durMin: Math.round((distKm / 30) * 60) };
    }
    const route  = json.routes[0];
    const coords = (route.geometry.coordinates as [number, number][])
      .map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
    return { coords, distKm: route.distance / 1000, durMin: Math.round(route.duration / 60) };
  } catch {
    const distKm = haversineKm(from, to);
    return { coords: [from, to], distKm, durMin: Math.round((distKm / 30) * 60) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Geo helpers
// ─────────────────────────────────────────────────────────────────────────────
function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.latitude  - a.latitude)  * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude  * Math.PI) / 180) *
    Math.cos((b.latitude  * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function calcBearing(a: LatLng, b: LatLng): number {
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1  = (a.latitude  * Math.PI) / 180;
  const lat2  = (b.latitude  * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function projectOnSegment(P: LatLng, A: LatLng, B: LatLng): LatLng {
  const ax = B.longitude - A.longitude, ay = B.latitude - A.latitude;
  const bx = P.longitude - A.longitude, by = P.latitude - A.latitude;
  const len2 = ax * ax + ay * ay;
  if (len2 === 0) return A;
  const t = Math.max(0, Math.min(1, (bx * ax + by * ay) / len2));
  return { latitude: A.latitude + t * ay, longitude: A.longitude + t * ax };
}

/**
 * Snap GPS to nearest point on route (within 80 m).
 * Returns { snapped, segmentIndex } so we can slice the remaining path.
 */
function snapToRoute(
  point: LatLng,
  route: LatLng[],
): { snapped: LatLng; segmentIndex: number } {
  if (route.length < 2) return { snapped: point, segmentIndex: 0 };
  let best = point, bestDist = Infinity, bestIdx = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const proj = projectOnSegment(point, route[i], route[i + 1]);
    const d    = haversineKm(point, proj) * 1000; // metres
    if (d < bestDist) { bestDist = d; best = proj; bestIdx = i; }
  }
  return { snapped: bestDist < 80 ? best : point, segmentIndex: bestIdx };
}

/**
 * Line slicing — returns only the part of the route AHEAD of the user.
 * Everything the user passed is removed.
 */
function sliceRoute(route: LatLng[], snapped: LatLng, segmentIndex: number): LatLng[] {
  if (route.length < 2) return route;
  // Start from snapped point, then all remaining vertices after segmentIndex
  return [snapped, ...route.slice(segmentIndex + 1)];
}

/** Phase 1: fitToCoordinates overview — show user ↔ store */
function fitRoute(mapRef: React.RefObject<MapView>, from: LatLng, to: LatLng) {
  if (!mapRef.current) return;
  mapRef.current.fitToCoordinates([from, to], {
    edgePadding: { top: 140, right: 60, bottom: 220, left: 60 },
    animated: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────
const GPS_INTERVAL = 4000;
const TAB_BAR_H   = 80;
const STATUS_H    = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
const { height: SCREEN_H } = Dimensions.get('window');
const USABLE_H    = SCREEN_H - STATUS_H - TAB_BAR_H;
const SNAP_PEEK   = 72;
const SNAP_ETA    = 130;  // compact ETA bar
const SNAP_HALF   = Math.round(USABLE_H * 0.38);
const SNAP_FULL   = Math.round(USABLE_H * 0.78);

function snapSheet(val: number, vy: number): number {
  if (vy >  0.6) return SNAP_PEEK;
  if (vy < -0.6) return SNAP_FULL;
  const mid1 = (SNAP_PEEK + SNAP_HALF) / 2;
  const mid2 = (SNAP_HALF + SNAP_FULL) / 2;
  return val < mid1 ? SNAP_PEEK : val < mid2 ? SNAP_HALF : SNAP_FULL;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function MapInventory({ onNavigationChange }: Props) {
  const insets = useSafeAreaInsets();

  // UI
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [loading, setLoading]           = useState(true);
  const [denied,  setDenied]            = useState(false);

  // Route
  const [fullRoute,    setFullRoute]    = useState<LatLng[]>([]);   // original full path
  const [routeCoords,  setRouteCoords]  = useState<LatLng[]>([]);   // sliced remaining path
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo, setRouteInfo]       = useState<{ dist: string; dur: string } | null>(null);
  const [routeShopId, setRouteShopId]   = useState<string | null>(null);

  // Speed (km/h from GPS)
  const [speedKmh, setSpeedKmh]         = useState<number | null>(null);

  // Location
  const [userLoc, setUserLoc]           = useState<LatLng | null>(null);
  const userLocRef                      = useRef<LatLng | null>(null);

  // Bearing
  const [userHeading, setUserHeading]   = useState(0);
  const prevLocRef                      = useRef<LatLng | null>(null);
  const headingRef                      = useRef(0);

  // Stale-closure-safe refs
  const fullRouteRef    = useRef<LatLng[]>([]);
  const routeCoordsRef  = useRef<LatLng[]>([]);
  const routeActiveRef  = useRef(false);
  const followModeRef   = useRef(true);
  useEffect(() => { fullRouteRef.current   = fullRoute;        }, [fullRoute]);
  useEffect(() => { routeCoordsRef.current = routeCoords;      }, [routeCoords]);
  useEffect(() => { routeActiveRef.current = routeShopId !== null; }, [routeShopId]);

  // Notify parent (BuyerApp) to hide/show tab bar
  useEffect(() => {
    onNavigationChange?.(routeShopId !== null);
  }, [routeShopId, onNavigationChange]);

  const mapRef    = useRef<MapView>(null);
  const listRef   = useRef<ScrollView>(null);
  const locSubRef = useRef<Location.LocationSubscription | null>(null);

  // Bottom sheet
  const sheetH = useRef(new Animated.Value(SNAP_HALF)).current;
  const lastH  = useRef(SNAP_HALF);

  const snapTo = useCallback((target: number) => {
    lastH.current = target;
    Animated.spring(sheetH, { toValue: target, stiffness: 300, damping: 38, useNativeDriver: false }).start();
  }, [sheetH]);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dy) > 4,
    onPanResponderGrant:   () => { sheetH.stopAnimation(); },
    onPanResponderMove:    (_, g) => { sheetH.setValue(Math.max(SNAP_PEEK, Math.min(SNAP_FULL, lastH.current - g.dy))); },
    onPanResponderRelease: (_, g) => { snapTo(snapSheet(lastH.current - g.dy, g.vy)); },
  })).current;

  // ── GPS watch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDenied(true);
        const fallback = { latitude: 15.76, longitude: 78.04 };
        userLocRef.current = fallback; setUserLoc(fallback); setLoading(false);
        return;
      }

      try {
        const r = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const c: LatLng = { latitude: r.coords.latitude, longitude: r.coords.longitude };
        userLocRef.current = c; setUserLoc(c);
        setTimeout(() => {
          mapRef.current?.animateToRegion({ ...c, latitudeDelta: 0.028, longitudeDelta: 0.028 }, 800);
        }, 300);
      } catch {
        const fallback = { latitude: 15.76, longitude: 78.04 };
        userLocRef.current = fallback; setUserLoc(fallback);
      } finally { setLoading(false); }

      // ── Continuous watch ──
      locSubRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: GPS_INTERVAL, distanceInterval: 5 },
        (loc) => {
          const newLoc: LatLng = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

          // Speed (m/s → km/h)
          const rawSpeed = loc.coords.speed;
          if (rawSpeed != null && rawSpeed >= 0) {
            setSpeedKmh(Math.round(rawSpeed * 3.6));
          }

          // Bearing
          let bearing = headingRef.current;
          if (prevLocRef.current && haversineKm(prevLocRef.current, newLoc) > 0.003) {
            bearing = calcBearing(prevLocRef.current, newLoc);
            headingRef.current = bearing;
            setUserHeading(bearing);
          }
          prevLocRef.current = newLoc;
          userLocRef.current = newLoc;
          setUserLoc(newLoc);

          // ── Snap + Line Slice ──────────────────────────────────────────────
          if (routeActiveRef.current && fullRouteRef.current.length > 1) {
            const { snapped, segmentIndex } = snapToRoute(newLoc, fullRouteRef.current);
            const remaining = sliceRoute(fullRouteRef.current, snapped, segmentIndex);
            setRouteCoords(remaining);  // ← removes the path already travelled

            // Recalculate remaining distance
            let remKm = 0;
            for (let i = 0; i < remaining.length - 1; i++) {
              remKm += haversineKm(remaining[i], remaining[i + 1]);
            }
            const remMin = Math.round((remKm / 30) * 60);
            setRouteInfo({
              dist: remKm < 1 ? `${Math.round(remKm * 1000)} m` : `${remKm.toFixed(1)} km`,
              dur:  remMin < 1 ? '< 1 min' : `${remMin} min`,
            });

            // Navigation camera — 45° pitch tilt looking forward
            if (followModeRef.current) {
              mapRef.current?.animateCamera(
                { center: snapped, heading: bearing, zoom: 17, pitch: 45 },
                { duration: GPS_INTERVAL - 300 },
              );
            }
          } else if (followModeRef.current) {
            // Browse mode — north-up follow
            mapRef.current?.animateCamera(
              { center: newLoc, heading: 0, zoom: 15, pitch: 0 },
              { duration: GPS_INTERVAL - 300 },
            );
          }
        },
      );
    })();
    return () => { locSubRef.current?.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter ────────────────────────────────────────────────────────────────
  const shops = useMemo<Shop[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return DUMMY_SHOPS.filter(s => {
      const catOk = activeFilter === 'all' || s.inventory.some(i => i.category === activeFilter);
      const qOk   = !q || s.name.toLowerCase().includes(q) || s.inventory.some(i => i.name.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [searchQuery, activeFilter]);

  // ── Select shop ───────────────────────────────────────────────────────────
  const selectShop = useCallback((shop: Shop) => {
    setSelectedId(shop.id);
    followModeRef.current = false;
    if (routeShopId && routeShopId !== shop.id) {
      setFullRoute([]); setRouteCoords([]); setRouteInfo(null); setRouteShopId(null);
    }
    mapRef.current?.animateToRegion(
      { latitude: shop.latitude, longitude: shop.longitude, latitudeDelta: 0.014, longitudeDelta: 0.014 }, 500,
    );
    snapTo(SNAP_HALF);
  }, [snapTo, routeShopId]);

  // ── Fetch + draw route ────────────────────────────────────────────────────
  const getRoute = useCallback(async (shop: Shop) => {
    const from = userLocRef.current;
    if (!from) return;

    // Toggle off
    if (routeShopId === shop.id) {
      setFullRoute([]); setRouteCoords([]); setRouteInfo(null); setRouteShopId(null);
      setSpeedKmh(null);
      mapRef.current?.animateCamera(
        { center: from, heading: 0, zoom: 14, pitch: 0 }, { duration: 500 },
      );
      return;
    }

    setRouteLoading(true);
    setRouteShopId(shop.id);
    setSelectedId(shop.id);
    followModeRef.current = true;
    snapTo(SNAP_ETA);

    const result = await fetchRoute(from, { latitude: shop.latitude, longitude: shop.longitude });
    setFullRoute(result.coords);
    setRouteCoords(result.coords);
    setRouteInfo({
      dist: result.distKm < 1 ? `${Math.round(result.distKm * 1000)} m` : `${result.distKm.toFixed(1)} km`,
      dur:  result.durMin  < 1 ? '< 1 min' : `${result.durMin} min`,
    });
    setRouteLoading(false);

    // Phase 1: overview bounding box
    fitRoute(mapRef, from, { latitude: shop.latitude, longitude: shop.longitude });

    // Phase 2: after 2s, zoom into navigation tilt
    setTimeout(() => {
      if (userLocRef.current) {
        mapRef.current?.animateCamera(
          { center: userLocRef.current, heading: headingRef.current, zoom: 17, pitch: 45 },
          { duration: 1200 },
        );
      }
    }, 2500);
  }, [routeShopId, snapTo]);

  // ── Locate me ─────────────────────────────────────────────────────────────
  const locateMe = useCallback(() => {
    setSelectedId(null);
    setFullRoute([]); setRouteCoords([]); setRouteInfo(null); setRouteShopId(null);
    setSpeedKmh(null);
    followModeRef.current = true;
    const loc = userLocRef.current;
    if (loc) {
      mapRef.current?.animateCamera({ center: loc, heading: 0, zoom: 15, pitch: 0 }, { duration: 600 });
    }
    snapTo(SNAP_HALF);
  }, [snapTo]);

  const inStockCount = shops.reduce((acc, s) => acc + s.inventory.filter(i => i.stock > 0).length, 0);
  const selectedShop = shops.find(s => s.id === selectedId);
  const isNavigating = routeShopId !== null;

  if (loading) {
    return (
      <View style={[styles.splash, { paddingTop: STATUS_H }]}>
        <ActivityIndicator size="large" color="#1c1c1e" />
        <Text style={styles.splashTxt}>Finding your location…</Text>
      </View>
    );
  }

  // During navigation the tab bar is hidden → map fills to bottom edge
  const sheetBottom  = isNavigating ? 0 : TAB_BAR_H + (Platform.OS === 'ios' ? insets.bottom : 0);
  const iosSafeTop   = Platform.OS === 'ios' ? insets.top : 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Full-screen map */}
      <MapShopView
        shops={shops}
        selectedShopId={selectedId}
        routeShopId={routeShopId}
        routeCoords={routeCoords}
        userLocation={userLoc}
        userHeading={userHeading}
        onMarkerPress={selectShop}
        onLocateMe={locateMe}
        mapRef={mapRef}
      />

      {/* ── TOP UI ── */}
      {isNavigating ? (
        // Glassmorphism back pill
        <View style={[styles.navTopBar, { top: STATUS_H + iosSafeTop + 12 }]} pointerEvents="box-none">
          <TouchableOpacity style={styles.backPill} onPress={locateMe} activeOpacity={0.85}>
            <Ionicons name="chevron-back" size={16} color="#1c1c1e" />
            <Text style={styles.backPillText}>End Navigation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Browse header — search + filters
        <View style={[styles.header, { top: STATUS_H + iosSafeTop + 8 }]} pointerEvents="box-none">
          <View pointerEvents="none" style={styles.titleRow}>
            <Text style={styles.titleMain}>Nearby Stores</Text>
            <Text style={styles.titleSub}>{shops.length} registered stores near you</Text>
          </View>
          <View style={styles.searchWrap} pointerEvents="auto">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} onClear={() => setSearchQuery('')} />
          </View>
          <View pointerEvents="auto">
            <TagFilter tags={FILTER_TAGS} selectedTag={activeFilter} onSelect={k => setActiveFilter(k as FilterCategory)} />
          </View>
        </View>
      )}

      {/* Route loading spinner */}
      {routeLoading && (
        <View style={styles.routeLoadingOverlay} pointerEvents="none">
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.routeLoadingText}>Calculating route…</Text>
        </View>
      )}

      {/* Denied notice */}
      {denied && (
        <View style={[styles.notice, { bottom: sheetBottom + SNAP_HALF + 8 }]} pointerEvents="none">
          <Text style={styles.noticeTxt}>📍 Location denied — showing default area</Text>
        </View>
      )}

      {/* ── BOTTOM SHEET ── */}
      <Animated.View style={[styles.sheet, { bottom: sheetBottom, height: sheetH }]}>

        {isNavigating && routeInfo ? (
          // ── Wolt-style ETA navigation bar ──────────────────────────────────
          <View style={styles.etaSheet}>
            <View style={styles.handle} />
            <View style={styles.etaRow}>

              {/* ETA */}
              <View style={styles.etaStat}>
                <Text style={styles.etaValue}>{routeInfo.dur}</Text>
                <Text style={styles.etaLabel}>ETA</Text>
              </View>

              <View style={styles.etaDivider} />

              {/* Distance remaining */}
              <View style={styles.etaStat}>
                <Text style={styles.etaValue}>{routeInfo.dist}</Text>
                <Text style={styles.etaLabel}>Remaining</Text>
              </View>

              {/* Speed — shown when moving */}
              {speedKmh !== null && (
                <>
                  <View style={styles.etaDivider} />
                  <View style={styles.etaStat}>
                    <Text style={styles.etaValue}>{speedKmh}</Text>
                    <Text style={styles.etaLabel}>km/h</Text>
                  </View>
                </>
              )}

              {/* End button */}
              <TouchableOpacity
                style={styles.endBtn}
                onPress={locateMe}
                activeOpacity={0.85}
              >
                <Text style={styles.endBtnText}>End</Text>
              </TouchableOpacity>
            </View>
          </View>

        ) : (
          // ── Browse store list ───────────────────────────────────────────────
          <>
            <View style={styles.handleZone} {...pan.panHandlers}>
              <View style={styles.handle} />
              <View style={styles.sheetTop}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.sheetTitle} numberOfLines={1}>Nearby Stores</Text>
                  <Text style={styles.sheetSub}>{shops.length} stores · {inStockCount} items in stock</Text>
                </View>
                <View style={styles.topRight}>
                  <TouchableOpacity
                    onPress={() => snapTo(lastH.current > SNAP_PEEK + 20 ? SNAP_PEEK : SNAP_FULL)}
                    style={styles.chevronBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={lastH.current > SNAP_PEEK + 20 ? 'chevron-down' : 'chevron-up'}
                      size={17} color="#8e8e93"
                    />
                  </TouchableOpacity>

                  {selectedShop ? (
                    <TouchableOpacity
                      style={[styles.navBtnActive, routeShopId === selectedShop.id && styles.navBtnCancel]}
                      onPress={() => getRoute(selectedShop)}
                      activeOpacity={0.8}
                      disabled={routeLoading}
                    >
                      {routeLoading && routeShopId === selectedShop.id
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Ionicons name={routeShopId === selectedShop.id ? 'close' : 'navigate'} size={12} color="#fff" />
                      }
                      <Text style={styles.navBtnText}>
                        {routeShopId === selectedShop.id ? 'End' : 'Route'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.navBtn}>
                      <Ionicons name="navigate" size={13} color="#8e8e93" />
                    </View>
                  )}
                </View>
              </View>
            </View>

            {shops.length > 0 ? (
              <ScrollView ref={listRef} style={styles.list} contentContainerStyle={styles.listPad} showsVerticalScrollIndicator={false}>
                {shops.map(s => (
                  <StoreCard
                    key={s.id}
                    shop={s}
                    isSelected={s.id === selectedId}
                    hasRoute={s.id === routeShopId}
                    routeLoading={routeLoading && routeShopId === s.id}
                    onPress={() => selectShop(s)}
                    onGetRoute={() => getRoute(s)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={30} color="#c7c7cc" />
                <Text style={styles.emptyTitle}>No stores found</Text>
                <Text style={styles.emptyHint}>Try a different filter</Text>
              </View>
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#000' },
  splash:    { flex: 1, backgroundColor: '#f2f2f7', justifyContent: 'center', alignItems: 'center', gap: 14 },
  splashTxt: { fontSize: 15, color: '#8e8e93', fontWeight: '500' },

  // Browse header
  header: {
    position: 'absolute', left: 0, right: 0, zIndex: 10,
    paddingHorizontal: 14, gap: 6,
  },
  titleRow:  { paddingHorizontal: 2 },
  titleMain: {
    fontSize: 20, fontWeight: '800', color: '#1c1c1e', letterSpacing: -0.3,
    textShadowColor: 'rgba(255,255,255,0.95)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8,
  },
  titleSub: {
    fontSize: 12, color: '#48484a', marginTop: 1,
    textShadowColor: 'rgba(255,255,255,0.85)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  searchWrap: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11, shadowRadius: 14, elevation: 8,
  },

  // Glassmorphism navigation back pill
  navTopBar: { position: 'absolute', left: 14, zIndex: 30 },
  backPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13, shadowRadius: 10, elevation: 6,
  },
  backPillText: { fontSize: 14, fontWeight: '600', color: '#1c1c1e' },

  // Overlays
  routeLoadingOverlay: {
    position: 'absolute', top: '45%', alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 999,
    paddingHorizontal: 18, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 6, zIndex: 40,
  },
  routeLoadingText: { fontSize: 13, fontWeight: '600', color: '#1c1c1e' },
  notice: {
    position: 'absolute', left: 16, right: 16, zIndex: 30,
    backgroundColor: 'rgba(28,28,30,0.82)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  noticeTxt: { fontSize: 12, color: '#fff', textAlign: 'center' },

  // Bottom sheet wrapper
  sheet: {
    position: 'absolute', left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 22,
    zIndex: 20, overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4, borderRadius: 999,
    backgroundColor: 'rgba(60,60,67,0.22)',
    alignSelf: 'center', marginTop: 10, marginBottom: 6,
  },

  // ── ETA navigation bar ───────────────────────────────────────────────────
  etaSheet:   { flex: 1 },
  etaRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 0,
  },
  etaStat:    { flex: 1, alignItems: 'center', paddingVertical: 4 },
  etaValue:   { fontSize: 26, fontWeight: '800', color: '#1c1c1e', letterSpacing: -0.8 },
  etaLabel:   { fontSize: 11, color: '#8e8e93', marginTop: 2, fontWeight: '500' },
  etaDivider: { width: 1, height: 38, backgroundColor: 'rgba(60,60,67,0.12)', marginHorizontal: 4 },
  endBtn: {
    marginLeft: 10, backgroundColor: '#ff3b30',
    borderRadius: 16, paddingHorizontal: 18, paddingVertical: 12,
    shadowColor: '#ff3b30', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  endBtnText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },

  // ── Browse sheet ─────────────────────────────────────────────────────────
  handleZone: { backgroundColor: '#fff', paddingBottom: 2 },
  sheetTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60,60,67,0.08)',
  },
  sheetTitle: { fontSize: 15, fontWeight: '700', color: '#1c1c1e', letterSpacing: -0.2 },
  sheetSub:   { fontSize: 12, color: '#8e8e93', marginTop: 2 },
  topRight:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chevronBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#f2f2f7', justifyContent: 'center', alignItems: 'center',
  },
  navBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#f2f2f7', justifyContent: 'center', alignItems: 'center',
  },
  navBtnActive: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 15, paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35, shadowRadius: 5, elevation: 3,
  },
  navBtnCancel: { backgroundColor: '#ff3b30', shadowColor: '#ff3b30' },
  navBtnText:   { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: -0.1 },
  list:         { flex: 1 },
  listPad:      { paddingHorizontal: 14, paddingVertical: 10 },
  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingBottom: 20 },
  emptyTitle:   { fontSize: 15, fontWeight: '600', color: '#3c3c43' },
  emptyHint:    { fontSize: 13, color: '#aeaeb2' },
});
