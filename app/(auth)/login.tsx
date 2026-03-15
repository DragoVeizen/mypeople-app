import { View, Text, StyleSheet, useColorScheme, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement Firebase auth
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Branding */}
      <View style={styles.brandingSection}>
        <View style={[styles.logoContainer, { backgroundColor: Colors.primaryLight }]}>
          <Ionicons name="people" size={48} color={Colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>MyPeople</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Coordinate life together</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formSection}>
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="hello@mypeople.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        {/* Forgot Password */}
        <Pressable style={styles.forgotPassword}>
          <Text style={[styles.forgotPasswordText, { color: Colors.primary }]}>Forgot Password?</Text>
        </Pressable>

        {/* Sign In Button */}
        <Pressable style={[styles.primaryButton, { backgroundColor: Colors.primary }]} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Social Login */}
        <View style={styles.socialButtons}>
          <Pressable style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="logo-google" size={20} color={colors.text} />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
          </Pressable>
          <Pressable style={[styles.socialButton, styles.appleButton]}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={[styles.socialButtonText, { color: '#fff' }]}>Apple</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Don't have an account?{' '}
        </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text style={[styles.footerLink, { color: Colors.primary }]}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brandingSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSize.xxxl,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
  },
  inputGroup: {
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
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  primaryButton: {
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.xs,
    fontFamily: 'PlusJakartaSans_500Medium',
    letterSpacing: 2,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 48,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  appleButton: {
    backgroundColor: '#000',
    borderWidth: 0,
  },
  socialButtonText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  footerText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  footerLink: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
