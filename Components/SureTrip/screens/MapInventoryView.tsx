import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapInventory from '../map/MapInventory';

interface Props {
  onNavigationChange?: (isNav: boolean) => void;
}

/**
 * MapInventoryView — thin shell that wraps MapInventory in a SafeAreaProvider.
 * Passes onNavigationChange so BuyerApp can hide the tab bar during navigation.
 */
export default function MapInventoryView({ onNavigationChange }: Props) {
  return (
    <SafeAreaProvider>
      <MapInventory onNavigationChange={onNavigationChange} />
    </SafeAreaProvider>
  );
}
