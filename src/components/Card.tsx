import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
}

export function Card({ children, style, padding = 'lg' }: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        { padding: Spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
