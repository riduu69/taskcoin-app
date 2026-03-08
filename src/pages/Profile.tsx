import React from 'react';
import { useApp } from '../App';
import { Coins, Mail, Calendar, Settings, LogOut, ShieldCheck, History, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getTaskLabel } from '../utils/storage';

export default function Profile() {
  const { state, logout } = useApp();
  const user = state.currentUser!;

  const userTasks = (state.tasks || []).filter(t => t.creatorId === user.id);
  const completedCount = user.completedTasks.length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-center gap-6 p-8 glass rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-transparent -z-10" />
        
        <div className="w-24 h-24 rounded-3xl coin-gradient flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-orange-500/20">
          {user.username[0].toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-3xl font-black tracking-tight">{user.username}</h2>
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-zinc-500 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button className="p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-all border border-white/5">
              <Settings className="w-6 h-6 text-zinc-400" />
            </button>
            <button 
              onClick={logout}
              className="p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20 group"
            >
              <LogOut className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            My Created Tasks
          </h3>
          
          <div className="space-y-4">
            {userTasks.length === 0 ? (
              <div className="p-8 text-center glass rounded-3xl border border-white/5 text-zinc-500">
                You haven't created any tasks yet.
              </div>
            ) : (
              userTasks.map(task => (
                <div key={task.id} className="glass p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl">
                        {task.type === 'youtube_subscribe' ? '🎬' : task.type === 'instagram_follow' ? '📸' : task.type === 'facebook_like' ? '👍' : '🎵'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{getTaskLabel(task.type)}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{task.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Progress</p>
                      <p className="font-black text-orange-500">{task.completedCount} / {task.requiredCount}</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-500" 
                      style={{ width: `${(task.completedCount / task.requiredCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Stats & Achievement
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl border border-white/5 text-center space-y-2">
              <p className="text-3xl font-black text-orange-500">{user.coins}</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Current Balance</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 text-center space-y-2">
              <p className="text-3xl font-black text-emerald-500">{completedCount}</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tasks Completed</p>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
            <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Level Progress</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black">Level 1</p>
                  <p className="text-sm text-zinc-500">Novice Earner</p>
                </div>
                <p className="text-sm font-bold text-zinc-400">{completedCount} / 50 tasks</p>
              </div>
              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500" 
                  style={{ width: `${Math.min((completedCount / 50) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 italic">Complete 50 tasks to unlock Level 2 and higher reward tasks.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
