// map/components/MapShopView.tsx
// Wolt/Lyft-level premium map: minimalist tile · pulsing puck · glow route · pitch camera
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, Animated,
} from 'react-native';
import MapView, {
  Marker, UrlTile, PROVIDER_GOOGLE, PROVIDER_DEFAULT, Polyline,
} from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { type Shop, getMarkerDotColor } from '../data/shopsData';

const MAPTILER_KEY = 'saoTGbFj0G8Qo0JPqSs6';

// ── Minimalist MapTiler tile (basic-v2 = clean, no clutter) ─────────────────
// Hides most POI noise, clean roads and water only
const TILE_URL = `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

type LatLng = { latitude: number; longitude: number };

function catEmoji(shop: Shop): string {
  const cats = shop.inventory.map(i => i.category);
  if (
    cats.filter(c => c === 'electrical').length >= cats.filter(c => c === 'plumbing').length &&
    cats.includes('electrical')
  ) return '⚡';
  if (cats.includes('plumbing')) return '🔧';
  return '🔨';
}

function shortLabel(name: string): string {
  const w = name.split(' ')[0];
  return w.length > 9 ? w.slice(0, 8) + '…' : w;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pulsing User Location Puck
// Uses Animated.Value (NOT AnimatedRegion — safe for RN 0.81)
// ─────────────────────────────────────────────────────────────────────────────
function PulsingUserPuck({ heading }: { heading: number }) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopRing = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );

    const a1 = loopRing(ring1, 0);
    const a2 = loopRing(ring2, 900);
    a1.start();
    a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, [ring1, ring2]);

  const ringStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.65, 0.3, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 3.8] }) }],
  });

  return (
    <View style={puckStyles.wrap}>
      {/* Two offset pulsing rings */}
      <Animated.View style={[puckStyles.ring, ringStyle(ring1)]} />
      <Animated.View style={[puckStyles.ring, ringStyle(ring2)]} />

      {/* Direction cone (rotates to bearing) */}
      <View
        style={[puckStyles.cone, { transform: [{ rotate: `${heading - 90}deg` }] }]}
      />

      {/* Main blue dot with white border */}
      <View style={puckStyles.dot}>
        <View style={puckStyles.dotCore} />
      </View>
    </View>
  );
}

const puckStyles = StyleSheet.create({
  wrap: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,122,255,0.35)',
  },
  cone: {
    position: 'absolute',
    width: 0, height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 12,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'rgba(0,122,255,0.4)',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    top: 6,
  },
  dot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#007AFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 8,
  },
  dotCore: {
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#fff',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Premium store destination marker (floating card style)
// ─────────────────────────────────────────────────────────────────────────────
function DestinationCard({ shop }: { shop: Shop }) {
  return (
    <View style={destStyles.container}>
      <View style={destStyles.card}>
        <Text style={destStyles.emoji}>{catEmoji(shop)}</Text>
        <View>
          <Text style={destStyles.name} numberOfLines={1}>{shortLabel(shop.name)}</Text>
          <Text style={destStyles.dist}>{shop.distance} away</Text>
        </View>
      </View>
      <View style={destStyles.stem} />
      <View style={destStyles.dot} />
    </View>
  );
}

const destStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#1c1c1e',
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 10,
  },
  emoji: { fontSize: 20 },
  name:  { fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: -0.2, maxWidth: 100 },
  dist:  { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 },
  stem:  {
    width: 2.5, height: 12, borderRadius: 2,
    backgroundColor: '#1c1c1e', marginTop: -1,
  },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#1c1c1e',
    borderWidth: 2.5, borderColor: '#fff',
    marginTop: -1,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  shops:          Shop[];
  selectedShopId: string | null;
  routeShopId:    string | null;
  routeCoords:    LatLng[];
  userLocation:   LatLng | null;
  userHeading:    number;
  onMarkerPress:  (shop: Shop) => void;
  onLocateMe:     () => void;
  mapRef:         React.RefObject<MapView>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function MapShopView({
  shops, selectedShopId, routeShopId, routeCoords,
  userLocation, userHeading,
  onMarkerPress, onLocateMe, mapRef,
}: Props) {
  const hasRoute    = routeCoords.length >= 2;
  const routedShop  = routeShopId ? shops.find(s => s.id === routeShopId) : null;

  // When navigating show only the destination + user; otherwise show all stores
  const visibleShops = hasRoute
    ? shops.filter(s => s.id === routeShopId)
    : shops;

  // Ambient trail only when not navigating
  const ambientCoords = React.useMemo(() => {
    if (hasRoute || shops.length < 2) return [];
    return [...shops]
      .sort((a, b) => a.latitude - b.latitude)
      .map(s => ({ latitude: s.latitude, longitude: s.longitude }));
  }, [shops, hasRoute]);

  const initialRegion = {
    latitude:      userLocation?.latitude  ?? 15.76,
    longitude:     userLocation?.longitude ?? 78.04,
    latitudeDelta: 0.028, longitudeDelta: 0.028,
  };

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={false}    // we draw our own pulsing puck
        showsMyLocationButton={false}
        showsCompass={false}
        showsBuildings
        showsTraffic={false}
        mapType="standard"
        rotateEnabled
        pitchEnabled                 // enabled for 3D navigation tilt
      >
        {/* ── Minimalist MapTiler tile ── */}
        <UrlTile urlTemplate={TILE_URL} maximumZ={19} flipY={false} zIndex={-3} tileSize={256} />

        {/* ── Ambient discovery dashes (browse mode only) ── */}
        {!hasRoute && ambientCoords.length > 1 && (
          <Polyline
            coordinates={ambientCoords}
            strokeColor="rgba(130,130,210,0.15)"
            strokeWidth={2}
            lineDashPattern={[4, 10]}
            zIndex={1}
          />
        )}

        {/* ── Premium 3-layer OSRM route polyline ── */}
        {hasRoute && (
          <>
            {/* Wide outer glow */}
            <Polyline
              coordinates={routeCoords}
              strokeColor="rgba(0,122,255,0.12)"
              strokeWidth={22}
              lineCap="round"
              lineJoin="round"
              zIndex={2}
            />
            {/* Mid glow */}
            <Polyline
              coordinates={routeCoords}
              strokeColor="rgba(0,122,255,0.25)"
              strokeWidth={12}
              lineCap="round"
              lineJoin="round"
              zIndex={3}
            />
            {/* Solid brand-blue line */}
            <Polyline
              coordinates={routeCoords}
              strokeColor="#007AFF"
              strokeWidth={5.5}
              lineCap="round"
              lineJoin="round"
              zIndex={4}
            />
            {/* White center highlight */}
            <Polyline
              coordinates={routeCoords}
              strokeColor="rgba(255,255,255,0.55)"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
              zIndex={5}
            />
          </>
        )}

        {/* ── Store markers ── */}
        {visibleShops.map(shop => {
          const sel      = shop.id === selectedShopId;
          const isRouted = shop.id === routeShopId;
          const dot      = getMarkerDotColor(shop);
          const emoji    = catEmoji(shop);
          const name     = shortLabel(shop.name);

          if (isRouted) {
            // Premium floating destination card (Wolt-style)
            return (
              <Marker
                key={shop.id}
                coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                onPress={() => onMarkerPress(shop)}
                tracksViewChanges={false}
                anchor={{ x: 0.5, y: 1 }}
                zIndex={15}
              >
                <View style={{ padding: 6 }}>
                  <DestinationCard shop={shop} />
                </View>
              </Marker>
            );
          }

          return (
            <Marker
              key={shop.id}
              coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
              onPress={() => onMarkerPress(shop)}
              tracksViewChanges={false}
              anchor={{ x: 0.5, y: 1 }}
              zIndex={sel ? 10 : 1}
            >
              <View style={styles.markerWrapper}>
                {sel ? (
                  <View style={styles.selContainer}>
                    <View style={styles.selPill}>
                      <Text style={styles.selEmoji}>{emoji}</Text>
                      <Text style={styles.selLabel}>{name}</Text>
                      <View style={[styles.selDot, { backgroundColor: dot }]} />
                    </View>
                    <View style={styles.selPointer} />
                  </View>
                ) : (
                  <View style={styles.defContainer}>
                    <View style={styles.defPill}>
                      <Text style={styles.defEmoji}>{emoji}</Text>
                      <View style={[styles.defDot, { backgroundColor: dot }]} />
                    </View>
                    <View style={styles.defPointer} />
                  </View>
                )}
              </View>
            </Marker>
          );
        })}

        {/* ── Pulsing user location puck ──
            tracksViewChanges={true} needed so the animation renders through.
            Only 1 marker uses this — acceptable performance cost.               ── */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            tracksViewChanges
            zIndex={20}
          >
            <PulsingUserPuck heading={userHeading} />
          </Marker>
        )}
      </MapView>

      {/* ── Locate Me FAB ── */}
      <TouchableOpacity style={styles.fab} onPress={onLocateMe} activeOpacity={0.8}>
        <Ionicons
          name="locate-outline"
          size={18}
          color={hasRoute ? '#007AFF' : '#1c1c1e'}
        />
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e8eaed' },

  markerWrapper: { padding: 8, alignItems: 'center' },

  defContainer: { alignItems: 'center' },
  defPill: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 6,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)',
  },
  defEmoji:   { fontSize: 14 },
  defDot:     { width: 6, height: 6, borderRadius: 3 },
  defPointer: {
    width: 8, height: 8, backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }], marginTop: -5,
    borderRightWidth: 1.5, borderBottomWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  selContainer: { alignItems: 'center' },
  selPill: {
    backgroundColor: '#1c1c1e', borderRadius: 22,
    paddingHorizontal: 12, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22, shadowRadius: 8, elevation: 6,
  },
  selEmoji:   { fontSize: 14 },
  selLabel:   { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: -0.1 },
  selDot:     { width: 7, height: 7, borderRadius: 3.5 },
  selPointer: {
    width: 10, height: 10, backgroundColor: '#1c1c1e',
    transform: [{ rotate: '45deg' }], marginTop: -6, borderRadius: 1,
  },

  fab: {
    position: 'absolute', right: 14, bottom: '30%',
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
});
