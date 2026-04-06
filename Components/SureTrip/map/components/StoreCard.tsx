// map/components/StoreCard.tsx
// Apple Maps-inspired store card — Directions shown on in-app map (no external app)
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Shop, getStockStatus, getStockCounts } from '../data/shopsData';

interface StoreCardProps {
  shop: Shop;
  isSelected: boolean;
  hasRoute: boolean;       // true when this store's route is drawn on map
  routeLoading: boolean;   // true while fetching route for this store
  onPress: () => void;
  onGetRoute: () => void;  // triggers MapTiler Directions fetch → draw on map
}

function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);
  if (status === 'inStock') {
    return (
      <View style={[styles.stockBadge, styles.stockBadgeGreen]}>
        <Text style={[styles.stockBadgeText, styles.stockBadgeTextGreen]}>✓ In Stock</Text>
      </View>
    );
  }
  if (status === 'lowStock') {
    return (
      <View style={[styles.stockBadge, styles.stockBadgeAmber]}>
        <Text style={[styles.stockBadgeText, styles.stockBadgeTextAmber]}>{stock} left</Text>
      </View>
    );
  }
  return (
    <View style={[styles.stockBadge, styles.stockBadgeRed]}>
      <Text style={[styles.stockBadgeText, styles.stockBadgeTextRed]}>Out</Text>
    </View>
  );
}

export default function StoreCard({
  shop, isSelected, hasRoute, routeLoading, onPress, onGetRoute,
}: StoreCardProps) {
  const { inStock, total } = getStockCounts(shop);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} style={styles.cardWrap}>
      <View style={[
        styles.card,
        isSelected && styles.cardSelected,
        hasRoute && styles.cardRouted,
      ]}>
        {/* Accent bar */}
        {isSelected && <View style={[styles.accentBar, hasRoute && styles.accentBarRouted]} />}

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.nameRow}>
              <Text style={styles.storeName} numberOfLines={1}>{shop.name}</Text>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={11} color="#8e8e93" />
                <Text style={styles.metaText}>{shop.distance}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={11} color="#f59e0b" />
                <Text style={styles.metaText}>{shop.rating}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={11} color="#22c55e" />
                <Text style={[styles.metaText, { color: '#22c55e' }]}>Open</Text>
              </View>
            </View>
          </View>

          {/* Right: stock + Route button */}
          <View style={styles.rightCol}>
            <View style={styles.stockRatioBadge}>
              <Text style={styles.stockRatioText}>{inStock}/{total}</Text>
            </View>

            {/* Route button — draws on in-app map only */}
            <TouchableOpacity
              style={[styles.routeBtn, hasRoute && styles.routeBtnActive]}
              onPress={e => { e.stopPropagation?.(); onGetRoute(); }}
              activeOpacity={0.8}
              disabled={routeLoading}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              {routeLoading ? (
                <ActivityIndicator size="small" color="#fff" style={{ width: 12, height: 12 }} />
              ) : (
                <Ionicons
                  name={hasRoute ? 'close' : 'navigate'}
                  size={11}
                  color="#fff"
                />
              )}
              <Text style={styles.routeBtnText}>
                {routeLoading ? '…' : hasRoute ? 'Clear' : 'Route'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Inventory Strip ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.inventoryStrip}
        >
          {shop.inventory.map((item) => (
            <View key={item.id} style={styles.itemChip}>
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <StockBadge stock={item.stock} />
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrap: { marginBottom: 10 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardSelected: {
    backgroundColor: 'rgba(0,122,255,0.03)',
  },
  cardRouted: {
    backgroundColor: 'rgba(0,122,255,0.05)',
    shadowColor: '#007AFF', shadowOpacity: 0.15,
  },

  // Accent bar
  accentBar: {
    position: 'absolute', left: 0, top: 12, bottom: 12,
    width: 3, borderRadius: 999, backgroundColor: '#1c1c1e',
  },
  accentBarRouted: { backgroundColor: '#007AFF' },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
  },
  headerLeft:  { flex: 1, marginRight: 10 },
  nameRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  storeName:   { fontSize: 15, fontWeight: '700', color: '#1c1c1e', flex: 1, letterSpacing: -0.2 },
  metaRow:     { flexDirection: 'row', gap: 10, marginTop: 2 },
  metaItem:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:    { fontSize: 12, color: '#8e8e93', fontWeight: '500' },

  rightCol:    { alignItems: 'flex-end', gap: 6 },

  stockRatioBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
  },
  stockRatioText: { fontSize: 11, fontWeight: '700', color: '#22c55e' },

  // ── Route button — draws road route on in-app map ─────────────────────
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#007AFF',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28, shadowRadius: 5, elevation: 3,
  },
  routeBtnActive: {
    backgroundColor: '#ff3b30',
    shadowColor: '#ff3b30',
  },
  routeBtnText: { fontSize: 11, fontWeight: '700', color: '#ffffff', letterSpacing: -0.1 },

  // Inventory strip
  inventoryStrip: { gap: 6, paddingRight: 4 },
  itemChip: {
    width: 72, padding: 8, borderRadius: 12,
    backgroundColor: 'rgba(240,240,245,0.8)',
    alignItems: 'center', gap: 3, marginRight: 6,
  },
  itemEmoji: { fontSize: 18 },
  itemName:  { fontSize: 9, fontWeight: '500', color: '#1c1c1e', textAlign: 'center', width: '100%' },
  itemPrice: { fontSize: 11, fontWeight: '700', color: '#1c1c1e' },

  // Stock badges
  stockBadge:           { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  stockBadgeText:       { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  stockBadgeGreen:      { backgroundColor: 'rgba(34,197,94,0.12)' },
  stockBadgeTextGreen:  { color: '#22c55e' },
  stockBadgeAmber:      { backgroundColor: 'rgba(245,158,11,0.12)' },
  stockBadgeTextAmber:  { color: '#f59e0b' },
  stockBadgeRed:        { backgroundColor: 'rgba(239,68,68,0.12)' },
  stockBadgeTextRed:    { color: '#ef4444' },
});
