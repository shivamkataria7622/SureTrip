import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RESULTS = [
  { id: '1', name: 'Apollo Pharmacy', distance: '0.5 km away', verified: 'Verified 10 mins ago', price: '₹15.00', subtitle: 'Centehip shop' },
  { id: '2', name: 'Wellness Forever', distance: '1.3 km away', verified: 'Verified 10 mins ago', price: '₹15.00', subtitle: 'Centehip shop' },
  { id: '3', name: 'Noble Chemist', distance: '0.5 km away', verified: 'Verified 10 mins ago', price: '₹15.00', subtitle: 'Carlified shops' },
  { id: '4', name: 'Apsla Chemist', distance: '2.1 km away', verified: 'Verified 15 mins ago', price: '₹15.50', subtitle: 'Local shop' },
];

export default function SearchResultsList() {
  const [activeTab, setActiveTab] = useState('Best Match');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SureTrip</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Crocin Advance" placeholderTextColor="#666" value="Crocin Advance" editable={true} />
          <Ionicons name="search" size={20} color="#3014b8" style={styles.searchIcon} />
        </View>
        <View style={styles.tabsContainer}>
          {['Best Match', 'Price', 'Distance'].map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab ? styles.activeTabButton : {}]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : {}]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.listContent}>
          {RESULTS.map((item) => (
            <View key={item.id} style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <View style={styles.imagePlaceholder}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' }} style={styles.itemImage} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={12} color="#3014b8" />
                    <Text style={styles.infoText}>{item.distance}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="checkmark-circle" size={12} color="#35C2C1" />
                    <Text style={styles.infoText}>{item.verified}</Text>
                  </View>
                </View>
                <Text style={styles.price}>{item.price}</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <TouchableOpacity>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { paddingBottom: 100 },
  header: { alignItems: 'center', paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },
  searchIcon: { marginLeft: 10 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tabButton: { paddingBottom: 10, paddingHorizontal: 10 },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: '#3014b8' },
  tabText: { fontSize: 14, color: '#888', fontWeight: '500' },
  activeTabText: { color: '#3014b8', fontWeight: '600' },
  listContent: { padding: 20 },
  resultCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#F0F0F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  imagePlaceholder: { width: 60, height: 60, backgroundColor: '#F8FAFC', borderRadius: 10, padding: 5, marginRight: 15, borderWidth: 1, borderColor: '#EEE' },
  itemImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  cardInfo: { flex: 1 },
  shopName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#666', marginLeft: 5 },
  price: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  subtitle: { fontSize: 13, color: '#888' },
  viewDetailsText: { fontSize: 14, fontWeight: '700', color: '#3014b8' },
});
