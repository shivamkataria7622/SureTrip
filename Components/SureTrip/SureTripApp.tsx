import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import DiscoveryHome from './screens/DiscoveryHome';
import SearchResultsList from './screens/SearchResultsList';
import MapInventoryView from './screens/MapInventoryView';
import ShopInventoryDetails from './screens/ShopInventoryDetails';

const TABS = [
  { id: 'Home', icon: 'home-outline', iconActive: 'home', label: 'Home' },
  { id: 'Search', icon: 'search-outline', iconActive: 'search', label: 'Search' },
  { id: 'Nearby', icon: 'location-outline', iconActive: 'location', label: 'Nearby' },
  { id: 'Offers', icon: 'pricetag-outline', iconActive: 'pricetag', label: 'Offers' },
  { id: 'Profile', icon: 'person-outline', iconActive: 'person', label: 'Profile' }
];

export default function SureTripApp() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <DiscoveryHome />;
      case 'Search':
        return <SearchResultsList />;
      case 'Nearby':
        return <MapInventoryView />;
      case 'Offers':
        return <ShopInventoryDetails />;
      case 'Profile':
        return (
          <View style={styles.placeholderScreen}>
            <Text style={styles.placeholderText}>Profile Screen Placeholder</Text>
          </View>
        );
      default:
        return <DiscoveryHome />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <View style={styles.tabBarWrapper}>
        {Platform.OS === 'android' ? (
          <View style={[styles.blurContainer, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
            <View style={styles.tabBarInner}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const activeColor = '#3014b8';
                const inactiveColor = '#888';

                return (
                  <TouchableOpacity 
                    key={tab.id} 
                    style={styles.tabItem} 
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={isActive ? tab.iconActive as any : tab.icon as any} 
                      size={24} 
                      color={isActive ? activeColor : inactiveColor} 
                    />
                    <Text style={[
                        styles.tabLabel, 
                        { color: isActive ? activeColor : inactiveColor },
                        isActive ? { fontWeight: '600' } : {}
                    ]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        ) : (
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>
            <View style={styles.tabBarInner}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const activeColor = '#3014b8';
                const inactiveColor = '#888';

                return (
                  <TouchableOpacity 
                    key={tab.id} 
                    style={styles.tabItem} 
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={isActive ? tab.iconActive as any : tab.icon as any} 
                      size={24} 
                      color={isActive ? activeColor : inactiveColor} 
                    />
                    <Text style={[
                        styles.tabLabel, 
                        { color: isActive ? activeColor : inactiveColor },
                        isActive ? { fontWeight: '600' } : {}
                    ]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </BlurView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  screenContainer: { flex: 1 },
  placeholderScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9FC' },
  placeholderText: { fontSize: 18, color: '#888' },
  tabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 20, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.4)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.4)', borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.4)' },
  blurContainer: { width: '100%', paddingBottom: 25 },
  tabBarInner: { flexDirection: 'row', height: 65, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, backgroundColor: 'rgba(255, 255, 255, 0.15)' },
  tabItem: { alignItems: 'center', justifyContent: 'center', minWidth: 60 },
  tabLabel: { fontSize: 11, marginTop: 4 },
});
