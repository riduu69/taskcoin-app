import { AppState, User, Task } from '../types';

const STORAGE_KEY = 'taskcoin_data';

const DEFAULT_STATE: AppState = {
  users: [
    {
      id: 'admin-1',
      username: 'admin',
      email: 'admin69@taskcoin',
      coins: 1000,
      isAdmin: true,
      completedTasks: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-1',
      username: 'demo_user',
      email: 'user@example.com',
      coins: 50,
      isAdmin: false,
      completedTasks: [],
      createdAt: new Date().toISOString(),
    }
  ],
  tasks: [
    {
      id: 'task-1',
      creatorId: 'admin-1',
      creatorUsername: 'admin',
      type: 'youtube_subscribe',
      link: 'https://youtube.com/@google',
      reward: 5,
      requiredCount: 100,
      completedCount: 10,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      creatorId: 'admin-1',
      creatorUsername: 'admin',
      type: 'instagram_follow',
      link: 'https://instagram.com/google',
      reward: 3,
      requiredCount: 50,
      completedCount: 5,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
  ],
  topUpRequests: [],
  currentUser: null,
};

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    saveState(DEFAULT_STATE);
    return DEFAULT_STATE;
  }
  try {
    const parsed = JSON.parse(saved);
    
    // Ensure the admin user exists and has the correct email/isAdmin status
    const adminEmail = 'admin69@taskcoin';
    let users = parsed.users || DEFAULT_STATE.users;
    
    const adminExists = users.some((u: any) => u.email === adminEmail);
    if (!adminExists) {
      users = [DEFAULT_STATE.users[0], ...users.filter((u: any) => u.id !== 'admin-1')];
    }

    return {
      ...DEFAULT_STATE,
      ...parsed,
      users,
      tasks: parsed.tasks || DEFAULT_STATE.tasks,
      topUpRequests: parsed.topUpRequests || [],
    };
  } catch (e) {
    console.error('Failed to parse state', e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getTaskLabel = (type: string) => {
  switch (type) {
    case 'facebook_like': return 'Facebook Like';
    case 'instagram_follow': return 'Instagram Follow';
    case 'youtube_subscribe': return 'YouTube Subscribe';
    case 'tiktok_follow': return 'TikTok Follow';
    default: return type;
  }
};
