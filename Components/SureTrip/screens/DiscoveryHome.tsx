import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Pharmacy', icon: 'activity' },
  { id: '2', name: 'Groceries', icon: 'shopping-bag' },
  { id: '3', name: 'Hardware', icon: 'tool' },
  { id: '4', name: 'Stationery', icon: 'book' },
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
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Current Location</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>Connaught Place</Text>
              <Ionicons name="chevron-down" size={16} color="#111" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' }} style={styles.avatar} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Find groceries, meds, hardware..." 
            placeholderTextColor="#999" 
          />
          <Feather name="mic" size={20} color="#888" style={styles.micIcon} />
        </View>

        {/* Categories */}
        <View style={styles.gridContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard}>
              <View style={styles.iconWrapper}>
                <Feather name={cat.icon as any} size={24} color="#111" />
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Nearby</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingList} contentContainerStyle={{ paddingRight: 24 }}>
          {TRENDING.map((item) => (
            <View key={item.id} style={styles.trendingCard}>
              <View style={styles.imageBox}>
                <Image source={{ uri: item.image }} style={styles.trendingImage} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.trendingName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.storeInfoRow}>
                  <Feather name="map-pin" size={12} color="#888" />
                  <Text style={styles.trendingStores}>{item.stores}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 110, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 10 },
  locationLabel: { fontSize: 13, color: '#888', fontWeight: '500', marginBottom: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 18, fontWeight: '700', color: '#111' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0' },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F5F7', marginHorizontal: 24, marginTop: 15, borderRadius: 16, paddingHorizontal: 16, height: 52 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#111', fontWeight: '500' },
  micIcon: { marginLeft: 12 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 30, marginTop: 40 },
  categoryCard: { width: (width - 60) / 4, alignItems: 'center', marginBottom: 30 },
  iconWrapper: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  categoryText: { fontSize: 13, fontWeight: '500', color: '#444' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  seeAllText: { fontSize: 14, fontWeight: '600', color: '#3014b8' },
  
  trendingList: { paddingLeft: 24 },
  trendingCard: { width: 150, marginRight: 16 },
  imageBox: { width: '100%', height: 150, borderRadius: 16, backgroundColor: '#F4F5F7', overflow: 'hidden', marginBottom: 12 },
  trendingImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardInfo: { paddingHorizontal: 4 },
  trendingName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 6 },
  storeInfoRow: { flexDirection: 'row', alignItems: 'center' },
  trendingStores: { fontSize: 12, color: '#888', marginLeft: 6 },
});
