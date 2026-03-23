import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
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
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Feather name="settings" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Info Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' }} style={styles.avatar} />
          <View style={styles.profileTexts}>
            <Text style={styles.userName}>{user?.name || 'Rahul Sharma'}</Text>
            <View style={styles.badgeRow}>
              <Feather name="shield" size={14} color="#11706b" />
              <Text style={styles.badgeText}>Explorer Level 3</Text>
            </View>
          </View>
        </View>

        {/* Minimal Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,200</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Shops</Text>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Favorite Shops */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Shops</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
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

        <View style={styles.sectionDivider} />

        {/* Recent Searches Clean List */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { marginLeft: 24, marginBottom: 16 }]}>Recent Searches</Text>
          <View style={{ paddingHorizontal: 24 }}>
            {RECENT_SEARCHES.map((search, index) => (
              <View key={search.id} style={[styles.searchItemRow, index !== RECENT_SEARCHES.length - 1 && styles.borderBottom]}>
                <View style={styles.searchIconWrapper}>
                  <Feather name="clock" size={18} color="#555" />
                </View>
                <View style={styles.searchTexts}>
                  <Text style={styles.searchQuery}>{search.query}</Text>
                  <Text style={styles.searchLocation}>{search.location}</Text>
                </View>
                <Feather name="arrow-up-right" size={16} color="#CCC" />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Minimal Action Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={switchRole}>
            <View style={styles.menuIconWrapper}>
              <Feather name="repeat" size={18} color="#111" />
            </View>
            <Text style={styles.menuText}>Switch to Seller Mode</Text>
            <Feather name="chevron-right" size={18} color="#CCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <View style={[styles.menuIconWrapper, { backgroundColor: '#FEF2F2' }]}>
              <Feather name="log-out" size={18} color="#DC2626" />
            </View>
            <Text style={[styles.menuText, { color: '#DC2626' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111', letterSpacing: -0.5 },
  
  scrollContent: { paddingBottom: 120, paddingTop: 16 },
  
  profileHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 30 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FAFAFA' },
  profileTexts: { marginLeft: 16, flex: 1 },
  userName: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7F7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#11706b', marginLeft: 4 },
  
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24, paddingVertical: 20, backgroundColor: '#FAFAFA', borderRadius: 20, paddingHorizontal: 24 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
  statDivider: { width: 1, height: 30, backgroundColor: '#EBEBEB' },
  
  sectionDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 32, marginHorizontal: 24 },
  
  sectionContainer: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', letterSpacing: -0.5 },
  seeAllText: { fontSize: 14, fontWeight: '600', color: '#555' },
  
  shopCard: { width: 200, flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  shopImage: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#FAFAFA', marginRight: 14 },
  shopInfo: { flex: 1 },
  shopName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  shopMeta: { fontSize: 13, color: '#888' },
  
  searchItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  searchIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  searchTexts: { flex: 1 },
  searchQuery: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  searchLocation: { fontSize: 13, color: '#888' },
  
  menuContainer: { paddingHorizontal: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
});
