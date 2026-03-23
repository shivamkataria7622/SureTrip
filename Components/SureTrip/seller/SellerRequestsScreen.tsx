import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function SellerRequestsScreen() {
  const { pendingRequests, respondToRequest } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const pending = pendingRequests.filter(r => !r.responded);
  const answered = pendingRequests.filter(r => r.responded);

  const openYesModal = (id: string) => {
    setSelectedId(id);
    setQuantity('');
    setPrice('');
    setModalVisible(true);
  };

  const confirmYes = () => {
    respondToRequest(selectedId, 'yes', quantity, price);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Incoming Requests</Text>
        {pending.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pending.length} new</Text>
          </View>
        )}
      </View>

      <FlatList
        data={pendingRequests}
        keyExtractor={i => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="bell" size={40} color="#CCC" />
            <Text style={styles.emptyText}>No requests yet</Text>
            <Text style={styles.emptySubText}>When buyers nearby search for products, you'll see them here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.requestCard, item.responded && styles.requestCardDone]}>
            <View style={styles.cardTop}>
              <View style={styles.productIconWrapper}>
                <Feather name="package" size={20} color={item.responded ? '#888' : '#3014b8'} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.productName}>{item.product}</Text>
                <Text style={styles.buyerMeta}>{item.buyerName} • {item.distance} • {item.time}</Text>
              </View>
            </View>

            {!item.responded ? (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.yesButton} onPress={() => openYesModal(item.id)}>
                  <Feather name="check" size={16} color="#FFF" />
                  <Text style={styles.yesText}>YES, I have it</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.noButton} onPress={() => respondToRequest(item.id, 'no')}>
                  <Feather name="x" size={16} color="#888" />
                  <Text style={styles.noText}>NO</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.responseTag, item.response === 'yes' ? styles.responseYes : styles.responseNo]}>
                <Feather name={item.response === 'yes' ? 'check-circle' : 'x-circle'} size={14} color={item.response === 'yes' ? '#059669' : '#DC2626'} />
                <Text style={[styles.responseText, { color: item.response === 'yes' ? '#059669' : '#DC2626' }]}>
                  {item.response === 'yes' ? `In Stock • ₹${item.price} • ${item.quantity} pcs` : 'Marked as Out of Stock'}
                </Text>
              </View>
            )}
          </View>
        )}
      />

      {/* YES Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Tell buyers the details</Text>
            <Text style={styles.modalSubTitle}>This helps buyers decide to walk to your shop</Text>

            <View style={styles.modalInput}>
              <Text style={styles.inputLabel}>Quantity available</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. 10"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>

            <View style={styles.modalInput}>
              <Text style={styles.inputLabel}>Price (₹)</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. 45"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmYes}>
              <Text style={styles.confirmBtnText}>Confirm — Yes, I have it!</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 10, gap: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#111' },
  badge: { backgroundColor: '#EEF0FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#3014b8' },
  listContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 110 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#555', marginTop: 16, marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  requestCard: { borderWidth: 1.5, borderColor: '#EBEBEB', borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: '#FAFCFF' },
  requestCardDone: { backgroundColor: '#FAFAFA', borderColor: '#F0F0F0' },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  productIconWrapper: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#EEF0FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  productName: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 4 },
  buyerMeta: { fontSize: 13, color: '#888' },
  actionRow: { flexDirection: 'row', gap: 10 },
  yesButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#059669', borderRadius: 12, paddingVertical: 14 },
  yesText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  noButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F5F5F5', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20 },
  noText: { color: '#888', fontSize: 15, fontWeight: '600' },
  responseTag: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  responseYes: { backgroundColor: '#EDFBF4' },
  responseNo: { backgroundColor: '#FEF2F2' },
  responseText: { fontSize: 13, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 6 },
  modalSubTitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  modalInput: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  inputField: { backgroundColor: '#F5F6FA', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 16, color: '#111', borderWidth: 1, borderColor: '#EBEBEB' },
  confirmBtn: { backgroundColor: '#059669', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', marginTop: 12 },
  cancelBtnText: { color: '#888', fontSize: 15 },
});
