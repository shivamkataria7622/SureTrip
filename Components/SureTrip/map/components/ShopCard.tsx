// map/components/ShopCard.tsx
// Responsive Mobbin/Dribbble-inspired bento shop card
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Shop } from '../data/shopsData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Card takes ~78% of screen width so partial next card is visible
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 300);
const IMAGE_HEIGHT = Math.round(CARD_WIDTH * 0.52); // ~52% aspect ratio

interface ShopCardProps {
  shop: Shop;
  isSelected: boolean;
  onPress: () => void;
}

export default function ShopCard({ shop, isSelected, onPress }: ShopCardProps) {
  const availableTags = shop.tags.filter((t) => t.available);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {/* ─── Image with overlay badges ─── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: shop.image }}
          style={[styles.image, { height: IMAGE_HEIGHT }]}
        />
        {/* Category pill top-left */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{shop.category}</Text>
        </View>
        {/* Rating badge top-right */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFB300" />
          <Text style={styles.ratingText}>{shop.rating}</Text>
          <Text style={styles.reviewCount}>({shop.reviewCount})</Text>
        </View>
      </View>

      {/* ─── Card body ─── */}
      <View style={styles.body}>
        {/* Shop name + distance */}
        <View style={styles.nameRow}>
          <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
          <View style={styles.distancePill}>
            <Ionicons name="navigate" size={10} color="#35C2C1" />
            <Text style={styles.distanceText}>{shop.distance}</Text>
          </View>
        </View>

        {/* Open time */}
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={12} color="#869393" />
          <Text style={styles.metaText}>Open until {shop.openUntil}</Text>
          <View style={styles.separator} />
          <View style={styles.relBubble}>
            <View style={[styles.relDot, { opacity: shop.reliability > 90 ? 1 : 0.5 }]} />
            <Text style={styles.relText}>{shop.reliability}% stocked</Text>
          </View>
        </View>

        {/* Reliability progress bar */}
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${shop.reliability}%` as any }]} />
        </View>

        {/* Stock Tags */}
        <View style={styles.tagsRow}>
          {availableTags.slice(0, 3).map((tag) => (
            <View key={tag.name} style={styles.tag}>
              <Ionicons name="checkmark-circle" size={12} color="#35C2C1" />
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
          {availableTags.length > 3 && (
            <View style={styles.moreTag}>
              <Text style={styles.moreText}>+{availableTags.length - 3}</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.ctaText}>View Shop</Text>
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={12} color="#35C2C1" />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export { CARD_WIDTH };

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1D1F29',
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    // Subtle navy glow shadow
    shadowColor: '#3014B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  cardSelected: {
    shadowColor: '#35C2C1',
    shadowOpacity: 0.35,
    // Teal border for selected state
    borderWidth: 1.5,
    borderColor: '#35C2C1',
  },

  // ─── Image ───
  imageContainer: { position: 'relative' },
  image: { width: '100%', resizeMode: 'cover' },
  categoryPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(17,19,28,0.75)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(134,147,147,0.2)',
  },
  categoryPillText: {
    fontSize: 10,
    color: '#BBC9C8',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(17,19,28,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: { fontSize: 11, color: '#E1E1EF', fontWeight: '700' },
  reviewCount: { fontSize: 10, color: '#869393' },

  // ─── Body ───
  body: { padding: 14, gap: 8 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E1E1EF',
    flex: 1,
    letterSpacing: -0.2,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(53,194,193,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  distanceText: { fontSize: 11, color: '#35C2C1', fontWeight: '600' },

  // Meta row
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: '#869393', flex: 1 },
  separator: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#3C4949' },
  relBubble: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  relDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#35C2C1' },
  relText: { fontSize: 11, color: '#5adedd', fontWeight: '600' },

  // Reliability bar
  barTrack: {
    height: 2,
    backgroundColor: 'rgba(60,73,73,0.4)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#35C2C1',
    borderRadius: 1,
  },

  // Tags
  tagsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(53,194,193,0.1)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 10, color: '#5adedd', fontWeight: '600' },
  moreTag: {
    backgroundColor: 'rgba(134,147,147,0.12)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  moreText: { fontSize: 10, color: '#869393', fontWeight: '600' },

  // CTA
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(53,194,193,0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(53,194,193,0.25)',
    marginTop: 2,
  },
  ctaText: { color: '#35C2C1', fontWeight: '700', fontSize: 13 },
  ctaArrow: {
    backgroundColor: 'rgba(53,194,193,0.15)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
