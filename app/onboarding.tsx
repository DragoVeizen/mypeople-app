import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { useAuthStore } from '../src/stores/authStore';
import { useHouseholdStore } from '../src/stores/householdStore';
import { useLocationStore } from '../src/stores/locationStore';
import { getCurrentUser } from '../src/services/auth';

type OnboardingStep = 'permissions' | 'household';

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { user, setUser } = useAuthStore();
  const { createNewHousehold, joinExistingHousehold, isLoading: householdLoading, error: householdError } = useHouseholdStore();
  const { requestPermissions: requestLocationPermissions, foregroundPermission, backgroundPermission } = useLocationStore();

  const [step, setStep] = useState<OnboardingStep>('permissions');
  const [householdMode, setHouseholdMode] = useState<'create' | 'join' | null>(null);
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Permission states
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  const handleRequestLocationPermission = async () => {
    const granted = await requestLocationPermissions();
    setLocationGranted(granted);
    if (!granted) {
      Alert.alert(
        'Location Permission',
        'Location access is needed to share your location with household members. You can enable it later in Settings.',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Continue Anyway', style: 'cancel' },
        ]
      );
    }
  };

  const handleRequestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setNotificationsGranted(granted);
    if (!granted) {
      Alert.alert(
        'Notification Permission',
        'Notifications help you stay updated on household activities. You can enable them later in Settings.',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Continue Anyway', style: 'cancel' },
        ]
      );
    }
  };

  const handleContinueToHousehold = () => {
    setStep('household');
  };

  const handleCreateHousehold = async () => {
    if (!householdName.trim()) {
      setError('Please enter a household name');
      return;
    }

    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await createNewHousehold(householdName.trim(), user.id);
      // Refresh user data
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Failed to create household. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await joinExistingHousehold(inviteCode.trim().toUpperCase(), user.id);
      if (success) {
        // Refresh user data
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
        router.replace('/(tabs)');
      } else {
        setError('Invalid invite code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to join household. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Permissions Step
  if (step === 'permissions') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Set Up Permissions</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            These permissions help you get the most out of MyPeople
          </Text>
        </View>

        <View style={styles.content}>
          {/* Location Permission */}
          <Pressable
            style={[styles.permissionCard, { backgroundColor: colors.surface }]}
            onPress={handleRequestLocationPermission}
            disabled={locationGranted}
          >
            <View style={[styles.permissionIcon, { backgroundColor: locationGranted ? Colors.status.success + '20' : Colors.primaryLight }]}>
              <Ionicons
                name={locationGranted ? 'checkmark-circle' : 'location'}
                size={28}
                color={locationGranted ? Colors.status.success : Colors.primary}
              />
            </View>
            <View style={styles.permissionInfo}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Location</Text>
              <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
                Share your location with household members
              </Text>
            </View>
            {locationGranted ? (
              <Ionicons name="checkmark-circle" size={24} color={Colors.status.success} />
            ) : (
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            )}
          </Pressable>

          {/* Notification Permission */}
          <Pressable
            style={[styles.permissionCard, { backgroundColor: colors.surface }]}
            onPress={handleRequestNotificationPermission}
            disabled={notificationsGranted}
          >
            <View style={[styles.permissionIcon, { backgroundColor: notificationsGranted ? Colors.status.success + '20' : Colors.primaryLight }]}>
              <Ionicons
                name={notificationsGranted ? 'checkmark-circle' : 'notifications'}
                size={28}
                color={notificationsGranted ? Colors.status.success : Colors.primary}
              />
            </View>
            <View style={styles.permissionInfo}>
              <Text style={[styles.permissionTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
                Get updates on errands, dinner plans, and more
              </Text>
            </View>
            {notificationsGranted ? (
              <Ionicons name="checkmark-circle" size={24} color={Colors.status.success} />
            ) : (
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: Colors.primary }]}
            onPress={handleContinueToHousehold}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Household Step
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => setStep('permissions')}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Set Up Household</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Create a new household or join an existing one
        </Text>
      </View>

      <View style={styles.content}>
        {!householdMode ? (
          <>
            {/* Create Household Option */}
            <Pressable
              style={[styles.optionCard, { backgroundColor: colors.surface }]}
              onPress={() => setHouseholdMode('create')}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="add-circle" size={32} color={Colors.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Create New Household</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Start a new household and invite your family
              </Text>
            </Pressable>

            {/* Join Household Option */}
            <Pressable
              style={[styles.optionCard, { backgroundColor: colors.surface }]}
              onPress={() => setHouseholdMode('join')}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="people" size={32} color={Colors.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Join Existing Household</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Enter an invite code to join your family
              </Text>
            </Pressable>
          </>
        ) : householdMode === 'create' ? (
          <View style={styles.formContainer}>
            <Pressable style={styles.backLink} onPress={() => setHouseholdMode(null)}>
              <Ionicons name="arrow-back" size={20} color={Colors.primary} />
              <Text style={[styles.backLinkText, { color: Colors.primary }]}>Back</Text>
            </Pressable>

            <View style={[styles.formIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="home" size={48} color={Colors.primary} />
            </View>

            <Text style={[styles.formTitle, { color: colors.text }]}>Name Your Household</Text>
            <Text style={[styles.formDescription, { color: colors.textSecondary }]}>
              Choose a name that represents your family
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={Colors.status.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="e.g., The Smiths, Our Home"
              placeholderTextColor={colors.textSecondary}
              value={householdName}
              onChangeText={(text) => {
                setHouseholdName(text);
                setError(null);
              }}
              autoFocus
            />

            <Pressable
              style={[styles.primaryButton, { backgroundColor: Colors.primary, opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleCreateHousehold}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Household</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Pressable style={styles.backLink} onPress={() => setHouseholdMode(null)}>
              <Ionicons name="arrow-back" size={20} color={Colors.primary} />
              <Text style={[styles.backLinkText, { color: Colors.primary }]}>Back</Text>
            </Pressable>

            <View style={[styles.formIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="key" size={48} color={Colors.primary} />
            </View>

            <Text style={[styles.formTitle, { color: colors.text }]}>Enter Invite Code</Text>
            <Text style={[styles.formDescription, { color: colors.textSecondary }]}>
              Ask a household member for the 6-character code
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={Colors.status.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TextInput
              style={[styles.input, styles.codeInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="XXXXXX"
              placeholderTextColor={colors.textSecondary}
              value={inviteCode}
              onChangeText={(text) => {
                setInviteCode(text.toUpperCase());
                setError(null);
              }}
              maxLength={6}
              autoCapitalize="characters"
              autoFocus
            />

            <Pressable
              style={[styles.primaryButton, { backgroundColor: Colors.primary, opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleJoinHousehold}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Join Household</Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.lg,
  },
  permissionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  optionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  optionDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
  },
  formContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  backLinkText: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  formIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  formDescription: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.error + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    width: '100%',
  },
  errorText: {
    flex: 1,
    color: Colors.status.error,
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  codeInput: {
    textAlign: 'center',
    fontSize: FontSize.xxl,
    letterSpacing: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
