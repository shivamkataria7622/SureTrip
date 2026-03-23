import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ShopDashboardScreen() {
  const { activeStock, removeStockItem, user } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Stock</Text>
        <Text style={styles.subtitle}>Items you confirmed available today</Text>
      </View>

      {activeStock.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Feather name="box" size={36} color="#CCC" />
          </View>
          <Text style={styles.emptyTitle}>No active stock yet</Text>
          <Text style={styles.emptySubTitle}>When you confirm YES to a buyer request, it'll appear here for tracking.</Text>
        </View>
      ) : (
        <FlatList
          data={activeStock}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.stockCard}>
              <View style={styles.cardLeft}>
                <View style={styles.iconWrapper}>
                  <Feather name="check-circle" size={20} color="#059669" />
                </View>
                <View>
                  <Text style={styles.productName}>{item.product}</Text>
                  <Text style={styles.stockMeta}>₹{item.price} • {item.quantity} pcs • {item.confirmedAt}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeStockItem(item.id)}>
                <View style={styles.removeBtn}>
                  <Feather name="x" size={16} color="#DC2626" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.shopInfoCard}>
        <View style={styles.shopRow}>
          <Feather name="home" size={18} color="#059669" />
          <View style={styles.shopText}>
            <Text style={styles.shopName}>{user?.shopName || 'My Shop'}</Text>
            <Text style={styles.shopAddress}>{user?.shopAddress || 'Tap to set address'}</Text>
          </View>
          <View style={styles.openBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.openText}>Open</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  listContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 160 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#555', marginBottom: 8 },
  emptySubTitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  stockCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#C8F0DE', borderRadius: 14, padding: 14, marginBottom: 10, backgroundColor: '#FAFFFD' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconWrapper: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#EDFBF4', justifyContent: 'center', alignItems: 'center' },
  productName: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 3 },
  stockMeta: { fontSize: 13, color: '#888' },
  removeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' },
  shopInfoCard: { position: 'absolute', bottom: 90, left: 24, right: 24, borderWidth: 1.5, borderColor: '#C8F0DE', borderRadius: 16, padding: 16, backgroundColor: '#FAFFFD' },
  shopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shopText: { flex: 1 },
  shopName: { fontSize: 16, fontWeight: '700', color: '#111' },
  shopAddress: { fontSize: 13, color: '#888', marginTop: 2 },
  openBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDFBF4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#059669', marginRight: 6 },
  openText: { fontSize: 13, fontWeight: '600', color: '#059669' },
});
