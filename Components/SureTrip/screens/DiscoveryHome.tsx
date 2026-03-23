import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Pharmacy', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { id: '2', name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop' },
  { id: '3', name: 'Dairy & Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop' },
  { id: '4', name: 'Munchies', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop' },
  { id: '5', name: 'Hardware', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop' },
  { id: '6', name: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop' },
  { id: '7', name: 'Meats', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bd682f?w=300&h=300&fit=crop' },
  { id: '8', name: 'Cleaning', image: 'https://images.unsplash.com/photo-1584820927498-cafe5c152a00?w=300&h=300&fit=crop' },
];

const BESTSELLERS = [
  { id: '1', name: 'Amul Taaza Milk', weight: '500 ml', price: '₹28', time: '200m away', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop' },
  { id: '2', name: 'Lays Magic Masala', weight: '50 g', price: '₹20', time: '400m away', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop' },
  { id: '3', name: 'Crocin Advance', weight: '15 Tablets', price: '₹40', time: '1.2km away', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' },
  { id: '4', name: 'Dettol Handwash', weight: '200 ml', price: '₹99', time: '350m away', image: 'https://images.unsplash.com/photo-1584305574647-068307db3522?w=200&h=200&fit=crop' },
];

export default function DiscoveryHome({ onOpenSearch }: { onOpenSearch?: () => void }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>SureTrip</Text>

          <TouchableOpacity style={styles.searchIconBtn} onPress={onOpenSearch} activeOpacity={0.6}>
            <Feather name="search" size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Minimal Promo Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
          <TouchableOpacity style={[styles.bannerCard, { backgroundColor: '#F5F5F5' }]} activeOpacity={0.9} onPress={onOpenSearch}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Check Local{'\n'}Inventory.</Text>
              <Text style={styles.bannerSubTitle}>Find it nearby instantly</Text>
              <View style={styles.bannerLinkRow}>
                <Text style={styles.bannerLinkText}>Search items</Text>
                <Feather name="arrow-right" size={14} color="#000000ff" />
              </View>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop' }} style={styles.bannerImage} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bannerCard, { backgroundColor: '#F5F5F5' }]} activeOpacity={0.9} onPress={onOpenSearch}>
            <View style={styles.bannerTextContainer}>
              <Text style={[styles.bannerTitle, { color: '#111' }]}>Reserve &{'\n'}Pickup.</Text>
              <Text style={[styles.bannerSubTitle, { color: '#666' }]}>Hold items via UPI</Text>
              <View style={styles.bannerLinkRow}>
                <Text style={[styles.bannerLinkText, { color: '#111' }]}>Explore shops</Text>
                <Feather name="arrow-right" size={14} color="#111" />
              </View>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' }} style={styles.bannerImage} />
          </TouchableOpacity>
        </ScrollView>

        {/* Clean Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
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

        {/* Minimal Bestsellers */}
        <View style={styles.bestsellersSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>High Demand Nearby</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {BESTSELLERS.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.timeTag}>
                    <Text style={styles.timeTagText}>{item.time}</Text>
                  </View>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productWeight}>{item.weight}</Text>
                </View>
                
                <TouchableOpacity style={styles.addButton} onPress={onOpenSearch} activeOpacity={0.7}>
                  <Text style={styles.addButtonText}>Find</Text>
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
  
  // Header Minimal
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  appName: { fontSize: 24, fontWeight: '700', color: '#11706b', letterSpacing: -0.5 },
  searchIconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FAFAFA', alignItems: 'center', justifyContent: 'center' },
  
  // Banner Clean
  bannerScroll: { marginBottom: 36, paddingBottom: 8 },
  bannerCard: { width: width * 0.82, height: 160, borderRadius: 24, flexDirection: 'row', overflow: 'hidden' },
  bannerTextContainer: { flex: 1, padding: 24, justifyContent: 'center' },
  bannerTitle: { color: '#000000ff', fontSize: 20, fontWeight: '700', letterSpacing: -0.5, marginBottom: 8, lineHeight: 24 },
  bannerSubTitle: { color: '#444', fontSize: 13, marginBottom: 16, opacity: 0.8 },
  bannerLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bannerLinkText: { color: '#000000ff', fontSize: 13, fontWeight: '600' },
  bannerImage: { width: 130, height: 160, resizeMode: 'cover' },
  
  // Categories Clean
  categoriesSection: { paddingHorizontal: 24, marginBottom: 36 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', letterSpacing: -0.5, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24 },
  categoryCard: { width: (width - 48 - 45) / 4, alignItems: 'center' },
  categoryImageBg: { width: '100%', aspectRatio: 1, borderRadius: 100, backgroundColor: '#F9FAFB', overflow: 'hidden', marginBottom: 10, alignItems: 'center', justifyContent: 'center' },
  categoryImage: { width: '60%', height: '60%', resizeMode: 'contain', opacity: 0.9 },
  categoryName: { fontSize: 12, fontWeight: '500', color: '#555', textAlign: 'center' },
  
  // Bestsellers Minimal
  bestsellersSection: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  horizontalScroll: { paddingBottom: 10 },
  productCard: { width: 150, backgroundColor: '#FAFAFA', borderRadius: 20, padding: 12 },
  productImageContainer: { width: '100%', height: 130, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' },
  productImage: { width: '70%', height: '70%', resizeMode: 'contain' },
  timeTag: { position: 'absolute', top: 8, left: 8, backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeTagText: { fontSize: 10, fontWeight: '600', color: '#555' },
  productInfo: { paddingHorizontal: 4, marginBottom: 16 },
  productPrice: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  productName: { fontSize: 13, fontWeight: '500', color: '#111', marginBottom: 4 },
  productWeight: { fontSize: 13, color: '#888' },
  addButton: { width: '100%', borderRadius: 12, paddingVertical: 10, alignItems: 'center', backgroundColor: '#FFFFFF' },
  addButtonText: { color: '#111', fontSize: 13, fontWeight: '600' },
});
