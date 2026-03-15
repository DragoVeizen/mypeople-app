import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../constants/theme';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'small' | 'medium' | 'large';
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

const sizes = {
  small: { container: 32, text: FontSize.xs, indicator: 8 },
  medium: { container: 40, text: FontSize.sm, indicator: 10 },
  large: { container: 56, text: FontSize.lg, indicator: 14 },
};

export function Avatar({
  name,
  imageUrl,
  size = 'medium',
  showOnlineIndicator = false,
  isOnline = false,
}: AvatarProps) {
  const dimensions = sizes[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container / 2,
        },
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={[styles.initials, { fontSize: dimensions.text }]}>{initials}</Text>
      )}
      {showOnlineIndicator && (
        <View
          style={[
            styles.indicator,
            {
              width: dimensions.indicator,
              height: dimensions.indicator,
              borderRadius: dimensions.indicator / 2,
              backgroundColor: isOnline ? Colors.status.success : Colors.light.textSecondary,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  initials: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
