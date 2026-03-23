import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const FAVORITE_SHOPS = [
  { id: '1', name: 'Jain Provision Store', items: '24 items saved', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&fit=crop' },
  { id: '2', name: 'Apollo Pharmacy', items: 'Prescriptions', image: 'https://images.unsplash.com/photo-1555633514-abcee6ab92e1?w=200&fit=crop' },
];

const RECENT_SEARCHES = [
  { id: '1', query: 'Crocin Advance', location: 'Connaught Place', time: '2 hours ago' },
  { id: '2', query: 'Amul Butter', location: 'Connaught Place', time: 'Yesterday' },
  { id: '3', query: 'Parle-G Biscuit', location: 'New Delhi', time: 'Yesterday' },
];

export default function ProfileDashboard() {
  const { user, logout, switchRole } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerArea}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' }} style={styles.avatar} />
          <Text style={styles.userName}>{user?.name || 'Rahul Sharma'}</Text>
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark" size={16} color="#35C2C1" />
            <Text style={styles.badgeText}>SureTrip Explorer Level 3</Text>
          </View>
        </View>

        {/* Verification Stats Widget */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>My Contributions</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Items Verified</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,200</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Shops Supported</Text>
            </View>
          </View>
        </View>

        {/* My Neighborhood / Favorites */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Neighborhood</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {FAVORITE_SHOPS.map(shop => (
              <View key={shop.id} style={styles.shopCard}>
                <Image source={{ uri: shop.image }} style={styles.shopImage} />
                <View style={styles.shopInfo}>
                  <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                  <Text style={styles.shopMeta}>{shop.items}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Recent Searches</Text>
          <View style={styles.recentList}>
            {RECENT_SEARCHES.map((search, index) => (
              <View key={search.id} style={[styles.searchItemRow, index !== RECENT_SEARCHES.length - 1 ? styles.searchItemBorder : {}]}>
                <View style={styles.searchIconWrapper}>
                  <Ionicons name="time-outline" size={20} color="#888" />
                </View>
                <View style={styles.searchTexts}>
                  <Text style={styles.searchQuery}>{search.query}</Text>
                  <Text style={styles.searchLocation}>{search.location} • {search.time}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={switchRole}>
            <View style={[styles.menuIcon, { backgroundColor: '#E8FDF5' }]}>
              <Feather name="refresh-cw" size={18} color="#059669" />
            </View>
            <Text style={styles.menuText}>Switch to Seller Mode</Text>
            <Feather name="chevron-right" size={18} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
              <Feather name="log-out" size={18} color="#DC2626" />
            </View>
            <Text style={[styles.menuText, { color: '#DC2626' }]}>Logout</Text>
            <Feather name="chevron-right" size={18} color="#CCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 110, paddingTop: 20 },
  headerArea: { alignItems: 'center', marginBottom: 25 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#3014b8', marginBottom: 12 },
  userName: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F7FA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 13, fontWeight: '600', color: '#00838F', marginLeft: 6 },
  statsCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  statsTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#3014b8', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  divider: { width: 1, height: 40, backgroundColor: '#EEE' },
  sectionContainer: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  seeAllText: { fontSize: 14, fontWeight: '600', color: '#3014b8' },
  horizontalList: { paddingLeft: 20 },
  shopCard: { width: 220, backgroundColor: '#FFF', borderRadius: 12, marginRight: 15, padding: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2, marginBottom: 5 },
  shopImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  shopInfo: { flex: 1, justifyContent: 'center' },
  shopName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  shopMeta: { fontSize: 12, color: '#888' },
  recentList: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 16, marginTop: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2 },
  searchItemRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  searchItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  searchIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  searchTexts: { flex: 1 },
  searchQuery: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  searchLocation: { fontSize: 12, color: '#888' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111' },
});
