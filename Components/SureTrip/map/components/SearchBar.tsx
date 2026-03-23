// map/components/SearchBar.tsx
// Apple Maps-inspired glass search bar
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search inventory nearby...',
}: SearchBarProps) {
  const inner = (
    <View style={styles.inner}>
      <Ionicons name="search" size={18} color="#8e8e93" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8e8e93"
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          style={styles.clearBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <View style={styles.clearCircle}>
            <Ionicons name="close" size={11} color="#636366" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.filterBtn}>
          <Ionicons name="options" size={16} color="#fff" />
        </View>
      )}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={80} tint="light" style={styles.container}>
        {inner}
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.containerAndroid]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    // glass border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  containerAndroid: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  icon: { flexShrink: 0 },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1c1c1e',
  },
  clearBtn: {},
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e5ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
