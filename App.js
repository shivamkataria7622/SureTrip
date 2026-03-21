import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AasPaasApp from './Components/AasPaas/AasPaasApp';

export default function App() {
  return (
    <View style={styles.container}>
      <AasPaasApp />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
