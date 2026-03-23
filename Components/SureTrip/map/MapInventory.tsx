// map/MapInventory.tsx
// Full-screen map with 3-snap draggable bottom sheet, correct tab bar offset
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

// Tab bar actual height (from BuyerApp.tsx — height:80, paddingBottom:10)
const TAB_BAR_H = 80;
const STATUS_H  = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
const { height: SCREEN_H } = Dimensions.get('window');

// Usable height = screen minus status bar minus tab bar
const USABLE_H = SCREEN_H - STATUS_H - TAB_BAR_H;

// 3 snap points (heights of the sheet above the tab bar)
const SNAP_PEEK      = 72;                           // handle + title only
const SNAP_HALF      = Math.round(USABLE_H * 0.38);  // half-expanded, shows cards
const SNAP_FULL      = Math.round(USABLE_H * 0.78);  // full list

function snap(val: number, vy: number): number {
  if (vy >  0.6) return SNAP_PEEK;   // fast swipe down → minimize
  if (vy < -0.6) return SNAP_FULL;   // fast swipe up   → expand
  const mid1 = (SNAP_PEEK + SNAP_HALF) / 2;
  const mid2 = (SNAP_HALF + SNAP_FULL) / 2;
  if (val < mid1) return SNAP_PEEK;
  if (val < mid2) return SNAP_HALF;
  return SNAP_FULL;
}

export default function MapInventory() {
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery]   = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [userLoc, setUserLoc]           = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading]           = useState(true);
  const [denied, setDenied]             = useState(false);

  const mapRef   = useRef<MapView>(null);
  const listRef  = useRef<ScrollView>(null);

  // ── Bottom sheet animation ─────────────────────────────────────────────────
  const sheetH  = useRef(new Animated.Value(SNAP_HALF)).current;
  const lastH   = useRef(SNAP_HALF);

  const snapTo = useCallback((target: number) => {
    lastH.current = target;
    Animated.spring(sheetH, {
      toValue: target,
      stiffness: 300,
      damping: 38,
      useNativeDriver: false,
    }).start();
  }, [sheetH]);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dy) > 4,
    onPanResponderGrant:  () => { sheetH.stopAnimation(); },
    onPanResponderMove:   (_, g) => {
      const next = Math.max(SNAP_PEEK, Math.min(SNAP_FULL, lastH.current - g.dy));
      sheetH.setValue(next);
    },
    onPanResponderRelease: (_, g) => {
      const cur = lastH.current - g.dy;
      snapTo(snap(cur, g.vy));
    },
  })).current;

  // ── Location ───────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDenied(true);
        setUserLoc({ latitude: 15.76, longitude: 78.04 });
        setLoading(false);
        return;
      }
      try {
        const r = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const c = { latitude: r.coords.latitude, longitude: r.coords.longitude };
        setUserLoc(c);
        setTimeout(() => {
          mapRef.current?.animateToRegion({ ...c, latitudeDelta: 0.028, longitudeDelta: 0.028 }, 800);
        }, 300);
      } catch {
        setUserLoc({ latitude: 15.76, longitude: 78.04 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const shops = useMemo<Shop[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return DUMMY_SHOPS.filter(s => {
      const catOk = activeFilter === 'all' || s.inventory.some(i => i.category === activeFilter);
      const qOk   = !q || s.name.toLowerCase().includes(q) || s.inventory.some(i => i.name.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [searchQuery, activeFilter]);

  // ── Interactions ───────────────────────────────────────────────────────────
  const selectShop = useCallback((shop: Shop) => {
    setSelectedId(shop.id);
    mapRef.current?.animateToRegion(
      { latitude: shop.latitude, longitude: shop.longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 500
    );
    snapTo(SNAP_HALF);
  }, [snapTo]);

  const locateMe = useCallback(() => {
    setSelectedId(null);
    if (userLoc) {
      mapRef.current?.animateToRegion({ ...userLoc, latitudeDelta: 0.028, longitudeDelta: 0.028 }, 450);
    }
    snapTo(SNAP_HALF);
  }, [userLoc, snapTo]);

  const inStockCount = shops.reduce((acc, s) => acc + s.inventory.filter(i => i.stock > 0).length, 0);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.splash, { paddingTop: STATUS_H }]}>
        <ActivityIndicator size="large" color="#1c1c1e" />
        <Text style={styles.splashTxt}>Finding your location…</Text>
      </View>
    );
  }

  // Extra safe-area bottom on iOS notch phones
  const iosSafeBottom = Platform.OS === 'ios' ? insets.bottom : 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ─── MAP (fills full screen, behind everything) ─── */}
      <View style={[styles.mapLayer, { top: STATUS_H, bottom: TAB_BAR_H + iosSafeBottom }]}>
        <MapShopView
          shops={shops}
          selectedShopId={selectedId}
          onMarkerPress={selectShop}
          onLocateMe={locateMe}
          mapRef={mapRef}
          userLocation={userLoc}
        />
      </View>

      {/* ─── FLOATING HEADER (sits over map) ─── */}
      <View style={[styles.header, { top: STATUS_H + (Platform.OS === 'ios' ? insets.top : 12) }]} pointerEvents="box-none">
        {/* "Nearby Stores" title */}
        <View pointerEvents="none" style={styles.titleRow}>
          <Text style={styles.titleMain}>Nearby Stores</Text>
          <Text style={styles.titleSub}>{shops.length} registered stores near you</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap} pointerEvents="auto">
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} onClear={() => setSearchQuery('')} />
        </View>

        {/* Filter chips */}
        <View pointerEvents="auto">
          <TagFilter tags={FILTER_TAGS} selectedTag={activeFilter} onSelect={k => setActiveFilter(k as FilterCategory)} />
        </View>
      </View>

      {/* ─── DENIED NOTICE ─── */}
      {denied && (
        <View style={[styles.notice, { bottom: TAB_BAR_H + iosSafeBottom + SNAP_HALF + 8 }]} pointerEvents="none">
          <Text style={styles.noticeTxt}>📍 Location denied — showing 15.76°N 78.04°E</Text>
        </View>
      )}

      {/* ─── BOTTOM SHEET ─── */}
      <Animated.View style={[styles.sheet, { bottom: TAB_BAR_H + iosSafeBottom, height: sheetH }]}>

        {/* Drag handle zone */}
        <View style={styles.handleZone} {...pan.panHandlers}>
          <View style={styles.handle} />
          <View style={styles.sheetTop}>
            <View>
              <Text style={styles.sheetTitle}>Nearby Stores</Text>
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
                  size={17}
                  color="#8e8e93"
                />
              </TouchableOpacity>
              <View style={styles.navBtn}>
                <Ionicons name="navigate" size={13} color="#fff" />
              </View>
            </View>
          </View>
        </View>

        {/* Store list */}
        {shops.length > 0 ? (
          <ScrollView
            ref={listRef}
            style={styles.list}
            contentContainerStyle={styles.listPad}
            showsVerticalScrollIndicator={false}
          >
            {shops.map(s => (
              <StoreCard
                key={s.id}
                shop={s}
                isSelected={s.id === selectedId}
                onPress={() => selectShop(s)}
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f2f2f7' },

  splash: {
    flex: 1, backgroundColor: '#f2f2f7',
    justifyContent: 'center', alignItems: 'center', gap: 14,
  },
  splashTxt: { fontSize: 15, color: '#8e8e93', fontWeight: '500' },

  // Map — positioned absolutely so it truly fills behind the bottom sheet
  mapLayer: { position: 'absolute', left: 0, right: 0 },

  // Floating header
  header: {
    position: 'absolute', left: 0, right: 0, zIndex: 10,
    paddingHorizontal: 14, gap: 6,
  },
  titleRow: { paddingHorizontal: 2, marginBottom: 0 },
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

  // Location denied notice
  notice: {
    position: 'absolute', left: 16, right: 16, zIndex: 30,
    backgroundColor: 'rgba(28,28,30,0.82)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  noticeTxt: { fontSize: 12, color: '#fff', textAlign: 'center' },

  // Bottom sheet
  sheet: {
    position: 'absolute', left: 0, right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1, shadowRadius: 18, elevation: 20,
    zIndex: 20, overflow: 'hidden',
  },
  handleZone: { backgroundColor: '#fff', paddingTop: 8, paddingBottom: 2 },
  handle: {
    width: 36, height: 4, borderRadius: 999,
    backgroundColor: 'rgba(60,60,67,0.22)',
    alignSelf: 'center', marginBottom: 10,
  },
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
    backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center',
  },

  list: { flex: 1 },
  listPad: { paddingHorizontal: 14, paddingVertical: 10 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingBottom: 20 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: '#3c3c43' },
  emptyHint:  { fontSize: 13, color: '#aeaeb2' },
});
