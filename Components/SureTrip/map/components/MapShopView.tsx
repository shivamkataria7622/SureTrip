// map/components/MapShopView.tsx
// Clean, modern teardrop-style map markers — no ugly shadows on selection
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { type Shop, getMarkerDotColor } from '../data/shopsData';

const MAPTILER_KEY = 'saoTGbFj0G8Qo0JPqSs6';
const TILE_URL     = `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

// Category emoji
function catEmoji(shop: Shop): string {
  const cats = shop.inventory.map(i => i.category);
  if (cats.filter(c => c === 'electrical').length >= cats.filter(c => c === 'plumbing').length
    && cats.includes('electrical')) return '⚡';
  if (cats.includes('plumbing'))   return '🔧';
  return '🔨';
}

// First word of name, max 9 chars
function label(name: string): string {
  const w = name.split(' ')[0];
  return w.length > 9 ? w.slice(0, 8) + '…' : w;
}

interface Props {
  shops: Shop[];
  selectedShopId: string | null;
  onMarkerPress: (shop: Shop) => void;
  onLocateMe: () => void;
  mapRef: React.RefObject<MapView>;
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function MapShopView({ shops, selectedShopId, onMarkerPress, onLocateMe, mapRef, userLocation }: Props) {
  const region = {
    latitude:      userLocation?.latitude  ?? 15.76,
    longitude:     userLocation?.longitude ?? 78.04,
    latitudeDelta: 0.028,
    longitudeDelta: 0.028,
  };

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsBuildings={false}
        showsTraffic={false}
        mapType="standard"
        rotateEnabled={false}
      >
        <UrlTile urlTemplate={TILE_URL} maximumZ={19} flipY={false} zIndex={-3} tileSize={256} />

        {shops.map(shop => {
          const sel   = shop.id === selectedShopId;
          const dot   = getMarkerDotColor(shop);
          const emoji = catEmoji(shop);
          const name  = label(shop.name);

          return (
            <Marker
              key={shop.id}
              coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
              onPress={() => onMarkerPress(shop)}
              tracksViewChanges={false}
              // anchor at bottom-center of the pointer tip
              anchor={{ x: 0.5, y: 1 }}
              zIndex={sel ? 10 : 1}
            >
              {/*
               * IMPORTANT: wrap in a padded View so react-native-maps
               * doesn't clip the content at the edges.
               * The padding absorbs any overflow from the pill/shadow.
               */}
              <View style={styles.wrapper}>
                {sel ? (
                  // ── SELECTED: dark rounded badge with store name ──────────
                  <View style={styles.selContainer}>
                    <View style={styles.selPill}>
                      <Text style={styles.selEmoji}>{emoji}</Text>
                      <Text style={styles.selLabel}>{name}</Text>
                      <View style={[styles.selDot, { backgroundColor: dot }]} />
                    </View>
                    {/* clean pointer — no shadow */}
                    <View style={styles.selPointer} />
                  </View>
                ) : (
                  // ── UNSELECTED: compact white circle badge ──────────────
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
      </MapView>

      {/* Locate Me FAB */}
      <TouchableOpacity style={styles.fab} onPress={onLocateMe} activeOpacity={0.8}>
        <Ionicons name="locate-outline" size={18} color="#1c1c1e" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e8eaed' },

  // Extra padding prevents react-native-maps from clipping content
  wrapper: {
    padding: 8,
    alignItems: 'center',
  },

  // ── UNSELECTED ──────────────────────────────────────────────────────────
  defContainer: { alignItems: 'center' },
  defPill: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // No elevation/shadowColor — avoids Android ugly selected shadow
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  defEmoji: { fontSize: 14 },
  defDot: { width: 6, height: 6, borderRadius: 3 },
  // Tiny downward pointer
  defPointer: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
    marginTop: -5,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  // ── SELECTED ────────────────────────────────────────────────────────────
  selContainer: { alignItems: 'center' },
  selPill: {
    backgroundColor: '#1c1c1e',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    // NO shadow/elevation — keeps it clean
  },
  selEmoji: { fontSize: 14 },
  selLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.1,
  },
  selDot: { width: 7, height: 7, borderRadius: 3.5 },
  // Clean dark pointer
  selPointer: {
    width: 10,
    height: 10,
    backgroundColor: '#1c1c1e',
    transform: [{ rotate: '45deg' }],
    marginTop: -6,
    borderRadius: 1,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 14,
    bottom: '40%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
});
