// map/components/StoreCard.tsx
// Apple Maps / Airbnb-inspired store card with inventory strip
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Shop, getStockStatus, getStockCounts } from '../data/shopsData';

const { width: W } = Dimensions.get('window');

interface StoreCardProps {
  shop: Shop;
  isSelected: boolean;
  onPress: () => void;
}

function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);
  if (status === 'inStock') {
    return (
      <View style={[styles.stockBadge, styles.stockBadgeGreen]}>
        <Text style={[styles.stockBadgeText, styles.stockBadgeTextGreen]}>✓ Stock</Text>
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

export default function StoreCard({ shop, isSelected, onPress }: StoreCardProps) {
  const { inStock, total } = getStockCounts(shop);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={styles.cardWrap}
    >
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        {/* Selected accent bar */}
        {isSelected && <View style={styles.accentBar} />}
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Left: name + meta */}
        <View style={styles.headerLeft}>
          <View style={styles.nameRow}>
            <Text style={styles.storeName} numberOfLines={1}>{shop.name}</Text>
            <Ionicons name="chevron-forward" size={15} color="#8e8e93" style={styles.chevron} />
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
              <Ionicons name="time-outline" size={11} color="#8e8e93" />
              <Text style={styles.metaText}>Open</Text>
            </View>
          </View>
        </View>

        {/* Right: stock ratio badge */}
        <View style={styles.stockRatioBadge}>
          <Text style={styles.stockRatioText}>{inStock}/{total}</Text>
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
            <Text style={styles.itemPrice}>${item.price}</Text>
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
    borderRadius: 16,
    padding: 14,
    // No shadow/elevation — keeps Android clean
  },
  cardSelected: {
    // Only a very subtle tint — no border, no shadow
    backgroundColor: 'rgba(28,28,30,0.03)',
  },
  // Left accent bar replaces the ugly selected border
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 999,
    backgroundColor: '#1c1c1e',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: { flex: 1, marginRight: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1e',
    flex: 1,
    letterSpacing: -0.2,
  },
  chevron: { marginLeft: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: '#8e8e93', fontWeight: '500' },

  // Stock ratio badge
  stockRatioBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stockRatioText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22c55e',
  },

  // Inventory strip
  inventoryStrip: {
    gap: 6,
    paddingRight: 4,
  },
  itemChip: {
    width: 68,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(240,240,245,0.7)',
    alignItems: 'center',
    gap: 3,
    marginRight: 6,
  },
  itemEmoji: { fontSize: 18 },
  itemName: {
    fontSize: 9,
    fontWeight: '500',
    color: '#1c1c1e',
    textAlign: 'center',
    width: '100%',
  },
  itemPrice: { fontSize: 11, fontWeight: '700', color: '#1c1c1e' },

  // Stock badges
  stockBadge: { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  stockBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  stockBadgeGreen: { backgroundColor: 'rgba(34,197,94,0.12)' },
  stockBadgeTextGreen: { color: '#22c55e' },
  stockBadgeAmber: { backgroundColor: 'rgba(245,158,11,0.12)' },
  stockBadgeTextAmber: { color: '#f59e0b' },
  stockBadgeRed: { backgroundColor: 'rgba(239,68,68,0.12)' },
  stockBadgeTextRed: { color: '#ef4444' },
});
