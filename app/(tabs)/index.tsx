import { useEffect, useState } from 'react';
import { View, Text, ScrollView, useColorScheme, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';
import { useHouseholdStore } from '../../src/stores/householdStore';
import { DinnerStatus, User, Errand } from '../../src/types';
import { signOut } from '../../src/services/auth';

function getDinnerStatusColor(status: DinnerStatus) {
  switch (status) {
    case 'cooking': return Colors.dinner.cooking;
    case 'ordering': return Colors.dinner.ordering;
    case 'outTonight': return Colors.dinner.outTonight;
    default: return Colors.dinner.unknown;
  }
}

function getDinnerStatusLabel(status: DinnerStatus) {
  switch (status) {
    case 'cooking': return 'Cooking';
    case 'ordering': return 'Ordering';
    case 'outTonight': return 'Out Tonight';
    default: return 'Unknown';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return Colors.status.error;
    case 'medium': return Colors.status.warning;
    default: return Colors.light.textSecondary;
  }
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDueDate(timestamp?: number): string {
  if (!timestamp) return 'No due date';

  const now = new Date();
  const due = new Date(timestamp);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  return due.toLocaleDateString();
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { user } = useAuthStore();
  const { household, members, errands, subscribeToAll, updateMyDinnerStatus } = useHouseholdStore();
  const [selectedStatus, setSelectedStatus] = useState<DinnerStatus | null>(null);

  // Subscribe to household data when user has a household
  useEffect(() => {
    if (user?.householdId) {
      subscribeToAll(user.householdId);
    }
  }, [user?.householdId]);

  // If user has no household, show onboarding prompt
  if (user && !user.householdId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getTimeGreeting()}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{user.displayName}</Text>
          </View>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.onboardingContainer}>
          <View style={[styles.onboardingCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="home" size={64} color={Colors.primary} />
            <Text style={[styles.onboardingTitle, { color: colors.text }]}>
              Set Up Your Household
            </Text>
            <Text style={[styles.onboardingText, { color: colors.textSecondary }]}>
              Create a new household or join an existing one to start coordinating with your family.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/onboarding')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleDinnerStatusPress = async (status: DinnerStatus) => {
    if (!user) return;
    setSelectedStatus(status);
    await updateMyDinnerStatus(user.id, status);
    setSelectedStatus(null);
  };

  const getMemberName = (userId?: string): string => {
    if (!userId) return 'Unassigned';
    const member = members.find(m => m.id === userId);
    return member?.displayName.split(' ')[0] || 'Unknown';
  };

  const pendingErrands = errands.filter(e => e.status !== 'completed').slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getTimeGreeting()}</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {household?.name || 'My Household'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={[styles.iconButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tonight's Dinner Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="restaurant" size={20} color={Colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Tonight's Dinner</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Tap to update your status</Text>
          </View>
          <View style={styles.dinnerStatusGrid}>
            {members.map((member) => (
              <Pressable
                key={member.id}
                style={styles.memberStatus}
                onPress={() => member.id === user?.id && handleDinnerStatusPress(
                  member.dinnerStatus === 'cooking' ? 'ordering' :
                  member.dinnerStatus === 'ordering' ? 'outTonight' :
                  member.dinnerStatus === 'outTonight' ? 'unknown' : 'cooking'
                )}
              >
                <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={styles.avatarText}>{member.displayName[0]}</Text>
                  {member.id === user?.id && selectedStatus && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                  )}
                </View>
                <Text style={[styles.memberName, { color: colors.text }]}>
                  {member.id === user?.id ? 'You' : member.displayName.split(' ')[0]}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getDinnerStatusColor(member.dinnerStatus) + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getDinnerStatusColor(member.dinnerStatus) }]} />
                  <Text style={[styles.statusText, { color: getDinnerStatusColor(member.dinnerStatus) }]}>
                    {getDinnerStatusLabel(member.dinnerStatus)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Location Overview */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Where is Everyone?</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/map')}>
              <Text style={[styles.linkText, { color: Colors.primary }]}>View Map</Text>
            </Pressable>
          </View>
          <View style={styles.locationList}>
            {members.map((member) => (
              <View key={member.id} style={styles.locationItem}>
                <View style={[styles.smallAvatar, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={styles.smallAvatarText}>{member.displayName[0]}</Text>
                </View>
                <Text style={[styles.memberNameSmall, { color: colors.text }]}>
                  {member.id === user?.id ? 'You' : member.displayName.split(' ')[0]}
                </Text>
                <View style={styles.locationBadge}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                    {member.location?.address?.split(',')[0] || 'Unknown'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Errands Section */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="checkbox" size={20} color={Colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Upcoming Errands</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/errands')}>
              <Text style={[styles.linkText, { color: Colors.primary }]}>See All</Text>
            </Pressable>
          </View>
          {pendingErrands.length > 0 ? (
            <View style={styles.errandList}>
              {pendingErrands.map((errand) => (
                <Pressable key={errand.id} style={[styles.errandItem, { borderBottomColor: colors.border }]}>
                  <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(errand.priority) }]} />
                  <View style={styles.errandContent}>
                    <Text style={[styles.errandTitle, { color: colors.text }]}>{errand.title}</Text>
                    <View style={styles.errandMeta}>
                      <Text style={[styles.errandAssignee, { color: colors.textSecondary }]}>
                        {getMemberName(errand.assignedTo)}
                      </Text>
                      <Text style={[styles.errandDot, { color: colors.textSecondary }]}>•</Text>
                      <Text style={[styles.errandDue, { color: colors.textSecondary }]}>
                        {formatDueDate(errand.dueDate)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No pending errands!
              </Text>
            </View>
          )}
          <Pressable style={styles.addButton} onPress={() => router.push('/(tabs)/errands')}>
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={[styles.addButtonText, { color: Colors.primary }]}>Add Errand</Text>
          </Pressable>
        </View>

        {/* Household Info Card */}
        {household && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="people" size={20} color={Colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>Household Info</Text>
              </View>
            </View>
            <View style={styles.inviteCodeContainer}>
              <Text style={[styles.inviteCodeLabel, { color: colors.textSecondary }]}>
                Invite Code
              </Text>
              <Text style={[styles.inviteCode, { color: colors.text }]}>
                {household.inviteCode}
              </Text>
              <Text style={[styles.inviteCodeHint, { color: colors.textSecondary }]}>
                Share this code with family members to join
              </Text>
            </View>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cardSubtitle: {
    fontSize: FontSize.xs,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: 2,
    marginLeft: 28,
  },
  linkText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  dinnerStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  memberStatus: {
    alignItems: 'center',
    width: '22%',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    position: 'relative',
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  locationList: {
    gap: Spacing.md,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  memberNameSmall: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  errandList: {
    gap: 0,
  },
  errandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  errandContent: {
    flex: 1,
  },
  errandTitle: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 2,
  },
  errandMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errandAssignee: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  errandDot: {
    fontSize: FontSize.sm,
  },
  errandDue: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyStateText: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.lg,
  },
  addButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  inviteCodeContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  inviteCodeLabel: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginBottom: Spacing.sm,
  },
  inviteCode: {
    fontSize: FontSize.xxxl,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 4,
  },
  inviteCodeHint: {
    fontSize: FontSize.xs,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  onboardingContainer: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  onboardingCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  onboardingTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
  },
  onboardingText: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
