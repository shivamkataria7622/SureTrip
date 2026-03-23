import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Platform, StatusBar, Switch } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function SellerRequestsScreen() {
  const { pendingRequests, respondToRequest } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(true);

  const pending = pendingRequests.filter(r => !r.responded);

  const openYesModal = (id: string, defPrice?: string) => {
    setSelectedId(id);
    setQuantity('1'); // Default quick value
    setPrice(defPrice || '');
    setModalVisible(true);
  };

  const confirmYes = () => {
    respondToRequest(selectedId, 'yes', quantity, price);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Header & Store Status */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Live Requests</Text>
          <Text style={styles.subtitle}>Buyers nearby looking for items</Text>
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleText, { color: isShopOpen ? '#059669' : '#888' }]}>
            {isShopOpen ? 'Accepting' : 'Paused'}
          </Text>
          <Switch 
            value={isShopOpen} 
            onValueChange={setIsShopOpen} 
            trackColor={{ false: '#EBEBEB', true: '#C8F0DE' }}
            thumbColor={isShopOpen ? '#059669' : '#FFF'}
          />
        </View>
      </View>

      {!isShopOpen ? (
        <View style={styles.closedContainer}>
          <Ionicons name="moon" size={48} color="#CCC" />
          <Text style={styles.closedTitle}>You are offline</Text>
          <Text style={styles.closedSub}>Turn on 'Accepting' to receive new requests from nearby buyers.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.pulseCircle}>
                <Feather name="radio" size={32} color="#11706b" />
              </View>
              <Text style={styles.emptyText}>Listening for buyers...</Text>
              <Text style={styles.emptySubText}>Keep your app open. When someone nearby searches for your category, it will appear here instantly.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.requestCard, item.responded && styles.requestCardDone]}>
              
              {/* Urgency Badge */}
              {!item.responded && (
                <View style={styles.urgencyBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.urgencyText}>Buyer is {item.distance}</Text>
                </View>
              )}

              <View style={styles.cardTop}>
                <View style={[styles.productIconWrapper, item.responded && { backgroundColor: '#F5F5F5' }]}>
                  <Feather name="shopping-cart" size={20} color={item.responded ? '#AAA' : '#11706b'} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.productName, item.responded && { color: '#888' }]}>{item.product}</Text>
                  <Text style={styles.buyerMeta}>{item.buyerName} • Asked {item.time}</Text>
                </View>
              </View>

              {!item.responded ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.yesButton} onPress={() => openYesModal(item.id, '45')} activeOpacity={0.8}>
                    <Feather name="check-circle" size={18} color="#FFF" />
                    <Text style={styles.yesText}>YES, In Stock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.noButton} onPress={() => respondToRequest(item.id, 'no')} activeOpacity={0.8}>
                    <Feather name="x" size={18} color="#555" />
                    <Text style={styles.noText}>Sold Out</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.responseTag, item.response === 'yes' ? styles.responseYes : styles.responseNo]}>
                  <Feather name={item.response === 'yes' ? 'check-circle' : 'x-circle'} size={15} color={item.response === 'yes' ? '#059669' : '#DC2626'} />
                  <Text style={[styles.responseText, { color: item.response === 'yes' ? '#059669' : '#DC2626' }]}>
                    {item.response === 'yes' ? `You replied YES • ₹${item.price} • ${item.quantity} units` : 'You replied Sold Out'}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Modern Bottom Sheet Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Set Price & Quantity</Text>
            <Text style={styles.modalSubTitle}>This secures the buyer to walk to your shop right now.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity available</Text>
              <View style={styles.quickChipsRow}>
                {['1', '5', '10', '20+'].map(q => (
                  <TouchableOpacity 
                    key={q} 
                    style={[styles.quickChip, quantity === q && styles.quickChipActive]}
                    onPress={() => setQuantity(q)}
                  >
                    <Text style={[styles.quickChipText, quantity === q && {color: '#FFF'}]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={styles.inputField} placeholder="Or type a custom amount" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price per piece (₹)</Text>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput style={styles.priceInputField} placeholder="0.00" keyboardType="numeric" value={price} onChangeText={setPrice} autoFocus />
              </View>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmYes} activeOpacity={0.8}>
              <Text style={styles.confirmBtnText}>Confirm Item as In Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEF0F5' },
  headerLeft: { flex: 1 },
  title: { fontSize: 26, fontWeight: '800', color: '#111', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  toggleRow: { alignItems: 'center' },
  toggleText: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  
  closedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  closedTitle: { fontSize: 22, fontWeight: '700', color: '#555', marginTop: 16, marginBottom: 8 },
  closedSub: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
  
  listContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 110 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  pulseCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: 'rgba(17, 112, 107, 0.1)' },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  
  requestCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#EEF0F5' },
  requestCardDone: { backgroundColor: '#FAFAFA', shadowOpacity: 0, elevation: 0 },
  
  urgencyBadge: { position: 'absolute', top: -12, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 10 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  urgencyText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 4 },
  productIconWrapper: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
  buyerMeta: { fontSize: 13, color: '#888', fontWeight: '500' },
  
  actionRow: { flexDirection: 'row', gap: 12 },
  yesButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#059669', borderRadius: 14, paddingVertical: 14, shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  yesText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  noButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F5F6FA', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 20 },
  noText: { color: '#555', fontSize: 15, fontWeight: '700' },
  
  responseTag: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  responseYes: { backgroundColor: '#EDFBF4' },
  responseNo: { backgroundColor: '#FEF2F2' },
  responseText: { fontSize: 14, fontWeight: '600' },
  
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 5, backgroundColor: '#EBEBEB', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 6 },
  modalSubTitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 10 },
  quickChipsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  quickChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#EBEBEB' },
  quickChipActive: { backgroundColor: '#11706b', borderColor: '#11706b' },
  quickChipText: { fontSize: 15, fontWeight: '600', color: '#444' },
  inputField: { backgroundColor: '#F5F6FA', borderRadius: 14, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#111', borderWidth: 1, borderColor: '#EBEBEB' },
  
  priceInputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#11706b', paddingBottom: 5 },
  rupeeSymbol: { fontSize: 32, fontWeight: '700', color: '#111', marginRight: 10 },
  priceInputField: { flex: 1, fontSize: 36, fontWeight: '800', color: '#111' },
  
  confirmBtn: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 10 },
  cancelBtnText: { color: '#888', fontSize: 15, fontWeight: '600' },
});
