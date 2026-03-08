import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AppState, User, Task, TopUpRequest } from './types';
import { loadState, saveState } from './utils/storage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Earn from './pages/Earn';
import CreateTask from './pages/CreateTask';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import TopUp from './pages/TopUp';

interface AppContextType {
  state: AppState;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  updateCoins: (amount: number) => void;
  addTask: (task: Omit<Task, 'id' | 'creatorId' | 'creatorUsername' | 'completedCount' | 'status' | 'createdAt'>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  requestTopUp: (amount: number) => void;
  manageTopUp: (requestId: string, status: 'approved' | 'rejected') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default function App() {
  const [state, setState] = useState<AppState>(loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const login = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const register = (user: User) => {
    setState(prev => ({ 
      ...prev, 
      users: [...prev.users, user],
      currentUser: user 
    }));
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const updateCoins = (amount: number) => {
    if (!state.currentUser) return;
    const updatedUser = { ...state.currentUser, coins: state.currentUser.coins + amount };
    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const addTask = (taskData: any) => {
    if (!state.currentUser) return;
    
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      creatorId: state.currentUser.id,
      creatorUsername: state.currentUser.username,
      completedCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const cost = newTask.reward * newTask.requiredCount;
    if (state.currentUser.coins < cost) return;

    const updatedUser = { ...state.currentUser, coins: state.currentUser.coins - cost };

    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const completeTask = (taskId: string) => {
    if (!state.currentUser) return;
    
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || state.currentUser.completedTasks.includes(taskId)) return;

    const updatedUser = {
      ...state.currentUser,
      coins: state.currentUser.coins + task.reward,
      completedTasks: [...state.currentUser.completedTasks, taskId]
    };

    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId 
          ? { ...t, completedCount: t.completedCount + 1, status: t.completedCount + 1 >= t.requiredCount ? 'completed' : 'active' } 
          : t
      ),
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u),
      currentUser: prev.currentUser?.id === userId ? { ...prev.currentUser, ...updates } : prev.currentUser
    }));
  };

  const requestTopUp = (amount: number) => {
    if (!state.currentUser) return;
    const newRequest: TopUpRequest = {
      id: `req-${Date.now()}`,
      userId: state.currentUser.id,
      username: state.currentUser.username,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      topUpRequests: [newRequest, ...prev.topUpRequests]
    }));
  };

  const manageTopUp = (requestId: string, status: 'approved' | 'rejected') => {
    const request = state.topUpRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return;

    setState(prev => {
      const updatedRequests = prev.topUpRequests.map(r => 
        r.id === requestId ? { ...r, status } : r
      );

      let updatedUsers = prev.users;
      let updatedCurrentUser = prev.currentUser;

      if (status === 'approved') {
        updatedUsers = prev.users.map(u => 
          u.id === request.userId ? { ...u, coins: u.coins + request.amount } : u
        );
        if (prev.currentUser?.id === request.userId) {
          updatedCurrentUser = { ...prev.currentUser, coins: prev.currentUser.coins + request.amount };
        }
      }

      return {
        ...prev,
        topUpRequests: updatedRequests,
        users: updatedUsers,
        currentUser: updatedCurrentUser
      };
    });
  };

  return (
    <AppContext.Provider value={{ state, login, register, logout, updateCoins, addTask, completeTask, deleteTask, updateUser, requestTopUp, manageTopUp }}>
      <Router>
        <Routes>
          <Route path="/login" element={state.currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={state.currentUser ? <Navigate to="/" /> : <Register />} />
          
          <Route element={<ProtectedRoute user={state.currentUser} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/topup" element={<TopUp />} />
              <Route path="/create" element={<CreateTask />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminRoute user={state.currentUser}><Admin /></AdminRoute>} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

function ProtectedRoute({ user }: { user: User | null }) {
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}

function AdminRoute({ user, children }: { user: User | null, children: React.ReactNode }) {
  if (!user?.isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}
