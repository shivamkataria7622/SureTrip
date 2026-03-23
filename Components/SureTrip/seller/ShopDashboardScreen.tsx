import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ShopDashboardScreen() {
  const { activeStock, removeStockItem, user } = useApp();

  // Mock revenue calculation
  const totalValue = activeStock.reduce((acc, item) => {
    const qty = parseInt(item.quantity) || 1;
    const price = parseInt(item.price) || 0;
    return acc + (qty * price);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop Dashboard</Text>
        
        {/* Revenue/Stats Widget */}
        <View style={styles.statsWidget}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Active Listings</Text>
            <Text style={styles.statValue}>{activeStock.length}</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Potential Revenue</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>₹{totalValue}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Currently Live on Map</Text>

      {activeStock.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Feather name="box" size={32} color="#CCC" />
          </View>
          <Text style={styles.emptyTitle}>Your digital shelf is empty</Text>
          <Text style={styles.emptySubTitle}>When you confirm YES to requests, they will stay live here for buyers to see for 4 hours.</Text>
        </View>
      ) : (
        <FlatList
          data={activeStock}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.stockCard}>
              {/* TTL Auto-Expiry Visualizer */}
              <View style={styles.ttlRow}>
                <Feather name="clock" size={12} color="#D97706" />
                <Text style={styles.ttlText}>Auto-expires in 3h 45m</Text>
              </View>

              <View style={styles.cardMain}>
                <View style={styles.iconWrapper}>
                  <Feather name="check" size={18} color="#059669" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.productName}>{item.product}</Text>
                  <Text style={styles.stockMeta}>₹{item.price} per item • {item.quantity} units</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeStockItem(item.id)}>
                  <Text style={styles.removeText}>Mark Sold Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEF0F5' },
  title: { fontSize: 26, fontWeight: '800', color: '#111', marginBottom: 20, letterSpacing: -0.5 },
  
  statsWidget: { flexDirection: 'row', backgroundColor: '#FAFCFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EEF0F5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  statBox: { flex: 1 },
  statLabel: { fontSize: 13, color: '#888', fontWeight: '500', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111' },
  verticalDivider: { width: 1, backgroundColor: '#EEF0F5', marginHorizontal: 20 },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginHorizontal: 24, marginTop: 24, marginBottom: 12 },
  
  listContent: { paddingHorizontal: 24, paddingBottom: 110 },
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 40 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF0F5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
  emptySubTitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  
  stockCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEF0F5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  ttlRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 12 },
  ttlText: { fontSize: 11, fontWeight: '700', color: '#D97706', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EDFBF4', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  stockMeta: { fontSize: 13, color: '#888', fontWeight: '500' },
  
  removeBtn: { backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  removeText: { color: '#DC2626', fontSize: 12, fontWeight: '700' },
});
