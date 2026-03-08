export type TaskType = 'facebook_like' | 'instagram_follow' | 'youtube_subscribe' | 'tiktok_follow';

export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  isAdmin: boolean;
  completedTasks: string[]; // IDs of tasks completed
  createdAt: string;
}

export interface Task {
  id: string;
  creatorId: string;
  creatorUsername: string;
  type: TaskType;
  link: string;
  reward: number;
  requiredCount: number;
  completedCount: number;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
}

export interface TopUpRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AppState {
  users: User[];
  tasks: Task[];
  topUpRequests: TopUpRequest[];
  currentUser: User | null;
}
