import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AppProvider, useApp } from './Components/SureTrip/context/AppContext';
import AuthScreen from './Components/SureTrip/auth/AuthScreen';
import RoleSelectScreen from './Components/SureTrip/auth/RoleSelectScreen';
import BuyerApp from './Components/SureTrip/buyer/BuyerApp';
import SellerApp from './Components/SureTrip/seller/SellerApp';
import { registerForPushNotificationsAsync, saveTokenToBackend, setupNotificationListeners } from './Components/SureTrip/services/NotificationService';
import ShopSetupScreen from './Components/SureTrip/seller/ShopSetupScreen';
function AppNavigator() {
  const { isLoggedIn, activeRole, user, isLoading } = useApp();

  useEffect(() => {
    let unsubscribe;

    if (isLoggedIn && user?.uid) {
      // Register for notifications
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          // For now, we use the email for matching on the backend since documents use email as ID
          saveTokenToBackend(token, user.email);
        }
      });

      // Setup listeners
      unsubscribe = setupNotificationListeners();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isLoggedIn, user?.uid]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#11706b" />
      </View>
    );
  }

  if (!isLoggedIn ) return <AuthScreen />;
  if (!activeRole) return <RoleSelectScreen />;
  if (activeRole === 'seller' && !user?.shopName) return <ShopSetupScreen />;
  if (activeRole === 'buyer') return <BuyerApp />;
  if (activeRole === 'seller') return <SellerApp />;
  return <AuthScreen />;
}

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="dark" />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
