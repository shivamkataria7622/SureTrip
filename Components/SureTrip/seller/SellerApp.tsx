import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import SellerRequestsScreen from './SellerRequestsScreen';
import ShopDashboardScreen from './ShopDashboardScreen';
import SellerProfileScreen from './SellerProfileScreen';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'Requests', icon: 'bell', label: 'Requests' },
  { id: 'Dashboard', icon: 'grid', label: 'My Shop' },
  { id: 'Profile', icon: 'user', label: 'Profile' },
];

export default function SellerApp() {
  const [activeTab, setActiveTab] = React.useState('Requests');
  const { pendingRequests } = useApp();
  const pendingCount = pendingRequests.filter(r => !r.responded).length;

  const renderScreen = () => {
    switch (activeTab) {
      case 'Requests': return <SellerRequestsScreen />;
      case 'Dashboard': return <ShopDashboardScreen />;
      case 'Profile': return <SellerProfileScreen />;
      default: return <SellerRequestsScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <View style={styles.tabBarWrapper}>
        {Platform.OS === 'android' ? (
          <View style={[styles.tabBarInner, { backgroundColor: 'rgba(255,255,255,0.97)' }]}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                  <View>
                    <Feather name={tab.icon as any} size={22} color={isActive ? '#059669' : '#AAA'} />
                    {tab.id === 'Requests' && pendingCount > 0 && (
                      <View style={styles.notifBadge}>
                        <Text style={styles.notifText}>{pendingCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.tabLabel, { color: isActive ? '#059669' : '#AAA', fontWeight: isActive ? '700' : '500' }]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <BlurView intensity={80} tint="light" style={styles.tabBarInner}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                  <View>
                    <Feather name={tab.icon as any} size={22} color={isActive ? '#059669' : '#AAA'} />
                    {tab.id === 'Requests' && pendingCount > 0 && (
                      <View style={styles.notifBadge}>
                        <Text style={styles.notifText}>{pendingCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.tabLabel, { color: isActive ? '#059669' : '#AAA', fontWeight: isActive ? '700' : '500' }]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </BlurView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.08, shadowRadius: 12, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  tabBarInner: { flexDirection: 'row', height: 80, paddingBottom: 10, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20 },
  tabItem: { alignItems: 'center', justifyContent: 'center', minWidth: 60 },
  tabLabel: { fontSize: 11, marginTop: 4 },
  notifBadge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#DC2626', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  notifText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});
