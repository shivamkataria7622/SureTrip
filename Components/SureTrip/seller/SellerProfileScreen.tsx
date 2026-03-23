import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function SellerProfileScreen() {
  const { user, switchRole, logout } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Feather name="home" size={30} color="#059669" />
        </View>
        <Text style={styles.shopName}>{user?.shopName || 'My Shop'}</Text>
        <Text style={styles.category}>{user?.shopCategory || 'Shop'}</Text>
        <Text style={styles.address}>{user?.shopAddress || 'Address not set'}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Requests{'\n'}Received</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>38</Text>
          <Text style={styles.statLabel}>YES{'\n'}Responses</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>90%</Text>
          <Text style={styles.statLabel}>Response{'\n'}Rate</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={switchRole}>
          <View style={[styles.menuIcon, { backgroundColor: '#E0F2F1' }]}>
            <Feather name="refresh-cw" size={18} color="#11706b" />
          </View>
          <Text style={styles.menuText}>Switch to Buyer Mode</Text>
          <Feather name="chevron-right" size={18} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#F5F6FA' }]}>
            <Feather name="edit-2" size={18} color="#555" />
          </View>
          <Text style={styles.menuText}>Edit Shop Details</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 30, paddingHorizontal: 24 },
  avatarCircle: { width: 90, height: 90, borderRadius: 28, backgroundColor: '#E8FDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 14, borderWidth: 2, borderColor: '#C8F0DE' },
  shopName: { fontSize: 22, fontWeight: '800', color: '#111' },
  category: { fontSize: 14, color: '#059669', fontWeight: '600', marginTop: 4 },
  address: { fontSize: 13, color: '#888', marginTop: 4 },
  statsCard: { flexDirection: 'row', borderWidth: 1.5, borderColor: '#EBEBEB', borderRadius: 16, marginHorizontal: 24, padding: 20, marginBottom: 30 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#059669', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 16 },
  divider: { width: 1, backgroundColor: '#F0F0F0' },
  menuSection: { paddingHorizontal: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111' },
});
