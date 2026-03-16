import { create } from 'zustand';
import { Unsubscribe } from 'firebase/firestore';
import { User, Household, Errand, DinnerStatus } from '../types';
import {
  createHousehold,
  joinHousehold,
  getHousehold,
  subscribeToHousehold,
  subscribeToHouseholdMembers,
  subscribeToErrands,
  updateDinnerStatus,
  createErrand,
  updateErrand,
  deleteErrand,
} from '../services/household';

interface HouseholdState {
  household: Household | null;
  members: User[];
  errands: Errand[];
  isLoading: boolean;
  error: string | null;

  // Subscriptions
  unsubscribeHousehold: Unsubscribe | null;
  unsubscribeMembers: Unsubscribe | null;
  unsubscribeErrands: Unsubscribe | null;

  // Actions
  createNewHousehold: (name: string, userId: string) => Promise<string>;
  joinExistingHousehold: (inviteCode: string, userId: string) => Promise<boolean>;
  subscribeToAll: (householdId: string) => void;
  unsubscribeAll: () => void;
  updateMyDinnerStatus: (userId: string, status: DinnerStatus) => Promise<void>;
  addErrand: (errand: Omit<Errand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  editErrand: (errandId: string, updates: Partial<Errand>) => Promise<void>;
  removeErrand: (errandId: string) => Promise<void>;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useHouseholdStore = create<HouseholdState>((set, get) => ({
  household: null,
  members: [],
  errands: [],
  isLoading: false,
  error: null,
  unsubscribeHousehold: null,
  unsubscribeMembers: null,
  unsubscribeErrands: null,

  createNewHousehold: async (name, userId) => {
    set({ isLoading: true, error: null });
    try {
      const householdId = await createHousehold(name, userId);
      set({ isLoading: false });
      return householdId;
    } catch (error) {
      set({ error: 'Failed to create household', isLoading: false });
      throw error;
    }
  },

  joinExistingHousehold: async (inviteCode, userId) => {
    set({ isLoading: true, error: null });
    try {
      const householdId = await joinHousehold(inviteCode, userId);
      if (householdId) {
        set({ isLoading: false });
        return true;
      } else {
        set({ error: 'Invalid invite code', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: 'Failed to join household', isLoading: false });
      return false;
    }
  },

  subscribeToAll: (householdId) => {
    // Unsubscribe from any existing subscriptions
    get().unsubscribeAll();

    // Subscribe to household
    const unsubHousehold = subscribeToHousehold(householdId, (household) => {
      set({ household });
    });

    // Subscribe to members
    const unsubMembers = subscribeToHouseholdMembers(householdId, (members) => {
      set({ members });
    });

    // Subscribe to errands
    const unsubErrands = subscribeToErrands(householdId, (errands) => {
      set({ errands });
    });

    set({
      unsubscribeHousehold: unsubHousehold,
      unsubscribeMembers: unsubMembers,
      unsubscribeErrands: unsubErrands,
    });
  },

  unsubscribeAll: () => {
    const { unsubscribeHousehold, unsubscribeMembers, unsubscribeErrands } = get();
    if (unsubscribeHousehold) unsubscribeHousehold();
    if (unsubscribeMembers) unsubscribeMembers();
    if (unsubscribeErrands) unsubscribeErrands();
    set({
      unsubscribeHousehold: null,
      unsubscribeMembers: null,
      unsubscribeErrands: null,
    });
  },

  updateMyDinnerStatus: async (userId, status) => {
    try {
      await updateDinnerStatus(userId, status);
    } catch (error) {
      set({ error: 'Failed to update dinner status' });
    }
  },

  addErrand: async (errand) => {
    const { household } = get();
    if (!household) return null;

    try {
      const errandId = await createErrand(household.id, errand);
      return errandId;
    } catch (error) {
      set({ error: 'Failed to create errand' });
      return null;
    }
  },

  editErrand: async (errandId, updates) => {
    const { household } = get();
    if (!household) return;

    try {
      await updateErrand(household.id, errandId, updates);
    } catch (error) {
      set({ error: 'Failed to update errand' });
    }
  },

  removeErrand: async (errandId) => {
    const { household } = get();
    if (!household) return;

    try {
      await deleteErrand(household.id, errandId);
    } catch (error) {
      set({ error: 'Failed to delete errand' });
    }
  },

  setError: (error) => set({ error }),

  reset: () => {
    get().unsubscribeAll();
    set({
      household: null,
      members: [],
      errands: [],
      isLoading: false,
      error: null,
    });
  },
}));
