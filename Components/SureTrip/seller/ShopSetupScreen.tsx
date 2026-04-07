import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { API_BASE } from '../config/api';

const CATEGORIES = ['Pharmacy', 'Grocery', 'Hardware', 'Electrical', 'Plumbing', 'General'];

export default function ShopSetupScreen() {
  const { user, setupShop } = useApp();
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    if (!shopName.trim() || !address.trim() || !category) {
      Alert.alert('Validation Error', 'Please fill in all fields to continue.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/updateshopprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          shopName: shopName.trim(),
          shopCategory: category,
          shopAddress: address.trim(),
        }),
      });

      if (response.ok) {
        // Update local context
        setupShop(shopName.trim(), category, address.trim());
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Setup Failed', errorData.message || 'Could not save shop profile.');
      }
    } catch (error) {
      console.error('Setup Error:', error);
      Alert.alert('Network Error', 'Failed to save shop details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Feather name="home" size={28} color="#059669" />
        </View>
        <Text style={styles.title}>Set up your shop</Text>
        <Text style={styles.subtitle}>Help buyers find you instantly.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Gupta Medicals"
            value={shopName}
            onChangeText={setShopName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipContainer}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location / Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 123 Main St, Near Plaza"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSetup} 
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>{loading ? 'Saving...' : 'Finish Setup'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFCFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30, paddingHorizontal: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E8FDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center' },
  form: { paddingHorizontal: 24 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 14, height: 54, paddingHorizontal: 16, fontSize: 15, color: '#111' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EBEBEB' },
  chipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#FFF' },
  submitButton: { backgroundColor: '#059669', borderRadius: 14, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
