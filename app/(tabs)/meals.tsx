import { View, Text, StyleSheet, useColorScheme, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';

const dinnerOptions = [
  { id: 'cooking', label: 'Cooking', icon: 'flame', color: Colors.dinner.cooking },
  { id: 'ordering', label: 'Ordering', icon: 'bag-handle', color: Colors.dinner.ordering },
  { id: 'outTonight', label: 'Out Tonight', icon: 'restaurant', color: Colors.dinner.outTonight },
  { id: 'unknown', label: 'Not Sure', icon: 'help-circle', color: Colors.dinner.unknown },
];

export default function MealsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tonight's Dinner</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>What's your plan?</Text>
        <View style={styles.optionsGrid}>
          {dinnerOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[styles.optionCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={32} color={option.color} />
              </View>
              <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.xl }]}>
          Household Status
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {['Alex', 'Jordan', 'Sam', 'Riley'].map((name, index) => (
            <View
              key={name}
              style={[
                styles.memberRow,
                index < 3 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                <Text style={styles.avatarText}>{name[0]}</Text>
              </View>
              <Text style={[styles.memberName, { color: colors.text }]}>{name}</Text>
              <View style={[styles.statusPill, { backgroundColor: Colors.dinner.cooking + '20' }]}>
                <Text style={[styles.statusPillText, { color: Colors.dinner.cooking }]}>Cooking</Text>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  optionCard: {
    width: '47%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  memberName: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  statusPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusPillText: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
