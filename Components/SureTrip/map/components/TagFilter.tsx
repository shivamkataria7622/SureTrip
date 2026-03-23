// map/components/TagFilter.tsx
// Filter chips — light glass inactive, solid dark active
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface TagFilterProps {
  tags: { key: string; label: string; emoji: string }[];
  selectedTag: string;
  onSelect: (key: string) => void;
}

export default function TagFilter({ tags, selectedTag, onSelect }: TagFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag) => {
        const isActive = tag.key === selectedTag;
        if (isActive) {
          return (
            <TouchableOpacity
              key={tag.key}
              onPress={() => onSelect(tag.key)}
              style={styles.chipActive}
              activeOpacity={0.85}
            >
              <Text style={styles.emojiActive}>{tag.emoji}</Text>
              <Text style={styles.labelActive}>{tag.label}</Text>
            </TouchableOpacity>
          );
        }
        const inner = (
          <View style={styles.chipInner}>
            <Text style={styles.emojiInactive}>{tag.emoji}</Text>
            <Text style={styles.labelInactive}>{tag.label}</Text>
          </View>
        );
        if (Platform.OS === 'ios') {
          return (
            <TouchableOpacity key={tag.key} onPress={() => onSelect(tag.key)} activeOpacity={0.8}>
              <BlurView intensity={75} tint="light" style={styles.chipBlur}>
                {inner}
              </BlurView>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={tag.key}
            onPress={() => onSelect(tag.key)}
            style={[styles.chipBlur, styles.chipAndroid]}
            activeOpacity={0.8}
          >
            {inner}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Active chip
  chipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1c1c1e',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  emojiActive: { fontSize: 13 },
  labelActive: { fontSize: 13, fontWeight: '600', color: '#fff' },

  // Inactive chip (glass)
  chipBlur: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 8,
  },
  chipAndroid: {
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  emojiInactive: { fontSize: 13 },
  labelInactive: { fontSize: 13, fontWeight: '600', color: '#1c1c1e' },
});
