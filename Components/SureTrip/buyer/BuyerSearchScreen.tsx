import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const MOCK_RESULTS = [
  { id: '1', shopName: 'Sharma Hardware Store', product: 'PVC Pipe 1 inch', price: '₹45/pcs', quantity: '12 in stock', distance: '280m', verified: '2 min ago', rating: 4.5 },
  { id: '2', shopName: 'Gupta Sanitary Works', product: 'PVC Pipe 1 inch', price: '₹42/pcs', quantity: '20 in stock', distance: '620m', verified: '5 min ago', rating: 4.2 },
  { id: '3', shopName: 'Delhi Hardware Depot', product: 'PVC Pipe 1 inch', price: '₹50/pcs', quantity: '5 in stock', distance: '1.1km', verified: '8 min ago', rating: 4.8 },
];

export default function BuyerSearchScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof MOCK_RESULTS>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setSearched(true);
    setTimeout(() => {
      setLoading(false);
      setResults(MOCK_RESULTS);
    }, 2500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color="#3014b8" />
          <Text style={styles.locationText}>Connaught Place, New Delhi</Text>
          <Feather name="chevron-down" size={14} color="#888" />
        </View>
        <Text style={styles.title}>Find Anything,{'\n'}Nearby.</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="e.g. PVC Pipe 1 inch, Crocin..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Feather name="x" size={16} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3014b8" />
          <Text style={styles.loadingText}>Notifying nearby shops...</Text>
          <Text style={styles.loadingSubText}>Asking stores within 2km if they have it in stock</Text>
        </View>
      )}

      {/* Empty / Initial State */}
      {!loading && !searched && (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Feather name="search" size={36} color="#C5C5C5" />
          </View>
          <Text style={styles.emptyTitle}>Search for any product</Text>
          <Text style={styles.emptySubTitle}>We'll ask nearby shops in real-time if they have it.</Text>
        </View>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <View style={{ flex: 1 }}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>{results.length} shops found</Text>
            <Text style={styles.resultsSubTitle}>for "{query}"</Text>
          </View>
          <FlatList
            data={results}
            keyExtractor={i => i.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.resultCard}>
                <View style={styles.cardTop}>
                  <View style={styles.shopIconWrapper}>
                    <Feather name="home" size={20} color="#3014b8" />
                  </View>
                  <View style={styles.cardTexts}>
                    <Text style={styles.shopName}>{item.shopName}</Text>
                    <View style={styles.metaRow}>
                      <Feather name="map-pin" size={12} color="#888" />
                      <Text style={styles.metaText}>{item.distance}</Text>
                      <View style={styles.dot} />
                      <Feather name="clock" size={12} color="#888" />
                      <Text style={styles.metaText}>Verified {item.verified}</Text>
                    </View>
                  </View>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
                <View style={styles.cardBottom}>
                  <View style={styles.stockBadge}>
                    <Feather name="check-circle" size={13} color="#059669" />
                    <Text style={styles.stockText}>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity style={styles.directionBtn}>
                    <Feather name="navigation" size={14} color="#3014b8" />
                    <Text style={styles.directionText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 5 },
  locationText: { fontSize: 13, color: '#555', fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.3, lineHeight: 36 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 16, gap: 12, alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#EBEBEB' },
  searchInput: { flex: 1, fontSize: 15, color: '#111' },
  searchBtn: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#3014b8', justifyContent: 'center', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  loadingText: { fontSize: 18, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 8 },
  loadingSubText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5F6FA', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 8 },
  emptySubTitle: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
  resultsHeader: { paddingHorizontal: 24, paddingVertical: 16 },
  resultsTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  resultsSubTitle: { fontSize: 14, color: '#888', marginTop: 2 },
  listContent: { paddingHorizontal: 24, paddingBottom: 110 },
  resultCard: { borderWidth: 1.5, borderColor: '#EBEBEB', borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: '#FAFCFF' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  shopIconWrapper: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF0FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTexts: { flex: 1 },
  shopName: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: '#888' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CCC' },
  price: { fontSize: 17, fontWeight: '800', color: '#111' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 14 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EDFBF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  stockText: { fontSize: 13, fontWeight: '600', color: '#059669' },
  directionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  directionText: { fontSize: 14, fontWeight: '600', color: '#3014b8' },
});
