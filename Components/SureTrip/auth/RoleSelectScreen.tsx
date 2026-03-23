import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function RoleSelectScreen() {
  const { setRole, user } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0]} 👋</Text>
        <Text style={styles.title}>How will you use{'\n'}SureTrip today?</Text>
        <Text style={styles.subtitle}>You can switch roles anytime from your profile.</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => setRole('buyer')} activeOpacity={0.85}>
          <View style={[styles.cardIcon, { backgroundColor: '#EEF0FF' }]}>
            <Feather name="shopping-bag" size={32} color="#3014b8" />
          </View>
          <Text style={styles.cardTitle}>I'm a Buyer</Text>
          <Text style={styles.cardDesc}>Search for products and find nearby shops that have them in stock right now.</Text>
          <View style={styles.cardArrow}>
            <Feather name="arrow-right" size={18} color="#3014b8" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardSeller]} onPress={() => setRole('seller')} activeOpacity={0.85}>
          <View style={[styles.cardIcon, { backgroundColor: '#E8FDF5' }]}>
            <Feather name="home" size={32} color="#059669" />
          </View>
          <Text style={styles.cardTitle}>I'm a Shopkeeper</Text>
          <Text style={styles.cardDesc}>Receive real-time pings from nearby customers looking for your products.</Text>
          <View style={[styles.cardArrow, { backgroundColor: '#E8FDF5' }]}>
            <Feather name="arrow-right" size={18} color="#059669" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  top: { paddingHorizontal: 28, paddingTop: 50, paddingBottom: 30 },
  greeting: { fontSize: 16, color: '#888', fontWeight: '500', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#111', letterSpacing: -0.5, lineHeight: 40, marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#999' },
  cardsContainer: { paddingHorizontal: 24, gap: 16 },
  card: { borderRadius: 20, padding: 24, borderWidth: 1.5, borderColor: '#EBEBEB', backgroundColor: '#FAFCFF' },
  cardSeller: { borderColor: '#C8F0DE', backgroundColor: '#FAFFFD' },
  cardIcon: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 20 },
  cardArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF0FF', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
});
