import React, { useState } from 'react';
import { useApp } from '../App';
import { Users, ListTodo, ShieldCheck, Trash2, UserPlus, Search, MoreVertical, CheckCircle2, XCircle, Coins, Clock, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { getTaskLabel } from '../utils/storage';

export default function Admin() {
  const { state, deleteTask, updateUser, manageTopUp } = useApp();
  const [tab, setTab] = useState<'users' | 'tasks' | 'topups'>('users');
  const [search, setSearch] = useState('');

  const filteredUsers = (state.users || []).filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTasks = (state.tasks || []).filter(t => 
    t.creatorUsername.toLowerCase().includes(search.toLowerCase()) || 
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests = (state.topUpRequests || []).filter(r => 
    r.username.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
            Admin Control
          </h2>
          <p className="text-zinc-500 mt-1">Manage users, tasks, and platform health.</p>
        </div>

        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setTab('users')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'users' ? 'bg-white text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setTab('tasks')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'tasks' ? 'bg-white text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setTab('topups')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'topups' ? 'bg-white text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Top Ups
          </button>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder={`Search ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
        />
      </div>

      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                {tab === 'users' ? (
                  <>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Coins</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Tasks</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Role</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                ) : tab === 'tasks' ? (
                  <>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Task</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Creator</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Progress</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Amount</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Date</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tab === 'users' ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold">{user.username}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-orange-500">{user.coins}</td>
                    <td className="px-6 py-5 text-zinc-400 font-medium">{user.completedTasks.length}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        user.isAdmin ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => updateUser(user.id, { isAdmin: !user.isAdmin })}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-all text-zinc-400"
                        title="Toggle Admin"
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : tab === 'tasks' ? (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                          {task.type === 'youtube_subscribe' ? '🎬' : task.type === 'instagram_follow' ? '📸' : task.type === 'facebook_like' ? '👍' : '🎵'}
                        </div>
                        <div>
                          <p className="font-bold">{getTaskLabel(task.type)}</p>
                          <a href={task.link} target="_blank" rel="noreferrer" className="text-[10px] text-orange-500 hover:underline truncate max-w-[150px] block">
                            {task.link}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-zinc-400">{task.creatorUsername}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500" 
                            style={{ width: `${(task.completedCount / task.requiredCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{task.completedCount}/{task.requiredCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        task.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-red-400"
                        title="Delete Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 font-bold">{req.username}</td>
                    <td className="px-6 py-5 font-black text-orange-500">{req.amount}</td>
                    <td className="px-6 py-5 text-zinc-400 text-xs">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                        req.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => manageTopUp(req.id, 'approved')}
                            className="p-2 hover:bg-emerald-500/10 rounded-lg transition-all text-emerald-500"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => manageTopUp(req.id, 'rejected')}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-red-400"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
