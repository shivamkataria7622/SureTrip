import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DAIRY_ITEMS = [
  { id: '1', name: 'Amul Gold Milk', size: '500ml', price: '₹32', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop' },
  { id: '2', name: 'Mother Dairy Curd', size: '400g', price: '₹45', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
  { id: '3', name: 'Paneer', size: '200g', price: '₹80', image: 'https://images.unsplash.com/photo-1621861009893-cb78f8cb2066?w=200&h=200&fit=crop' },
];

const SNACK_ITEMS = [
  { id: '1', name: "Haldiram's Bhujia Sev", size: '150g', price: '₹50', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop' },
  { id: '2', name: 'Lays Classic Salted', size: '52g', price: '₹20', image: 'https://images.unsplash.com/photo-1621447504064-778df0f7a0dc?w=200&h=200&fit=crop' },
  { id: '3', name: 'Parle-G Biscuit', size: '...', price: '₹10', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop' },
];

export default function ShopInventoryDetails() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80' }} style={styles.heroImage} />
          <View style={styles.overlay} />
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AasPaas</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.shopName}>Jain Provision Store</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star, i) => (
              <Ionicons key={i} name={i === 4 ? "star-half" : "star"} size={16} color="#FFB300" />
            ))}
            <Text style={styles.ratingText}>4.5</Text>
            <Text style={styles.reviewCount}> (128 reviews)</Text>
          </View>
          <Text style={styles.openStatus}>Open until 10 PM</Text>
        </View>
        <View style={styles.reliabilityContainer}>
          <Text style={styles.sectionTitleCenter}>Reliability</Text>
          <View style={styles.circularProgress}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Text style={styles.percentage}>96%</Text>
              </View>
            </View>
          </View>
          <Text style={styles.reliabilitySubtitle}>Shop Inventory Update Reliability</Text>
        </View>
        <View style={styles.inventorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name="pint-outline" size={24} color="#3014b8" />
            <Text style={styles.categoryTitle}>Dairy</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {DAIRY_ITEMS.map((item) => (
              <View key={item.id} style={styles.productCardRow}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDesc}>{item.size} - {item.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.inventorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name="fast-food-outline" size={24} color="#D84315" />
            <Text style={styles.categoryTitle}>Snacks</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {SNACK_ITEMS.map((item) => (
              <View key={item.id} style={styles.productCardRow}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDesc}>{item.size} - {item.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <View style={styles.bottomFooter}>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>I am visiting this shop (Verify Stock)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 100 },
  heroContainer: { height: 250, width: '100%', position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 200, 200, 0.4)' },
  headerTop: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  infoCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -50, borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8, zIndex: 10 },
  shopName: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#333', marginLeft: 6 },
  reviewCount: { color: '#888', fontWeight: '400' },
  openStatus: { fontSize: 14, color: '#666' },
  reliabilityContainer: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  sectionTitleCenter: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 15 },
  circularProgress: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0F7FA', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  outerCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, borderColor: '#00BCD4', justifyContent: 'center', alignItems: 'center', borderLeftColor: '#E0F7FA', transform: [{ rotate: '45deg' }] },
  innerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-45deg' }] },
  percentage: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  reliabilitySubtitle: { fontSize: 13, color: '#666' },
  inventorySection: { backgroundColor: '#FFF', marginTop: 15, marginHorizontal: 20, borderRadius: 16, paddingVertical: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
  categoryTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginLeft: 10 },
  horizontalList: { paddingLeft: 15 },
  productCardRow: { flexDirection: 'row', alignItems: 'center', width: 220, marginRight: 15 },
  productImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#EEE', marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 4 },
  productDesc: { fontSize: 13, color: '#666' },
  bottomFooter: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 20, paddingBottom: 35, borderTopWidth: 1, borderTopColor: '#EEE' },
  ctaButton: { backgroundColor: '#35C2C1', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
