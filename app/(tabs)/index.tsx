import { View, Text, ScrollView, useColorScheme, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';

type DinnerStatus = 'cooking' | 'ordering' | 'outTonight' | 'unknown';

interface HouseholdMember {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  dinnerStatus: DinnerStatus;
  isOnline: boolean;
}

const mockMembers: HouseholdMember[] = [
  { id: '1', name: 'Alex', location: 'Home', dinnerStatus: 'cooking', isOnline: true },
  { id: '2', name: 'Jordan', location: 'Work', dinnerStatus: 'unknown', isOnline: true },
  { id: '3', name: 'Sam', location: 'Gym', dinnerStatus: 'outTonight', isOnline: false },
  { id: '4', name: 'Riley', location: 'Home', dinnerStatus: 'ordering', isOnline: true },
];

const mockErrands = [
  { id: '1', title: 'Buy groceries', assignee: 'Alex', dueDate: 'Today', priority: 'high' },
  { id: '2', title: 'Fix bathroom leak', assignee: 'Jordan', dueDate: 'Tomorrow', priority: 'medium' },
  { id: '3', title: 'Pay electric bill', assignee: 'Sam', dueDate: 'This week', priority: 'low' },
];

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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning</Text>
          <Text style={[styles.title, { color: colors.text }]}>The Household</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={[styles.iconButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={[styles.iconButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
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
            {mockMembers.map((member) => (
              <Pressable key={member.id} style={styles.memberStatus}>
                <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={styles.avatarText}>{member.name[0]}</Text>
                  {member.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
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
            <Pressable>
              <Text style={[styles.linkText, { color: Colors.primary }]}>View Map</Text>
            </Pressable>
          </View>
          <View style={styles.locationList}>
            {mockMembers.map((member) => (
              <View key={member.id} style={styles.locationItem}>
                <View style={[styles.smallAvatar, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={styles.smallAvatarText}>{member.name[0]}</Text>
                </View>
                <Text style={[styles.memberNameSmall, { color: colors.text }]}>{member.name}</Text>
                <View style={styles.locationBadge}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.locationText, { color: colors.textSecondary }]}>{member.location}</Text>
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
            <Pressable>
              <Text style={[styles.linkText, { color: Colors.primary }]}>See All</Text>
            </Pressable>
          </View>
          <View style={styles.errandList}>
            {mockErrands.map((errand) => (
              <Pressable key={errand.id} style={[styles.errandItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(errand.priority) }]} />
                <View style={styles.errandContent}>
                  <Text style={[styles.errandTitle, { color: colors.text }]}>{errand.title}</Text>
                  <View style={styles.errandMeta}>
                    <Text style={[styles.errandAssignee, { color: colors.textSecondary }]}>{errand.assignee}</Text>
                    <Text style={[styles.errandDot, { color: colors.textSecondary }]}>•</Text>
                    <Text style={[styles.errandDue, { color: colors.textSecondary }]}>{errand.dueDate}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={[styles.addButtonText, { color: Colors.primary }]}>Add Errand</Text>
          </Pressable>
        </View>

        {/* Recent Photos */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="images" size={20} color={Colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Photos</Text>
            </View>
            <Pressable>
              <Text style={[styles.linkText, { color: Colors.primary }]}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.photoGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.photoPlaceholder, { backgroundColor: colors.border }]}>
                <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
              </View>
            ))}
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.status.success,
    borderWidth: 2,
    borderColor: '#fff',
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
  photoGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoPlaceholder: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
