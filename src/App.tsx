import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './lib/firebase';
import { AppState, User, Task, TopUpRequest, WithdrawRequest, TaskSubmission } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Earn from './pages/Earn';
import CreateTask from './pages/CreateTask';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import TopUp from './pages/TopUp';
import Withdraw from './pages/Withdraw';
import { sendTelegramNotification } from './utils/telegram';
import { AlertTriangle, Settings } from 'lucide-react';
import { getTaskLabel } from './utils/storage';

interface AppContextType {
  state: AppState;
  logout: () => void;
  addTask: (task: any) => Promise<void>;
  submitProof: (submission: any) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  requestTopUp: (data: any) => Promise<void>;
  requestWithdraw: (data: any) => Promise<void>;
  manageTopUp: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
  manageSubmission: (submissionId: string, status: 'approved' | 'rejected') => Promise<void>;
  manageWithdraw: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default function App() {
  const [state, setState] = useState<AppState>({
    users: [],
    tasks: [],
    topUpRequests: [],
    withdrawRequests: [],
    taskSubmissions: [],
    currentUser: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setState(prev => ({ ...prev, currentUser: userDoc.data() as User }));
        }
      } else {
        setState(prev => ({ ...prev, currentUser: null }));
      }
      setLoading(false);
    });

    const unsubscribeTasks = onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setState(prev => ({ ...prev, tasks }));
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setState(prev => ({ ...prev, users }));
    });

    const unsubscribeTopUps = onSnapshot(query(collection(db, 'topup'), orderBy('createdAt', 'desc')), (snapshot) => {
      const topUpRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TopUpRequest));
      setState(prev => ({ ...prev, topUpRequests }));
    });

    const unsubscribeWithdraws = onSnapshot(query(collection(db, 'withdraw'), orderBy('createdAt', 'desc')), (snapshot) => {
      const withdrawRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawRequest));
      setState(prev => ({ ...prev, withdrawRequests }));
    });

    const unsubscribeSubmissions = onSnapshot(query(collection(db, 'taskSubmissions'), orderBy('createdAt', 'desc')), (snapshot) => {
      const taskSubmissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaskSubmission));
      setState(prev => ({ ...prev, taskSubmissions }));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeTasks();
      unsubscribeUsers();
      unsubscribeTopUps();
      unsubscribeWithdraws();
      unsubscribeSubmissions();
    };
  }, []);

  const logout = () => signOut(auth);

  const addTask = async (taskData: any) => {
    if (!state.currentUser) return;
    const cost = taskData.reward * taskData.requiredCount;
    if (state.currentUser.coins < cost) throw new Error('Insufficient coins');

    const newTask = {
      ...taskData,
      creatorId: state.currentUser.id,
      creatorUsername: state.currentUser.username,
      completedCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, 'tasks'), newTask);
    await updateDoc(doc(db, 'users', state.currentUser.id), {
      coins: state.currentUser.coins - cost
    });
    
    await sendTelegramNotification(`🆕 <b>New Task Created</b>\nUser: ${state.currentUser.username}\nType: ${taskData.type}\nReward: ${taskData.reward}`);
  };

  const submitProof = async (submissionData: any) => {
    if (!state.currentUser) return;
    const newSubmission = {
      ...submissionData,
      userId: state.currentUser.id,
      username: state.currentUser.username,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'taskSubmissions'), newSubmission);
    
    const taskLabel = getTaskLabel(submissionData.taskType);
    await sendTelegramNotification(`📸 <b>New Task Proof Submitted</b>\nUser: ${state.currentUser.username}\nEmail: ${state.currentUser.email}\nTask: ${taskLabel}\nProof: ${submissionData.screenshotUrl}`);
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const requestTopUp = async (data: any) => {
    if (!state.currentUser) return;
    const newRequest = {
      ...data,
      userId: state.currentUser.id,
      username: state.currentUser.username,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'topup'), newRequest);
    await sendTelegramNotification(`💰 <b>New Top-up Request</b>\nUser: ${state.currentUser.username}\nAmount: ${data.amount}\nMethod: ${data.method}\nTxID: ${data.transactionId}`);
  };

  const requestWithdraw = async (data: any) => {
    if (!state.currentUser) return;
    if (state.currentUser.coins < data.amount) throw new Error('Insufficient coins');

    const newRequest = {
      ...data,
      userId: state.currentUser.id,
      username: state.currentUser.username,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'withdraw'), newRequest);
    await updateDoc(doc(db, 'users', state.currentUser.id), {
      coins: state.currentUser.coins - data.amount
    });
    await sendTelegramNotification(`💸 <b>New Withdraw Request</b>\nUser: ${state.currentUser.username}\nAmount: ${data.amount}\nMethod: ${data.method}\nAccount: ${data.accountNumber}`);
  };

  const manageTopUp = async (requestId: string, status: 'approved' | 'rejected') => {
    const request = state.topUpRequests.find(r => r.id === requestId);
    if (!request) return;

    await updateDoc(doc(db, 'topup', requestId), { status });
    if (status === 'approved') {
      const userRef = doc(db, 'users', request.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          coins: (userDoc.data().coins || 0) + request.amount
        });
      }
    }
  };

  const manageSubmission = async (submissionId: string, status: 'approved' | 'rejected') => {
    const submission = state.taskSubmissions.find(s => s.id === submissionId);
    if (!submission) return;

    await updateDoc(doc(db, 'taskSubmissions', submissionId), { status });
    if (status === 'approved') {
      const userRef = doc(db, 'users', submission.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await updateDoc(userRef, {
          coins: (userData.coins || 0) + submission.reward,
          completedTasks: [...(userData.completedTasks || []), submission.taskId]
        });
      }
      
      const taskRef = doc(db, 'tasks', submission.taskId);
      const taskDoc = await getDoc(taskRef);
      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const newCount = (taskData.completedCount || 0) + 1;
        await updateDoc(taskRef, {
          completedCount: newCount,
          status: newCount >= taskData.requiredCount ? 'completed' : 'active'
        });
      }
    }
  };

  const manageWithdraw = async (requestId: string, status: 'approved' | 'rejected') => {
    const request = state.withdrawRequests.find(r => r.id === requestId);
    if (!request) return;

    await updateDoc(doc(db, 'withdraw', requestId), { status });
    if (status === 'rejected') {
      const userRef = doc(db, 'users', request.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          coins: (userDoc.data().coins || 0) + request.amount
        });
      }
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-orange-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Setup Required</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Firebase configuration is missing or invalid. Please add your Firebase API keys in the 
              <span className="text-orange-500 font-bold"> Settings</span> menu to start using TaskCoin.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-left space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Required Variables:</p>
            <ul className="text-xs text-zinc-400 space-y-1 font-mono">
              <li>• VITE_FIREBASE_API_KEY</li>
              <li>• VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>• VITE_FIREBASE_PROJECT_ID</li>
            </ul>
          </div>
          <p className="text-[10px] text-zinc-600 italic">
            Check the setup instructions in the chat for more details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ 
      state, logout, addTask, submitProof, deleteTask, requestTopUp, requestWithdraw, manageTopUp, manageSubmission, manageWithdraw 
    }}>
      <Router>
        <Routes>
          <Route path="/login" element={state.currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={state.currentUser ? <Navigate to="/" /> : <Register />} />
          
          <Route element={<ProtectedRoute user={state.currentUser} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/topup" element={<TopUp />} />
              <Route path="/withdraw" element={<Withdraw />} />
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

function AdminRoute({ user, children }: { user, children: React.ReactNode }) {
  if (!user?.isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}
