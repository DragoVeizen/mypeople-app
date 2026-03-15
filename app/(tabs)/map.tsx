import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { useLocationStore } from '../../src/stores/locationStore';
import { useAuthStore } from '../../src/stores/authStore';
import { MemberMarker } from '../../src/components/MemberMarker';

// Import location task to ensure it's registered
import '../../src/services/locationTask';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const mapRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  const { user } = useAuthStore();
  const {
    currentLocation,
    householdLocations,
    isTracking,
    foregroundPermission,
    backgroundPermission,
    error,
    isLoading,
    requestPermissions,
    checkPermissions,
    fetchCurrentLocation,
    startTracking,
    stopTracking,
    subscribeToHousehold,
    setError,
  } = useLocationStore();

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  // Subscribe to household locations when user has a household
  useEffect(() => {
    if (user?.householdId && isTracking) {
      const unsubscribe = subscribeToHousehold(user.householdId);
      return () => unsubscribe();
    }
  }, [user?.householdId, isTracking]);

  // Set initial map region when location is available
  useEffect(() => {
    if (currentLocation && !initialRegion) {
      setInitialRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [currentLocation, initialRegion]);

  const handleEnableLocation = useCallback(async () => {
    setError(null);
    const granted = await requestPermissions();

    if (granted && user) {
      await startTracking(user.id);
    } else if (foregroundPermission === 'denied') {
      // Permission was denied, prompt to open settings
      Linking.openSettings();
    }
  }, [user, foregroundPermission]);

  const handleToggleTracking = useCallback(async () => {
    if (isTracking) {
      await stopTracking();
    } else if (user) {
      await startTracking(user.id);
    }
  }, [isTracking, user]);

  const handleCenterOnMe = useCallback(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  }, [currentLocation]);

  const handleRefreshLocation = useCallback(async () => {
    if (user) {
      await startTracking(user.id);
    }
  }, [user]);

  // Permission request screen
  if (foregroundPermission !== 'granted') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Live Map</Text>
        </View>
        <View style={styles.permissionContainer}>
          <View style={[styles.permissionCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="location" size={64} color={Colors.primary} />
            <Text style={[styles.permissionTitle, { color: colors.text }]}>
              Enable Location Sharing
            </Text>
            <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
              Share your location with household members so everyone knows where each other is.
            </Text>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleEnableLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.enableButtonText}>Enable Location</Text>
                </>
              )}
            </TouchableOpacity>
            {error && (
              <Text style={[styles.errorText, { color: Colors.status.error }]}>
                {error}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Background permission warning
  if (backgroundPermission !== 'granted' && foregroundPermission === 'granted') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Live Map</Text>
        </View>
        <View style={styles.permissionContainer}>
          <View style={[styles.permissionCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="location" size={64} color={Colors.status.warning} />
            <Text style={[styles.permissionTitle, { color: colors.text }]}>
              Background Access Needed
            </Text>
            <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
              To share your location even when the app is closed, please enable "Always" location access in settings.
            </Text>
            <TouchableOpacity
              style={[styles.enableButton, { backgroundColor: Colors.status.warning }]}
              onPress={() => Linking.openSettings()}
            >
              <Ionicons name="settings" size={20} color="#fff" />
              <Text style={styles.enableButtonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => user && startTracking(user.id)}
            >
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                Continue with limited tracking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (!initialRegion && isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Live Map</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Getting your location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // No location yet - prompt to start tracking
  if (!isTracking && !currentLocation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Live Map</Text>
        </View>
        <View style={styles.permissionContainer}>
          <View style={[styles.permissionCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="map" size={64} color={Colors.primary} />
            <Text style={[styles.permissionTitle, { color: colors.text }]}>
              Start Location Sharing
            </Text>
            <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
              Turn on location sharing to see where your household members are in real-time.
            </Text>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleToggleTracking}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="radio" size={20} color="#fff" />
                  <Text style={styles.enableButtonText}>Start Sharing</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Main map view
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Live Map</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[
              styles.trackingBadge,
              { backgroundColor: isTracking ? Colors.status.success + '20' : colors.surface },
            ]}
            onPress={handleToggleTracking}
          >
            <View
              style={[
                styles.trackingDot,
                { backgroundColor: isTracking ? Colors.status.success : colors.textSecondary },
              ]}
            />
            <Text
              style={[
                styles.trackingText,
                { color: isTracking ? Colors.status.success : colors.textSecondary },
              ]}
            >
              {isTracking ? 'Sharing' : 'Paused'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        {initialRegion && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass
            showsScale
            mapType="standard"
          >
            {/* Current user marker */}
            {currentLocation && user && (
              <MemberMarker
                userId={user.id}
                displayName={user.displayName}
                photoURL={user.photoURL}
                latitude={currentLocation.latitude}
                longitude={currentLocation.longitude}
                timestamp={currentLocation.timestamp}
                address={currentLocation.address}
                isCurrentUser
              />
            )}

            {/* Household member markers */}
            {householdLocations
              .filter((member) => member.userId !== user?.id)
              .map((member) => (
                <MemberMarker
                  key={member.userId}
                  userId={member.userId}
                  displayName={member.displayName}
                  photoURL={member.photoURL}
                  latitude={member.location.latitude}
                  longitude={member.location.longitude}
                  timestamp={member.location.timestamp}
                  address={member.location.address}
                />
              ))}
          </MapView>
        )}

        {/* Floating buttons */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: colors.surface }]}
            onPress={handleRefreshLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="refresh" size={22} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: colors.surface }]}
            onPress={handleCenterOnMe}
          >
            <Ionicons name="locate" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Member count badge */}
        {householdLocations.length > 0 && (
          <View style={[styles.memberCountBadge, { backgroundColor: colors.surface }]}>
            <Ionicons name="people" size={16} color={Colors.primary} />
            <Text style={[styles.memberCountText, { color: colors.text }]}>
              {householdLocations.length} {householdLocations.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
        )}
      </View>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: Colors.status.error }]}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trackingText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: FontSize.sm,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  floatingButtons: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xl,
    gap: Spacing.sm,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  memberCountBadge: {
    position: 'absolute',
    left: Spacing.lg,
    bottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  memberCountText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: FontSize.sm,
  },
  permissionContainer: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  permissionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  permissionTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: FontSize.md,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  enableButtonText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: FontSize.md,
  },
  skipButton: {
    paddingVertical: Spacing.md,
  },
  skipButtonText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: FontSize.sm,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: FontSize.md,
  },
  errorText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: FontSize.sm,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  errorBannerText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: FontSize.sm,
    flex: 1,
  },
});
