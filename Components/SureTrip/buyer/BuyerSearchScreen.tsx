import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Platform, StatusBar, ScrollView, Modal,
  Image, Animated, Dimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'activity' },
  { id: 'grocery', label: 'Grocery', icon: 'shopping-bag' },
  { id: 'hardware', label: 'Hardware', icon: 'tool' },
  { id: 'electrical', label: 'Electrical', icon: 'zap' },
  { id: 'plumbing', label: 'Plumbing', icon: 'droplet' },
];

const QUICK_SUGGESTIONS = [
  'Crocin Advance', 'PVC Pipe 1 inch', 'Amul Butter',
  'Electrical Wire 2.5mm', 'Parle-G', 'Dettol Handwash',
];

const MOCK_RESULTS = [
  { id: '1', shopName: 'Sharma Hardware Store', price: '₹45/pcs', quantity: '12 in stock', distance: '280m', verified: '2 min ago', category: 'Hardware', rating: '4.8', image: 'https://images.unsplash.com/photo-1588612143431-bdee18542289?w=150&h=150&fit=crop', badge: '⚡ Fast Responder', badgeColor: '#FEF3C7', badgeTextColor: '#D97706' },
  { id: '2', shopName: 'Gupta Sanitary Works', price: '₹42/pcs', quantity: '20 in stock', distance: '620m', verified: '5 min ago', category: 'Hardware', rating: '4.5', image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=150&h=150&fit=crop', badge: '🔥 Most Popular', badgeColor: '#FEE2E2', badgeTextColor: '#DC2626' },
  { id: '3', shopName: 'Delhi Depot', price: '₹50/pcs', quantity: 'Only 2 left!', distance: '1.1km', verified: '8 min ago', category: 'Hardware', rating: '4.2', image: 'https://images.unsplash.com/photo-1588612143431-bdee18542289?w=150&h=150&fit=crop', badge: '⚠️ Low Stock', badgeColor: '#FEF2F2', badgeTextColor: '#991B1B' },
];

export default function BuyerSearchScreen({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Amul Butter', 'Crocin Advance']);
  const [searched, setSearched] = useState(false);
  
  // UI States
  const [filterVisible, setFilterVisible] = useState(false);
  const [cartItem, setCartItem] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart'|'processing'|'success'>('cart');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Animated Header Values
  const titleHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [40, 0],
    extrapolate: 'clamp',
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery ?? query;
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setResults([]);
    setSearched(true);
    if (!recentSearches.includes(q)) {
      setRecentSearches(prev => [q, ...prev].slice(0, 5));
    }
    setTimeout(() => {
      setLoading(false);
      setResults(MOCK_RESULTS);
    }, 2000);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  const openCheckout = (item: any) => {
    setCartItem(item);
    setCheckoutStep('cart');
  };

  const processPayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2500);
  };

  const closeCheckout = () => {
    setCartItem(null);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Top Nav */}
      <View style={styles.topNav}>
        {/* Back Button */}
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#111" />
          </TouchableOpacity>
        )}
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={13} color="#11706b" />
          <Text style={styles.locationText}>Connaught Place, New Delhi</Text>
          <Feather name="chevron-down" size={13} color="#888" />
        </View>
        
        <Animated.View style={{ height: titleHeight, opacity: titleOpacity, overflow: 'hidden' }}>
          <Text style={styles.title}>Find Anything Nearby</Text>
        </Animated.View>

        {/* Search Bar + Filter Icon */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#888" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="e.g. PVC Pipe, Crocin..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Feather name="x-circle" size={18} color="#CCC" />
              </TouchableOpacity>
            )}
            <View style={styles.divider} />
            <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Feather name="mic" size={18} color="#11706b" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <Feather name="sliders" size={18} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10, gap: 8 }}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Feather name={cat.icon as any} size={13} color={isActive ? '#FFF' : '#555'} />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11706b" />
          <Text style={styles.loadingText}>Notifying nearby shops...</Text>
          <Text style={styles.loadingSubText}>Asking stores within 2km if they have it in stock</Text>
        </View>
      ) : !searched ? (
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.idleContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((item, i) => (
                <TouchableOpacity key={i} style={styles.recentRow} onPress={() => handleSearch(item)}>
                  <View style={styles.recentIcon}>
                    <Feather name="clock" size={15} color="#888" />
                  </View>
                  <Text style={styles.recentText}>{item}</Text>
                  <Feather name="arrow-up-left" size={15} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <View style={styles.suggestionsWrap}>
              {QUICK_SUGGESTIONS.map((s, i) => (
                <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => handleSearch(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      ) : (
        <Animated.FlatList
          data={results}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{results.length} shops found</Text>
              <Text style={styles.resultsSubTitle}>for "{query}"</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              {/* Trust Badge overlay */}
              <View style={[styles.badgePill, { backgroundColor: item.badgeColor }]}>
                <Text style={[styles.badgeText, { color: item.badgeTextColor }]}>{item.badge}</Text>
              </View>

              <View style={styles.cardTop}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.cardTexts}>
                  <Text style={styles.shopName} numberOfLines={1}>{item.shopName}</Text>
                  
                  <View style={styles.metaRow}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.metaText, {color: '#F59E0B', fontWeight: '700'}]}>{item.rating}</Text>
                    <View style={styles.dot} />
                    <Feather name="map-pin" size={11} color="#888" />
                    <Text style={styles.metaText}>{item.distance}</Text>
                  </View>

                  <Text style={styles.price}>{item.price}</Text>
                </View>
              </View>
              
              <View style={styles.cardBottom}>
                <View style={[styles.stockBadge, item.quantity.includes('Only') && { backgroundColor: '#FEF2F2' }]}>
                  <Feather name="check-circle" size={13} color={item.quantity.includes('Only') ? '#DC2626' : '#059669'} />
                  <Text style={[styles.stockText, item.quantity.includes('Only') && { color: '#DC2626' }]}>{item.quantity}</Text>
                </View>
                <TouchableOpacity style={styles.reserveBtn} onPress={() => openCheckout(item)}>
                  <Text style={styles.reserveBtnText}>Reserve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Map Toggle Button */}
      {searched && !loading && (
        <TouchableOpacity style={styles.fabMap} activeOpacity={0.9}>
          <Feather name="map" size={16} color="#FFF" />
          <Text style={styles.fabText}>Map View</Text>
        </TouchableOpacity>
      )}

      {/* Filter Bottom Sheet */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Sort & Filter</Text>
            
            <Text style={styles.filterGroupTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}><Text style={[styles.filterChipText, styles.filterChipTextActive]}>Nearest First</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}><Text style={styles.filterChipText}>Lowest Price</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}><Text style={styles.filterChipText}>Top Rated</Text></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterVisible(false)}>
              <Text style={styles.applyBtnText}>Show {results.length || 0} Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal visible={!!cartItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            {checkoutStep === 'cart' && (
              <>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>Reserve for Pickup</Text>
                
                <View style={styles.cartCard}>
                  <Image source={{ uri: cartItem?.image }} style={styles.cartImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cartItemName}>{cartItem?.shopName}</Text>
                    <Text style={styles.cartItemSub}>{cartItem?.category || 'Hardware Item'} • {cartItem?.price}</Text>
                  </View>
                </View>

                <View style={styles.billRow}>
                  <Text style={styles.billText}>Item Total</Text>
                  <Text style={styles.billText}>{cartItem?.price}</Text>
                </View>
                <View style={styles.billRow}>
                  <Text style={styles.billText}>Platform Fee</Text>
                  <Text style={styles.billText}>₹2</Text>
                </View>
                <View style={[styles.billRow, { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 12, marginTop: 12 }]}>
                  <Text style={styles.billTotal}>To Pay</Text>
                  <Text style={styles.billTotal}>{cartItem?.price}</Text>
                </View>

                <TouchableOpacity style={styles.payBtn} onPress={processPayment} activeOpacity={0.8}>
                   <Text style={styles.payBtnText}>Pay via UPI & Reserve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelCheckoutBtn} onPress={closeCheckout}>
                  <Text style={styles.cancelCheckoutText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {checkoutStep === 'processing' && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={styles.processingText}>Securing from {cartItem?.shopName}...</Text>
                <Text style={styles.processingSub}>Confirming with shopkeeper</Text>
              </View>
            )}

            {checkoutStep === 'success' && (
              <View style={styles.successContainer}>
                <View style={styles.successIconBox}>
                  <Feather name="check" size={40} color="#FFF" />
                </View>
                <Text style={styles.successTitle}>Reservation Confirmed!</Text>
                <Text style={styles.successSub}>Show Order #X7B9 to the shopkeeper at {cartItem?.shopName} to pickup your item.</Text>
                
                <TouchableOpacity onPress={closeCheckout} style={{ width: '100%', backgroundColor: '#059669', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 10 }}>
                  <Text style={styles.payBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  topNav: { backgroundColor: '#FFFFFF', paddingHorizontal: 0, paddingTop: 18, zIndex: 10 },
  backBtn: { marginLeft: 24, marginBottom: 8, padding: 4, alignSelf: 'flex-start' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 5, paddingHorizontal: 24 },
  locationText: { fontSize: 13, color: '#555', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', color: '#111', letterSpacing: -0.3, paddingHorizontal: 24 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 10, gap: 10, alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 14, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#EBEBEB' },
  searchInput: { flex: 1, fontSize: 15, color: '#111' },
  divider: { width: 1, height: 20, backgroundColor: '#CCC', marginHorizontal: 12 },
  filterBtn: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#EBEBEB' },
  
  categoryScroll: { backgroundColor: '#FFFFFF', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#EBEBEB' },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#FFF' },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  loadingText: { fontSize: 18, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 8 },
  loadingSubText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  
  idleContent: { padding: 24, paddingBottom: 110, gap: 8 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 14 },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  recentIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  recentText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  suggestionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  suggestionChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBEBEB' },
  suggestionText: { fontSize: 14, color: '#444', fontWeight: '500' },
  
  resultsHeader: { paddingVertical: 14 },
  resultsTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  resultsSubTitle: { fontSize: 13, color: '#888', marginTop: 2 },
  listContent: { paddingHorizontal: 24, paddingBottom: 120 },
  
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#EEF0F5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  badgePill: { position: 'absolute', top: -10, left: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 10 },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 4 },
  productImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F5F6FA', marginRight: 14 },
  cardTexts: { flex: 1 },
  shopName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  metaText: { fontSize: 12, color: '#888' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CCC' },
  price: { fontSize: 18, fontWeight: '800', color: '#111' },
  
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F5F6FA', paddingTop: 14 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EDFBF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  stockText: { fontSize: 13, fontWeight: '700', color: '#059669' },
  verifiedText: { fontSize: 12, color: '#AAA', fontWeight: '500' },
  
  fabMap: { position: 'absolute', bottom: 100, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  fabText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#EBEBEB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 24 },
  filterGroupTitle: { fontSize: 16, fontWeight: '700', color: '#555', marginBottom: 12 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#EBEBEB' },
  filterChipActive: { backgroundColor: '#111', borderColor: '#111' },
  filterChipText: { fontSize: 14, color: '#444', fontWeight: '600' },
  filterChipTextActive: { color: '#FFF' },
  applyBtn: { backgroundColor: '#11706b', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  applyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  reserveBtn: { backgroundColor: '#E0F2F1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  reserveBtnText: { color: '#11706b', fontSize: 13, fontWeight: '700' },
  
  cartCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', padding: 12, borderRadius: 16, marginBottom: 20 },
  cartImage: { width: 50, height: 50, borderRadius: 10, marginRight: 12 },
  cartItemName: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 4 },
  cartItemSub: { fontSize: 13, color: '#555' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billText: { fontSize: 14, color: '#555' },
  billTotal: { fontSize: 16, fontWeight: '800', color: '#111' },
  payBtn: { backgroundColor: '#059669', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelCheckoutBtn: { alignItems: 'center', paddingVertical: 16 },
  cancelCheckoutText: { color: '#888', fontSize: 15, fontWeight: '600' },
  
  processingContainer: { alignItems: 'center', paddingVertical: 40 },
  processingText: { fontSize: 18, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 8 },
  processingSub: { fontSize: 14, color: '#888' },
  
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 12 },
  successSub: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 30, paddingHorizontal: 20 },
});
