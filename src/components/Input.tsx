import { View, TextInput, Text, StyleSheet, TextInputProps, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, icon, rightIcon, style, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.surface, borderColor: error ? Colors.status.error : colors.border },
        ]}
      >
        {icon && (
          <Ionicons name={icon} size={20} color={colors.textSecondary} style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightIcon}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    height: 56,
  },
  icon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  errorText: {
    color: Colors.status.error,
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: Spacing.xs,
    marginLeft: 4,
  },
});
