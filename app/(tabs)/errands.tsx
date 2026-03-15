import { View, Text, StyleSheet, useColorScheme, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';

const mockErrands = [
  { id: '1', title: 'Buy groceries', description: 'Milk, eggs, bread', assignee: 'Alex', dueDate: 'Today', priority: 'high', status: 'pending' },
  { id: '2', title: 'Fix bathroom leak', description: 'Call plumber if needed', assignee: 'Jordan', dueDate: 'Tomorrow', priority: 'high', status: 'inProgress' },
  { id: '3', title: 'Pay electric bill', description: '$125 due', assignee: 'Sam', dueDate: 'This week', priority: 'medium', status: 'pending' },
  { id: '4', title: 'Clean garage', assignee: 'Riley', dueDate: 'This week', priority: 'low', status: 'pending' },
  { id: '5', title: 'Schedule HVAC service', assignee: 'Alex', dueDate: 'Next week', priority: 'low', status: 'completed' },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return Colors.status.error;
    case 'medium': return Colors.status.warning;
    default: return Colors.light.textSecondary;
  }
}

export default function ErrandsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const pendingErrands = mockErrands.filter(e => e.status !== 'completed');
  const completedErrands = mockErrands.filter(e => e.status === 'completed');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Errands</Text>
        <Pressable style={[styles.addButton, { backgroundColor: Colors.primary }]}>
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {['All', 'Mine', 'Today', 'High Priority'].map((filter, index) => (
            <Pressable
              key={filter}
              style={[
                styles.filterPill,
                { backgroundColor: index === 0 ? Colors.primary : colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: index === 0 ? '#fff' : colors.text },
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Pending Errands */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          To Do ({pendingErrands.length})
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {pendingErrands.map((errand, index) => (
            <Pressable
              key={errand.id}
              style={[
                styles.errandItem,
                index < pendingErrands.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Pressable style={[styles.checkbox, { borderColor: colors.border }]}>
                {errand.status === 'inProgress' && (
                  <View style={[styles.checkboxInProgress, { backgroundColor: Colors.primary }]} />
                )}
              </Pressable>
              <View style={styles.errandContent}>
                <View style={styles.errandHeader}>
                  <Text style={[styles.errandTitle, { color: colors.text }]}>{errand.title}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(errand.priority) + '20' }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(errand.priority) }]}>
                      {errand.priority}
                    </Text>
                  </View>
                </View>
                {errand.description && (
                  <Text style={[styles.errandDescription, { color: colors.textSecondary }]}>
                    {errand.description}
                  </Text>
                )}
                <View style={styles.errandMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{errand.assignee}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{errand.dueDate}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Completed */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.xl }]}>
          Completed ({completedErrands.length})
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {completedErrands.map((errand) => (
            <View key={errand.id} style={styles.errandItem}>
              <View style={[styles.checkbox, styles.checkboxChecked, { borderColor: Colors.primary, backgroundColor: Colors.primary }]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <View style={styles.errandContent}>
                <Text style={[styles.errandTitle, styles.completedText, { color: colors.textSecondary }]}>
                  {errand.title}
                </Text>
              </View>
            </View>
          ))}
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
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  filterRow: {
    marginBottom: Spacing.lg,
  },
  filterPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  errandItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxInProgress: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  checkboxChecked: {
    borderWidth: 0,
  },
  errandContent: {
    flex: 1,
  },
  errandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  errandTitle: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  errandDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginBottom: Spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    fontSize: FontSize.xs,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textTransform: 'capitalize',
  },
  errandMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
