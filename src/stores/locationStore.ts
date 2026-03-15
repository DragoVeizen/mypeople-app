import { create } from 'zustand';
import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  LocationData,
  PermissionStatus,
  requestLocationPermissions,
  getLocationPermissionStatus,
  getCurrentLocation,
  startBackgroundTracking,
  stopBackgroundTracking,
  isBackgroundTrackingActive,
  updateUserLocation,
  reverseGeocode,
} from '../services/location';
import { User } from '../types';

interface MemberLocation {
  userId: string;
  displayName: string;
  photoURL?: string;
  location: LocationData;
}

interface LocationState {
  currentLocation: LocationData | null;
  householdLocations: MemberLocation[];
  isTracking: boolean;
  foregroundPermission: PermissionStatus;
  backgroundPermission: PermissionStatus;
  error: string | null;
  isLoading: boolean;

  // Actions
  requestPermissions: () => Promise<boolean>;
  checkPermissions: () => Promise<void>;
  fetchCurrentLocation: () => Promise<void>;
  startTracking: (userId: string) => Promise<boolean>;
  stopTracking: () => Promise<void>;
  subscribeToHousehold: (householdId: string) => Unsubscribe;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  householdLocations: [],
  isTracking: false,
  foregroundPermission: 'undetermined',
  backgroundPermission: 'undetermined',
  error: null,
  isLoading: false,

  requestPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await requestLocationPermissions();
      set({
        foregroundPermission: result.foreground,
        backgroundPermission: result.background,
        isLoading: false,
      });
      return result.foreground === 'granted' && result.background === 'granted';
    } catch (error) {
      set({
        error: 'Failed to request location permissions',
        isLoading: false,
      });
      return false;
    }
  },

  checkPermissions: async () => {
    try {
      const status = await getLocationPermissionStatus();
      const isTracking = await isBackgroundTrackingActive();
      set({
        foregroundPermission: status.foreground,
        backgroundPermission: status.background,
        isTracking,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  },

  fetchCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const location = await getCurrentLocation();
      if (location) {
        set({ currentLocation: location, isLoading: false });
      } else {
        set({ error: 'Unable to get location', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch location', isLoading: false });
    }
  },

  startTracking: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get current location first
      const location = await getCurrentLocation();
      if (location) {
        // Get address for current location
        const address = await reverseGeocode(location.latitude, location.longitude);
        const locationWithAddress = { ...location, address: address || undefined };

        // Update Firestore immediately
        await updateUserLocation(userId, locationWithAddress);
        set({ currentLocation: locationWithAddress });
      }

      // Start background tracking
      const success = await startBackgroundTracking(userId);
      if (success) {
        set({ isTracking: true, isLoading: false });
        return true;
      } else {
        set({
          error: 'Background location permission required',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to start tracking', isLoading: false });
      return false;
    }
  },

  stopTracking: async () => {
    try {
      await stopBackgroundTracking();
      set({ isTracking: false });
    } catch (error) {
      console.error('Error stopping tracking:', error);
    }
  },

  subscribeToHousehold: (householdId: string) => {
    const q = query(
      collection(db, 'users'),
      where('householdId', '==', householdId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members: MemberLocation[] = [];

        snapshot.forEach((doc) => {
          const user = doc.data() as User;
          if (user.location) {
            members.push({
              userId: user.id,
              displayName: user.displayName,
              photoURL: user.photoURL,
              location: user.location,
            });
          }
        });

        set({ householdLocations: members });
      },
      (error) => {
        console.error('Error subscribing to household locations:', error);
        set({ error: 'Failed to load household locations' });
      }
    );

    return unsubscribe;
  },

  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentLocation: null,
      householdLocations: [],
      isTracking: false,
      error: null,
      isLoading: false,
    }),
}));
