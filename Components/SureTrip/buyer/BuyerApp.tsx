import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import BuyerSearchScreen from './BuyerSearchScreen';
import MapInventoryView from '../screens/MapInventoryView';
import ProfileDashboard from '../screens/ProfileDashboard';

const TABS = [
  { id: 'Search', icon: 'search', label: 'Search' },
  { id: 'Nearby', icon: 'map-pin', label: 'Nearby' },
  { id: 'Profile', icon: 'user', label: 'Profile' },
];

export default function BuyerApp() {
  const [activeTab, setActiveTab] = React.useState('Search');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Search': return <BuyerSearchScreen />;
      case 'Nearby': return <MapInventoryView />;
      case 'Profile': return <ProfileDashboard />;
      default: return <BuyerSearchScreen />;
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
                  <Feather name={tab.icon as any} size={22} color={isActive ? '#3014b8' : '#AAA'} />
                  <Text style={[styles.tabLabel, { color: isActive ? '#3014b8' : '#AAA', fontWeight: isActive ? '700' : '500' }]}>{tab.label}</Text>
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
                  <Feather name={tab.icon as any} size={22} color={isActive ? '#3014b8' : '#AAA'} />
                  <Text style={[styles.tabLabel, { color: isActive ? '#3014b8' : '#AAA', fontWeight: isActive ? '700' : '500' }]}>{tab.label}</Text>
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
});
