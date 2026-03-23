import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AppProvider, useApp } from './Components/SureTrip/context/AppContext';
import AuthScreen from './Components/SureTrip/auth/AuthScreen';
import RoleSelectScreen from './Components/SureTrip/auth/RoleSelectScreen';
import BuyerApp from './Components/SureTrip/buyer/BuyerApp';
import SellerApp from './Components/SureTrip/seller/SellerApp';

function AppNavigator() {
  const { isLoggedIn, activeRole } = useApp();

  if (!isLoggedIn) return <AuthScreen />;
  if (!activeRole) return <RoleSelectScreen />;
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
