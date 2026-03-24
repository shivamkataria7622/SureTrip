import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { API_BASE } from '../config/api';

export default function ProfileDashboard() {
  const { user, logout, switchRole } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`${API_BASE}/api/orders/buyer?buyerId=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

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
            <Text style={styles.userName}>{user?.name || user?.email || 'Rahul Sharma'}</Text>
            <View style={styles.badgeRow}>
              <Feather name="shield" size={14} color="#11706b" />
              <Text style={styles.badgeText}>Explorer Level 3</Text>
            </View>
          </View>
        </View>

        {/* Minimal Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
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

        {/* Recent Orders */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator size="small" color="#11706b" style={{ marginTop: 20 }} />
          ) : orders.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No past orders found.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
              {orders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderTopRow}>
                    <Feather name="shopping-bag" size={16} color="#11706b" />
                    <Text style={[
                      styles.orderStatus, 
                      { color: order.status === 'accepted' ? '#059669' : order.status === 'rejected' ? '#DC2626' : '#F59E0B' }
                    ]}>
                      {order.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.orderProduct} numberOfLines={1}>{order.productName}</Text>
                  <Text style={styles.orderShop} numberOfLines={1}>{order.shopName || order.sellerId}</Text>
                  
                  {order.status === 'accepted' && order.price ? (
                    <Text style={styles.orderPrice}>₹{order.price} × {order.quantity}</Text>
                  ) : (
                    <Text style={styles.orderPrice}>Awaiting price</Text>
                  )}
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
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
  
  orderCard: { width: 220, backgroundColor: '#FAFAFA', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderStatus: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  orderProduct: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  orderShop: { fontSize: 13, color: '#555', marginBottom: 12 },
  orderPrice: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  orderDate: { fontSize: 12, color: '#888' },
});
