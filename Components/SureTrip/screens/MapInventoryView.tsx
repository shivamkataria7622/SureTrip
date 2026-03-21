import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ImageBackground, Dimensions, Platform, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MAP_PINS = [
  { id: '1', price: '₹30', top: '15%', left: '25%' },
  { id: '2', price: '₹34', top: '25%', left: '60%' },
  { id: '3', price: '₹30', top: '45%', left: '20%' },
  { id: '4', price: '₹32', top: '40%', left: '45%' },
  { id: '5', price: '₹34', top: '55%', left: '70%' },
];

export default function MapInventoryView() {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' }} style={styles.mapBackground}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mapOverlay}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput style={styles.searchInput} placeholder="Searching for: Amul Milk" placeholderTextColor="#555" value="Searching for: Amul Milk" editable={false} />
            </View>
            <View style={styles.mapArea}>
              {MAP_PINS.map((pin) => (
                <View key={pin.id} style={[styles.pinContainer, { top: pin.top as any, left: pin.left as any }]}>
                  <View style={styles.pinBubble}>
                    <Text style={styles.pinText}>{pin.price}</Text>
                  </View>
                  <View style={styles.pinTriangle} />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={10} color="#FFF" />
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.bottomSheet}>
              <View style={styles.dragHandle} />
              <Text style={styles.bestMatchLabel}>Best Match</Text>
              <Text style={styles.shopName}>Sharma Kirana</Text>
              <Text style={styles.distanceText}>300 meters away</Text>
              <View style={styles.reliabilityRow}>
                <Text style={styles.reliabilityText}>Reliability: 98%</Text>
                <Ionicons name="star" size={14} color="#666" style={{ marginLeft: 4 }} />
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Shop Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  mapBackground: { flex: 1, width: '100%', height: '100%' },
  scrollContent: { flexGrow: 1 },
  mapOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'space-between' },
  mapArea: { height: 400, position: 'relative' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 20, borderRadius: 12, paddingHorizontal: 15, height: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  pinContainer: { position: 'absolute', alignItems: 'center' },
  pinBubble: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#4A6572', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4, zIndex: 2 },
  pinText: { fontSize: 14, fontWeight: '700', color: '#333' },
  pinTriangle: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#4A6572', marginTop: -1, zIndex: 1 },
  verifiedBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#4CAF50', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', zIndex: 3 },
  bottomSheet: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 25, paddingTop: 12, paddingBottom: 100, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#CCC', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  bestMatchLabel: { fontSize: 16, color: '#333', fontWeight: '500', marginBottom: 8 },
  shopName: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 6 },
  distanceText: { fontSize: 15, color: '#666', marginBottom: 4 },
  reliabilityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  reliabilityText: { fontSize: 14, color: '#555' },
  actionButton: { backgroundColor: '#35C2C1', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
