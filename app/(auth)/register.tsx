import { View, Text, StyleSheet, useColorScheme, Pressable, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { signUp } from '../../src/services/auth';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!fullName.trim()) return 'Please enter your name';
    if (!email.trim()) return 'Please enter your email';
    if (!password) return 'Please enter a password';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    if (!agreedToTerms) return 'Please agree to the Terms of Service';
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp(email.trim(), password, fullName.trim());
      // Navigation is handled by the auth state listener in _layout.tsx
    } catch (err: any) {
      console.error('Registration error:', err);
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to create account. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        </Link>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <Pressable style={[styles.photoPlaceholder, { borderColor: Colors.primary }]}>
            <Ionicons name="camera" size={32} color={Colors.primary} />
            <View style={[styles.addPhotoButton, { backgroundColor: Colors.primary }]}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </Pressable>
          <Text style={[styles.addPhotoText, { color: Colors.primary }]}>Add Photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={Colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="John Doe"
                placeholderTextColor={colors.textSecondary}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setError(null);
                }}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="example@mypeople.app"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                }}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                editable={!isLoading}
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

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Re-enter password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError(null);
                }}
                secureTextEntry
                autoComplete="new-password"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Terms Checkbox */}
          <Pressable style={styles.termsRow} onPress={() => setAgreedToTerms(!agreedToTerms)} disabled={isLoading}>
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked, { borderColor: agreedToTerms ? Colors.primary : colors.border }]}>
              {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              I agree to the{' '}
              <Text style={[styles.termsLink, { color: Colors.primary }]}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={[styles.termsLink, { color: Colors.primary }]}>Privacy Policy</Text>
            </Text>
          </Pressable>

          {/* Create Account Button */}
          <Pressable
            style={[
              styles.primaryButton,
              { backgroundColor: Colors.primary, opacity: agreedToTerms && !isLoading ? 1 : 0.5 }
            ]}
            onPress={handleRegister}
            disabled={!agreedToTerms || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or sign up with</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialButtons}>
            <Pressable
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => Alert.alert('Coming Soon', 'Google sign-up will be available soon!')}
            >
              <Ionicons name="logo-google" size={24} color={colors.text} />
            </Pressable>
            <Pressable
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => Alert.alert('Coming Soon', 'Apple sign-up will be available soon!')}
            >
              <Ionicons name="logo-apple" size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={[styles.footerLink, { color: Colors.primary }]}>Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  form: {
    paddingHorizontal: Spacing.xl,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.error + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
    color: Colors.status.error,
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: Spacing.sm,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'PlusJakartaSans_700Bold',
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
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
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
