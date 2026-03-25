import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Modal, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { API_BASE } from '../config/api';
import * as ImagePicker from 'expo-image-picker';

export default function SellerProfileScreen() {
  const { user, switchRole, logout, updateUser } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopImage, setShopImage] = useState<string | null>(user?.shopImageUrl || null);
  const [form, setForm] = useState({
    shopName: user?.shopName || '',
    shopCategory: user?.shopCategory || '',
    shopAddress: user?.shopAddress || ''
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setShopImage(base64Img);
    }
  };

  const handleSave = async () => {
    if (!form.shopName || !form.shopAddress || !form.shopCategory) {
      Alert.alert('Error', 'Please fill in all shop details');
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
          email: user.email,
          shopName: form.shopName,
          shopCategory: form.shopCategory,
          shopAddress: form.shopAddress,
          shopImageUrl: shopImage,
        }),
      });

      if (response.ok) {
        updateUser({ 
          shopName: form.shopName, 
          shopCategory: form.shopCategory, 
          shopAddress: form.shopAddress,
          shopImageUrl: shopImage || undefined,
        });
        Alert.alert('Success', 'Shop profile updated!');
        setIsEditing(false);
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarCircle} onPress={() => setIsEditing(true)}>
          {shopImage ? (
            <Image source={{ uri: shopImage }} style={styles.shopImage} />
          ) : (
            <Feather name="home" size={30} color="#059669" />
          )}
        </TouchableOpacity>
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

        <TouchableOpacity style={styles.menuItem} onPress={() => setIsEditing(true)}>
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

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit Shop Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Feather name="x" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
              {shopImage ? (
                <Image source={{ uri: shopImage }} style={{ width: 40, height: 40, borderRadius: 8 }} />
              ) : (
                <Feather name="camera" size={20} color="#555" />
              )}
              <Text style={styles.imagePickerText}>{shopImage ? 'Change Shop Photo' : 'Add Shop Photo'}</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Shop Name</Text>
              <TextInput 
                style={styles.input} 
                value={form.shopName}
                onChangeText={(t) => setForm({...form, shopName: t})}
                placeholder="e.g. Jain Provision Store"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Shop Category</Text>
              <TextInput 
                style={styles.input} 
                value={form.shopCategory}
                onChangeText={(t) => setForm({...form, shopCategory: t})}
                placeholder="e.g. Pharmacy, Hardware, Grocery"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Complete Address</Text>
              <TextInput 
                style={styles.input} 
                value={form.shopAddress}
                onChangeText={(t) => setForm({...form, shopAddress: t})}
                placeholder="Shop No, Street, Landmark"
                multiline
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: '#111' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 14, fontSize: 16, color: '#111' },
  saveBtn: { backgroundColor: '#059669', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  shopImage: { width: 90, height: 90, borderRadius: 28 },
  imagePickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 12, padding: 12, marginBottom: 16, gap: 10 },
  imagePickerText: { fontSize: 14, color: '#555', fontWeight: '500' },
});
