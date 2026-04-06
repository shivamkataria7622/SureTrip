import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar, Animated } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Pharmacy', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', color: '#E8F5E9' },
  { id: '2', name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop', color: '#FBE9E7' },
  { id: '3', name: 'Dairy & Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', color: '#E3F2FD' },
  { id: '4', name: 'Munchies', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#FFF3E0' },
  { id: '5', name: 'Hardware', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop', color: '#ECEFF1' },
  { id: '6', name: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop', color: '#F3E5F5' },
  { id: '7', name: 'Meats', image: 'https://images.unsplash.com/photo-1602192103300-8b171f28b2d1?w=300&h=300&fit=crop', color: '#FFEBEE' },
  { id: '8', name: 'Cleaning', image: 'https://images.unsplash.com/photo-1585421514284-efe1621bf302?w=300&h=300&fit=crop', color: '#E0F7FA' },
];

const BESTSELLERS = [
  { id: '1', name: 'Amul Taaza Milk', weight: '500 ml', price: '₹28', time: '200m', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop' },
  { id: '2', name: 'Lays Magic Masala', weight: '50 g', price: '₹20', time: '400m', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop' },
  { id: '3', name: 'Crocin Advance', weight: '15 Tablets', price: '₹40', time: '1.2km', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' },
  { id: '4', name: 'Dettol Handwash', weight: '200 ml', price: '₹99', time: '350m', image: 'https://images.unsplash.com/photo-1584305574647-068307db3522?w=200&h=200&fit=crop' },
];

export default function DiscoveryHome({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        
        {/* Premium Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>SureTrip</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={12} color="#11706b" />
              <Text style={styles.locationText}>Connaught Place, Delhi</Text>
              <Feather name="chevron-down" size={14} color="#888" />
            </View>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' }} style={styles.profileImg} />
          </TouchableOpacity>
        </View>

        {/* Elegant Mock Search Bar */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.mockSearchBar} onPress={onOpenSearch} activeOpacity={0.9}>
            <View style={styles.mockSearchLeft}>
              <Feather name="search" size={20} color="#11706b" />
              <Text style={styles.mockSearchText}>Find anything nearby...</Text>
            </View>
            <View style={styles.mockSearchRight}>
              <View style={styles.divider} />
              <Feather name="mic" size={18} color="#11706b" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Premium Promo Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
          <TouchableOpacity style={[styles.bannerCard, { backgroundColor: '#F0F9F8' }]} activeOpacity={0.9} onPress={onOpenSearch}>
            <View style={styles.bannerTextContainer}>
              <View style={styles.bannerBadge}><Text style={styles.bannerBadgeText}>NEW</Text></View>
              <Text style={styles.bannerTitle}>Check Local{'\n'}Inventory</Text>
              <Text style={styles.bannerSubTitle}>Find what you need instantly.</Text>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop' }} style={styles.bannerImage} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bannerCard, { backgroundColor: '#FFF4E5' }]} activeOpacity={0.9} onPress={onOpenSearch}>
            <View style={styles.bannerTextContainer}>
              <View style={[styles.bannerBadge, { backgroundColor: '#FFEDD5' }]}><Text style={[styles.bannerBadgeText, { color: '#C2410C' }]}>EXPRESS</Text></View>
              <Text style={[styles.bannerTitle, { color: '#431407' }]}>Reserve &{'\n'}Pickup</Text>
              <Text style={[styles.bannerSubTitle, { color: '#78350F' }]}>Hold items directly via UPI.</Text>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' }} style={styles.bannerImage} />
          </TouchableOpacity>
        </ScrollView>

        {/* Polished Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop By Category</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                <View style={styles.categoryImageBg}>
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Premium Bestsellers */}
        <View style={styles.bestsellersSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>High Demand Nearby</Text>
            <TouchableOpacity onPress={onOpenSearch}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
            {BESTSELLERS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.productCard} onPress={onOpenSearch} activeOpacity={0.95}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.timePill}>
                    <Feather name="navigation" size={10} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.timePillText}>{item.time}</Text>
                  </View>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productWeight}>{item.weight}</Text>
                </View>
                
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>Find</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 130 },
  
  // Premium Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  appName: { fontSize: 26, fontWeight: '800', color: '#111', letterSpacing: -0.8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 13, color: '#555', fontWeight: '500' },
  profileBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', overflow: 'hidden', borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  profileImg: { width: '100%', height: '100%' },
  
  // Elegant Search Bar
  searchSection: { paddingHorizontal: 20, marginBottom: 24, marginTop: 10 },
  mockSearchBar: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    backgroundColor: '#FFFFFF', height: 56, borderRadius: 16, paddingHorizontal: 16,
    shadowColor: '#11706b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8,
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  mockSearchLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mockSearchText: { fontSize: 16, color: '#888', fontWeight: '500' },
  mockSearchRight: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 24, backgroundColor: '#EBEBEB', marginHorizontal: 12 },
  
  // Banner Clean
  bannerScroll: { marginBottom: 36, paddingBottom: 8 },
  bannerCard: { width: width * 0.85, height: 160, borderRadius: 24, flexDirection: 'row', overflow: 'hidden', position: 'relative' },
  bannerTextContainer: { flex: 1, padding: 24, justifyContent: 'center', zIndex: 2 },
  bannerBadge: { backgroundColor: '#D1FAE5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  bannerBadgeText: { fontSize: 10, fontWeight: '800', color: '#059669', letterSpacing: 0.5 },
  bannerTitle: { color: '#004D40', fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6, lineHeight: 26 },
  bannerSubTitle: { color: '#00695C', fontSize: 13, opacity: 0.8, fontWeight: '500' },
  bannerImage: { width: 150, height: '100%', position: 'absolute', right: 0, bottom: 0, resizeMode: 'cover', opacity: 0.9 },
  
  // Categories Polished
  categoriesSection: { paddingHorizontal: 20, marginBottom: 36 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111', letterSpacing: -0.5, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24 },
  categoryCard: { width: (width - 40 - 45) / 4, alignItems: 'center' },
  categoryImageBg: { width: '100%', aspectRatio: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 8, backgroundColor: '#F9FAFB' },
  categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#444', textAlign: 'center' },
  
  // Bestsellers Premium
  bestsellersSection: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  seeAllText: { fontSize: 14, color: '#11706b', fontWeight: '700' },
  horizontalScroll: { paddingBottom: 20 },
  productCard: { 
    width: 160, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: '#F5F5F5'
  },
  productImageContainer: { width: '100%', height: 130, borderRadius: 16, backgroundColor: '#F9FAFB', overflow: 'hidden', marginBottom: 12, position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  timePill: { position: 'absolute', bottom: 8, left: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(17, 112, 107, 0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timePillText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  productInfo: { paddingHorizontal: 4, marginBottom: 16 },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  productWeight: { fontSize: 13, color: '#888' },
  addButton: { width: '100%', borderRadius: 12, paddingVertical: 10, alignItems: 'center', backgroundColor: '#F0F9F8', borderWidth: 1, borderColor: '#D1FAE5' },
  addButtonText: { color: '#059669', fontSize: 13, fontWeight: '700' },
});
