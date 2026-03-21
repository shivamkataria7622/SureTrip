import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SureTripApp from './Components/SureTrip/SureTripApp';

export default function App() {
  return (
    <View style={styles.container}>
      <SureTripApp />
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
