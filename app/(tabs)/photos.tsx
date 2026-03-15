import { View, Text, StyleSheet, useColorScheme, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';

const mockPhotos = [
  { id: '1', user: 'Alex', time: '2 hours ago', likes: 5, comments: 2, caption: 'New couch finally arrived!' },
  { id: '2', user: 'Jordan', time: '5 hours ago', likes: 8, comments: 4, caption: 'Taco Tuesday success!' },
  { id: '3', user: 'Sam', time: '8 hours ago', likes: 3, comments: 1, caption: 'View from the office today.' },
];

export default function PhotosScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Photos</Text>
        <Pressable style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {mockPhotos.map((photo) => (
          <View key={photo.id} style={[styles.photoCard, { backgroundColor: colors.surface }]}>
            {/* Photo Header */}
            <View style={styles.photoHeader}>
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={styles.avatarText}>{photo.user[0]}</Text>
                </View>
                <View>
                  <Text style={[styles.userName, { color: colors.text }]}>{photo.user}</Text>
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>{photo.time}</Text>
                </View>
              </View>
              <Pressable>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Photo Placeholder */}
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.border }]}>
              <Ionicons name="image-outline" size={64} color={colors.textSecondary} />
            </View>

            {/* Photo Actions */}
            <View style={styles.photoActions}>
              <View style={styles.actionButtons}>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="heart" size={24} color={Colors.status.error} />
                  <Text style={[styles.actionCount, { color: colors.text }]}>{photo.likes}</Text>
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
                  <Text style={[styles.actionCount, { color: colors.text }]}>{photo.comments}</Text>
                </Pressable>
              </View>
              <View style={[styles.locationBadge, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="location" size={14} color={Colors.primary} />
                <Text style={[styles.locationText, { color: Colors.primary }]}>Home</Text>
              </View>
            </View>

            {/* Caption */}
            <View style={styles.captionContainer}>
              <Text style={[styles.caption, { color: colors.text }]}>
                <Text style={styles.captionUser}>{photo.user}</Text> {photo.caption}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable style={[styles.fab, { backgroundColor: Colors.primary }]}>
        <Ionicons name="add-circle" size={28} color={colors.text} />
      </Pressable>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  cameraButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 100,
  },
  photoCard: {
    marginBottom: Spacing.md,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  userName: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  timeText: {
    fontSize: FontSize.xs,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  photoPlaceholder: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  locationText: {
    fontSize: FontSize.xs,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  captionContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  caption: {
    fontSize: FontSize.sm,
    fontFamily: 'PlusJakartaSans_400Regular',
    lineHeight: 20,
  },
  captionUser: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
