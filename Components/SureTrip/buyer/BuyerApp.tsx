import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import BuyerSearchScreen from './BuyerSearchScreen';
import MapInventoryView from '../screens/MapInventoryView';
import ProfileDashboard from '../screens/ProfileDashboard';
import DiscoveryHome from '../screens/DiscoveryHome';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Search tab removed — it's now triggered from the Home search bar
const TABS = [
  { id: 'Home', icon: 'home', label: 'Home' },
  { id: 'Nearby', icon: 'map-pin', label: 'Nearby' },
  { id: 'Profile', icon: 'user', label: 'Profile' },
];

export default function BuyerApp() {
  const [activeTab, setActiveTab] = React.useState('Home');
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Animated value for slide-up effect
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openSearch = () => {
    setSearchOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeSearch = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 320,
      useNativeDriver: true,
    }).start(() => setSearchOpen(false));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':    return <DiscoveryHome onOpenSearch={openSearch} />;
      case 'Nearby':  return <MapInventoryView />;
      case 'Profile': return <ProfileDashboard />;
      default:        return <DiscoveryHome onOpenSearch={openSearch} />;
    }
  };

  const TabBar = ({ tabs }: { tabs: typeof TABS }) => (
    <>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
            <Feather name={tab.icon as any} size={22} color={isActive ? '#11706b' : '#AAA'} />
            <Text style={[styles.tabLabel, { color: isActive ? '#11706b' : '#AAA', fontWeight: isActive ? '700' : '500' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Main content */}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBarWrapper}>
        {Platform.OS === 'android' ? (
          <View style={[styles.tabBarInner, { backgroundColor: 'rgba(255,255,255,0.97)' }]}>
            <TabBar tabs={TABS} />
          </View>
        ) : (
          <BlurView intensity={80} tint="light" style={styles.tabBarInner}>
            <TabBar tabs={TABS} />
          </BlurView>
        )}
      </View>

      {/* BuyerSearchScreen — slides up from bottom as an overlay */}
      {searchOpen && (
        <Animated.View
          style={[
            styles.searchOverlay,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <BuyerSearchScreen onClose={closeSearch} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: 'hidden', elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.08, shadowRadius: 12,
    borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  tabBarInner: {
    flexDirection: 'row', height: 80, paddingBottom: 10,
    justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', minWidth: 60 },
  tabLabel: { fontSize: 11, marginTop: 4 },

  // Full-screen overlay for BuyerSearchScreen
  searchOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100,
  },
});
