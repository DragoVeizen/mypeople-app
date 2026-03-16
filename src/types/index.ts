export type DinnerStatus = 'cooking' | 'ordering' | 'outTonight' | 'unknown';

export type ErrandPriority = 'low' | 'medium' | 'high';
export type ErrandStatus = 'pending' | 'inProgress' | 'completed';

export type ChoreFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  householdId?: string;
  role: 'admin' | 'member';
  dinnerStatus: DinnerStatus;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: number;
    address?: string;
  };
  fcmToken?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Household {
  id: string;
  name: string;
  inviteCode: string;
  members: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Errand {
  id: string;
  title: string;
  description?: string;
  householdId: string;
  assignedTo?: string;
  createdBy: string;
  priority: ErrandPriority;
  status: ErrandStatus;
  dueDate?: number;
  completedAt?: number;
  completedBy?: string;
  isRecurring: boolean;
  recurringFrequency?: ChoreFrequency;
  expense?: {
    amount: number;
    category: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  householdId: string;
  assignedTo: string;
  frequency: ChoreFrequency;
  lastCompleted?: number;
  nextDue: number;
  createdAt: number;
  updatedAt: number;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  householdId: string;
  uploadedBy: string;
  location?: string;
  likes: string[];
  comments: PhotoComment[];
  createdAt: number;
}

export interface PhotoComment {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  type: 'errand' | 'chore' | 'photo' | 'location' | 'dinner';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: number;
}
