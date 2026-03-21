import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Pharmacy', icon: 'medical-bag', color: '#E8F1FF' },
  { id: '2', name: 'Kirana Store', icon: 'basket', color: '#FFF3E0' },
  { id: '3', name: 'Hardware', icon: 'tools', color: '#F3E5F5' },
  { id: '4', name: 'Stationery', icon: 'book-open-page-variant', color: '#E3F2FD' },
];

const TRENDING = [
  { id: '1', name: 'Amul Butter', stores: '15+ Stores Nearby', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200&h=200&fit=crop' },
  { id: '2', name: 'Dettol Handwash', stores: '15+ Stores Nearby', image: 'https://images.unsplash.com/photo-1584305574647-068307db3522?w=200&h=200&fit=crop' },
  { id: '3', name: 'Ganesh Grains', stores: '15+ Stores Nearby', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop' },
];

export default function DiscoveryHome() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Your Location</Text>
            <Text style={styles.locationText}>Connaught Place, New Delhi</Text>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' }} style={styles.avatar} />
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search for Maggi, Tylenol, or a screw..." placeholderTextColor="#888" />
          <Ionicons name="mic-outline" size={24} color="#666" style={styles.micIcon} />
        </View>
        <View style={styles.gridContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <View style={[styles.iconWrapper, { backgroundColor: cat.color }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={36} color="#3014b8" />
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Trending Nearby</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingList}>
          {TRENDING.map((item) => (
            <View key={item.id} style={styles.trendingCard}>
              <Image source={{ uri: item.image }} style={styles.trendingImage} />
              <Text style={styles.trendingName}>{item.name}</Text>
              <View style={styles.storeInfoRow}>
                <Text style={styles.trendingStores}>{item.stores}</Text>
                <Ionicons name="storefront-outline" size={14} color="#888" />
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  locationLabel: { fontSize: 12, color: '#666', fontWeight: '500' },
  locationText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#3014b8' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F7FA', marginHorizontal: 20, marginTop: 15, borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#00BCD4', shadowColor: '#00BCD4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },
  micIcon: { marginLeft: 10 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 30 },
  categoryCard: { width: (width - 60) / 2, alignItems: 'center', marginBottom: 25 },
  iconWrapper: { width: 90, height: 90, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 10, backgroundColor: '#FFF' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#222' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginLeft: 20, marginTop: 10, marginBottom: 15 },
  trendingList: { paddingLeft: 20 },
  trendingCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginRight: 15, width: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 10 },
  trendingImage: { width: '100%', height: 80, resizeMode: 'contain', marginBottom: 10 },
  trendingName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
  storeInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trendingStores: { fontSize: 11, color: '#888' },
});
