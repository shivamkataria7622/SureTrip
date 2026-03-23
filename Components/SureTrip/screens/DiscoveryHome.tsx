import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Pharmacy', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', color: '#E8FDF5' },
  { id: '2', name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop', color: '#FFF3E0' },
  { id: '3', name: 'Dairy & Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop', color: '#EEF0FF' },
  { id: '4', name: 'Munchies', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop', color: '#FCE4EC' },
  { id: '5', name: 'Hardware', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop', color: '#F5F5F5' },
  { id: '6', name: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop', color: '#E3F2FD' },
  { id: '7', name: 'Meats', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bd682f?w=300&h=300&fit=crop', color: '#FFEBEE' },
  { id: '8', name: 'Cleaning', image: 'https://images.unsplash.com/photo-1584820927498-cafe5c152a00?w=300&h=300&fit=crop', color: '#E0F7FA' },
];

const BESTSELLERS = [
  { id: '1', name: 'Amul Taaza Milk', weight: '500 ml', price: '₹28', time: '200m away', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop' },
  { id: '2', name: 'Lays India\'s Magic Masala', weight: '50 g', price: '₹20', time: '400m away', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop' },
  { id: '3', name: 'Crocin Advance', weight: '15 Tablets', price: '₹40', time: '1.2km away', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' },
  { id: '4', name: 'Dettol Handwash', weight: '200 ml', price: '₹99', time: '350m away', image: 'https://images.unsplash.com/photo-1584305574647-068307db3522?w=200&h=200&fit=crop' },
];

export default function DiscoveryHome({ onOpenSearch }: { onOpenSearch?: () => void }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header - Discovery/Pickup Style */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.deliveryBadge}>
              <MaterialCommunityIcons name="target" size={16} color="#FFF" />
              <Text style={styles.deliveryTimeText}>LOCAL</Text>
            </View>
            <View style={styles.locationContainer}>
              <Text style={styles.locationTitle}>Shopping near</Text>
              <View style={styles.locationSubRow}>
                <Text style={styles.locationSubText} numberOfLines={1}>Connaught Place, Block B...</Text>
                <Feather name="chevron-down" size={16} color="#111" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* Search Bar (Looks like a button) */}
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.9} onPress={onOpenSearch}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.searchPlaceholderText}>Find it locally before you walk...</Text>
          </View>
          <View style={styles.divider} />
          <Feather name="mic" size={20} color="#3014b8" style={styles.micIcon} />
        </TouchableOpacity>

        {/* Promo Banner */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <View style={[styles.bannerCard, { backgroundColor: '#3014b8' }]}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>DONT WASTE TRIPS</Text>
              <Text style={styles.bannerSubTitle}>Check store inventory instantly around you.</Text>
              <TouchableOpacity style={styles.bannerBtn} onPress={onOpenSearch}>
                <Text style={styles.bannerBtnText}>Start Scanning</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop' }} style={styles.bannerImage} />
          </View>
          <View style={[styles.bannerCard, { backgroundColor: '#059669' }]}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>RESERVE NOW</Text>
              <Text style={styles.bannerSubTitle}>Hold an item, pay via UPI, pick up when ready.</Text>
              <TouchableOpacity style={[styles.bannerBtn, { backgroundColor: '#047857' }]} onPress={onOpenSearch}>
                <Text style={styles.bannerBtnText}>Explore Shops</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' }} style={styles.bannerImage} />
          </View>
        </ScrollView>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category Near You</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                <View style={[styles.categoryImageBg, { backgroundColor: cat.color }]}>
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Needs Row */}
        <View style={styles.bestsellersSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>In High Demand Nearby</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {BESTSELLERS.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.timeTag}>
                    <Feather name="map-pin" size={10} color="#111" />
                    <Text style={styles.timeTagText}>{item.time}</Text>
                  </View>
                </View>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productWeight}>{item.weight}</Text>
                
                <TouchableOpacity style={styles.addButton} onPress={onOpenSearch}>
                  <Text style={styles.addButtonText}>FIND NEARBY</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 120 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  deliveryBadge: { backgroundColor: '#3014b8', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  deliveryTimeText: { color: '#FFF', fontSize: 10, fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
  locationContainer: { flex: 1 },
  locationTitle: { fontSize: 14, fontWeight: '700', color: '#666' },
  locationSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 0 },
  locationSubText: { fontSize: 16, fontWeight: '800', color: '#111', flexShrink: 1, marginRight: 2, letterSpacing: -0.3 },
  profileBtn: { marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#EBEBEB' },
  
  // Search Bar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', marginHorizontal: 16, borderRadius: 16, height: 52, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EBEBEB' },
  searchIcon: { marginRight: 12 },
  searchPlaceholderText: { fontSize: 15, color: '#666', fontWeight: '500' },
  divider: { width: 1, height: 24, backgroundColor: '#DDD', marginHorizontal: 12 },
  micIcon: {},
  
  // Promo Banner
  bannerScroll: { marginBottom: 24, paddingBottom: 10 },
  bannerCard: { width: width * 0.8, height: 160, borderRadius: 20, marginRight: 16, flexDirection: 'row', overflow: 'hidden' },
  bannerTextContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  bannerTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  bannerSubTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 16, lineHeight: 18 },
  bannerBtn: { backgroundColor: '#1E097C', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  bannerImage: { width: 120, height: 160, resizeMode: 'cover' },
  
  // Categories Section
  categoriesSection: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111', letterSpacing: -0.5, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  categoryCard: { width: (width - 32 - 36) / 4, alignItems: 'center', marginBottom: 16 },
  categoryImageBg: { width: '100%', aspectRatio: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 8, padding: 8, alignItems: 'center', justifyContent: 'flex-end' },
  categoryImage: { width: '90%', height: '90%', resizeMode: 'contain' },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#444', textAlign: 'center' },
  
  // Bestsellers
  bestsellersSection: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  seeAllText: { fontSize: 14, fontWeight: '700', color: '#3014b8' },
  horizontalScroll: { paddingBottom: 10 },
  productCard: { width: 140, marginRight: 16, backgroundColor: '#FFF', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#EEF0F5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  productImageContainer: { width: '100%', height: 110, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative' },
  productImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  timeTag: { position: 'absolute', bottom: 8, left: 8, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  timeTagText: { fontSize: 10, fontWeight: '800', color: '#111' },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 },
  productName: { fontSize: 13, color: '#444', height: 36, lineHeight: 18, marginBottom: 4 },
  productWeight: { fontSize: 12, color: '#888', marginBottom: 12 },
  addButton: { width: '100%', borderWidth: 1.5, borderColor: '#EBEBEB', borderRadius: 10, paddingVertical: 8, alignItems: 'center', backgroundColor: '#F9FAFB' },
  addButtonText: { color: '#3014b8', fontSize: 13, fontWeight: '800' },
});
