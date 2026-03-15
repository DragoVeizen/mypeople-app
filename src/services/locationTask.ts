import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const LOCATION_TASK_NAME = 'MYPEOPLE_BACKGROUND_LOCATION';

// Define the background task that runs every 5 minutes
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  if (!data) {
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };

  if (locations && locations.length > 0) {
    const latestLocation = locations[locations.length - 1];

    // Get current user ID from AsyncStorage (stored during login)
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const userId = await AsyncStorage.default.getItem('currentUserId');

      if (userId) {
        // Update Firestore with latest location
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          location: {
            latitude: latestLocation.coords.latitude,
            longitude: latestLocation.coords.longitude,
            timestamp: Date.now(),
          },
          updatedAt: Date.now(),
        });
      }
    } catch (updateError) {
      console.error('Failed to update location in Firestore:', updateError);
    }
  }
});
