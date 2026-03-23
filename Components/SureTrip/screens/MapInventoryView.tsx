import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapInventory from '../map/MapInventory';

/**
 * MapInventoryView — thin shell that wraps MapInventory in a SafeAreaProvider.
 * All logic lives in map/MapInventory.tsx.
 */
export default function MapInventoryView() {
  return (
    <SafeAreaProvider>
      <MapInventory />
    </SafeAreaProvider>
  );
}
