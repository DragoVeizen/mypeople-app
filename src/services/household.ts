import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Household, Errand, DinnerStatus } from '../types';

// ============ Household Operations ============

export async function createHousehold(
  name: string,
  userId: string
): Promise<string> {
  const householdRef = doc(collection(db, 'households'));
  const inviteCode = generateInviteCode();

  const household: Omit<Household, 'id'> = {
    name,
    members: [userId],
    inviteCode,
    createdBy: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(householdRef, household);

  // Update user with householdId
  await updateDoc(doc(db, 'users', userId), {
    householdId: householdRef.id,
    role: 'admin',
    updatedAt: Date.now(),
  });

  return householdRef.id;
}

export async function joinHousehold(
  inviteCode: string,
  userId: string
): Promise<string | null> {
  // Find household by invite code
  const q = query(
    collection(db, 'households'),
    where('inviteCode', '==', inviteCode.toUpperCase())
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const householdDoc = snapshot.docs[0];
  const householdId = householdDoc.id;

  // Add user to household members
  await updateDoc(doc(db, 'households', householdId), {
    members: arrayUnion(userId),
    updatedAt: Date.now(),
  });

  // Update user with householdId
  await updateDoc(doc(db, 'users', userId), {
    householdId,
    role: 'member',
    updatedAt: Date.now(),
  });

  return householdId;
}

export async function getHousehold(householdId: string): Promise<Household | null> {
  const docSnap = await getDoc(doc(db, 'households', householdId));
  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Household;
}

export function subscribeToHousehold(
  householdId: string,
  callback: (household: Household | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'households', householdId), (docSnap) => {
    if (docSnap.exists()) {
      callback({
        id: docSnap.id,
        ...docSnap.data(),
      } as Household);
    } else {
      callback(null);
    }
  });
}

// ============ Household Members Operations ============

export function subscribeToHouseholdMembers(
  householdId: string,
  callback: (members: User[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'users'),
    where('householdId', '==', householdId)
  );

  return onSnapshot(q, (snapshot) => {
    const members: User[] = [];
    snapshot.forEach((doc) => {
      members.push({
        id: doc.id,
        ...doc.data(),
      } as User);
    });
    callback(members);
  });
}

// ============ Dinner Status Operations ============

export async function updateDinnerStatus(
  userId: string,
  status: DinnerStatus
): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    dinnerStatus: status,
    updatedAt: Date.now(),
  });
}

// ============ Errands Operations ============

export async function createErrand(
  householdId: string,
  errand: Omit<Errand, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const errandRef = doc(collection(db, 'households', householdId, 'errands'));

  await setDoc(errandRef, {
    ...errand,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return errandRef.id;
}

export async function updateErrand(
  householdId: string,
  errandId: string,
  updates: Partial<Errand>
): Promise<void> {
  await updateDoc(doc(db, 'households', householdId, 'errands', errandId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteErrand(
  householdId: string,
  errandId: string
): Promise<void> {
  await deleteDoc(doc(db, 'households', householdId, 'errands', errandId));
}

export function subscribeToErrands(
  householdId: string,
  callback: (errands: Errand[]) => void
): Unsubscribe {
  const q = query(collection(db, 'households', householdId, 'errands'));

  return onSnapshot(q, (snapshot) => {
    const errands: Errand[] = [];
    snapshot.forEach((doc) => {
      errands.push({
        id: doc.id,
        ...doc.data(),
      } as Errand);
    });
    // Sort by due date
    errands.sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));
    callback(errands);
  });
}

// ============ Helper Functions ============

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function regenerateInviteCode(householdId: string): Promise<string> {
  const newCode = generateInviteCode();
  await updateDoc(doc(db, 'households', householdId), {
    inviteCode: newCode,
    updatedAt: Date.now(),
  });
  return newCode;
}
