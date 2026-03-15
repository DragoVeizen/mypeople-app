import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { doc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase';
import { LOCATION_TASK_NAME } from './locationTask';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  address?: string;
}

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * Request both foreground and background location permissions
 */
export async function requestLocationPermissions(): Promise<{
  foreground: PermissionStatus;
  background: PermissionStatus;
}> {
  // First request foreground permission
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

  if (foregroundStatus !== 'granted') {
    return {
      foreground: foregroundStatus as PermissionStatus,
      background: 'denied',
    };
  }

  // Then request background permission
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

  return {
    foreground: foregroundStatus as PermissionStatus,
    background: backgroundStatus as PermissionStatus,
  };
}

/**
 * Check current permission status
 */
export async function getLocationPermissionStatus(): Promise<{
  foreground: PermissionStatus;
  background: PermissionStatus;
}> {
  const foreground = await Location.getForegroundPermissionsAsync();
  const background = await Location.getBackgroundPermissionsAsync();

  return {
    foreground: foreground.status as PermissionStatus,
    background: background.status as PermissionStatus,
  };
}

/**
 * Get current location once
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
}

/**
 * Start background location tracking (every 5 minutes)
 */
export async function startBackgroundTracking(userId: string): Promise<boolean> {
  try {
    // Store user ID for background task
    await AsyncStorage.setItem('currentUserId', userId);

    // Check if already tracking
    const isTracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isTracking) {
      return true;
    }

    // Check background permission
    const { status } = await Location.getBackgroundPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 300000, // 5 minutes
      distanceInterval: 100, // or 100 meters movement
      deferredUpdatesInterval: 300000, // 5 minutes
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'MyPeople',
        notificationBody: 'Sharing your location with household',
        notificationColor: '#4ECDC4',
      },
    });

    return true;
  } catch (error) {
    console.error('Error starting background tracking:', error);
    return false;
  }
}

/**
 * Stop background location tracking
 */
export async function stopBackgroundTracking(): Promise<void> {
  try {
    const isTracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
    await AsyncStorage.removeItem('currentUserId');
  } catch (error) {
    console.error('Error stopping background tracking:', error);
  }
}

/**
 * Check if background tracking is currently active
 */
export async function isBackgroundTrackingActive(): Promise<boolean> {
  try {
    return await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  } catch {
    return false;
  }
}

/**
 * Update user location in Firestore
 */
export async function updateUserLocation(
  userId: string,
  location: LocationData
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
        address: location.address,
      },
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (results && results.length > 0) {
      const address = results[0];
      const parts = [
        address.street,
        address.city,
        address.region,
      ].filter(Boolean);

      return parts.join(', ') || null;
    }

    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}
