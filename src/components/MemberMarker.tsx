import { View, Text, Image, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface MemberMarkerProps {
  userId: string;
  displayName: string;
  photoURL?: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
  isCurrentUser?: boolean;
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function MemberMarker({
  userId,
  displayName,
  photoURL,
  latitude,
  longitude,
  timestamp,
  address,
  isCurrentUser = false,
}: MemberMarkerProps) {
  const initials = getInitials(displayName);
  const timeAgo = getTimeAgo(timestamp);

  return (
    <Marker
      key={userId}
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.markerContainer}>
        <View
          style={[
            styles.avatarContainer,
            isCurrentUser && styles.currentUserBorder,
          ]}
        >
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
        </View>
        <View style={styles.nameTag}>
          <Text style={styles.nameText} numberOfLines={1}>
            {isCurrentUser ? 'You' : displayName.split(' ')[0]}
          </Text>
        </View>
      </View>

      <Callout tooltip>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutName}>{displayName}</Text>
          {address && (
            <Text style={styles.calloutAddress} numberOfLines={2}>
              {address}
            </Text>
          )}
          <Text style={styles.calloutTime}>{timeAgo}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  currentUserBorder: {
    borderColor: Colors.status.info,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  initialsContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  nameTag: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  nameText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: FontSize.xs,
    color: Colors.light.text,
  },
  calloutContainer: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: 12,
    minWidth: 150,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: FontSize.md,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  calloutAddress: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  calloutTime: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
});
