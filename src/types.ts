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

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  username: string;
  taskType: TaskType;
  screenshotUrl: string;
  reward: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface TopUpRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: 'bKash' | 'Nagad';
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: 'bKash' | 'Nagad';
  accountNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AppState {
  users: User[];
  tasks: Task[];
  topUpRequests: TopUpRequest[];
  withdrawRequests: WithdrawRequest[];
  taskSubmissions: TaskSubmission[];
  currentUser: User | null;
}
