import React, { useState } from 'react';
import { useApp } from '../App';
import { Users, ListTodo, ShieldCheck, Trash2, Search, Check, X, Coins, Wallet, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTaskLabel } from '../utils/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Admin() {
  const { state, deleteTask, manageTopUp, manageSubmission, manageWithdraw } = useApp();
  const [tab, setTab] = useState<'users' | 'tasks' | 'topups' | 'submissions' | 'withdrawals'>('submissions');
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredUsers = (state.users || []).filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTasks = (state.tasks || []).filter(t => 
    t.creatorUsername.toLowerCase().includes(search.toLowerCase()) || 
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTopUps = (state.topUpRequests || []).filter(r => 
    r.username.toLowerCase().includes(search.toLowerCase()) ||
    r.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubmissions = (state.taskSubmissions || []).filter(s => 
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.status.toLowerCase().includes(search.toLowerCase())
  );

  const filteredWithdrawals = (state.withdrawRequests || []).filter(w => 
    w.username.toLowerCase().includes(search.toLowerCase()) ||
    w.accountNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'users', userId), { isAdmin: !currentStatus });
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <img src={selectedImage} alt="Proof" className="max-w-full max-h-full rounded-2xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
              Admin Control
            </h2>
            <p className="text-zinc-500 mt-1">Manage users, tasks, and platform health.</p>
          </div>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'submissions', label: 'Proofs', icon: ImageIcon },
            { id: 'topups', label: 'Top Ups', icon: Coins },
            { id: 'withdrawals', label: 'Withdraws', icon: Wallet },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: ListTodo },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
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
                {tab === 'submissions' && (
                  <>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Task</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Proof</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                )}
                {tab === 'topups' && (
                  <>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Method/TxID</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                )}
                {tab === 'withdrawals' && (
                  <>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Account</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                )}
                {tab === 'users' && (
                  <>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Coins</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Role</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                )}
                {tab === 'tasks' && (
                  <>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Task</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Creator</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Progress</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tab === 'submissions' && filteredSubmissions.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 font-bold text-sm">{s.username}</td>
                  <td className="px-6 py-5 text-xs text-zinc-400">{getTaskLabel(s.taskType)}</td>
                  <td className="px-6 py-5">
                    <button onClick={() => setSelectedImage(s.screenshotUrl)} className="text-orange-500 hover:underline text-xs font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> View Proof
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      s.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                      s.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {s.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => manageSubmission(s.id, 'approved')} className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500"><Check className="w-5 h-5" /></button>
                        <button onClick={() => manageSubmission(s.id, 'rejected')} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {tab === 'topups' && filteredTopUps.map(r => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 font-bold text-sm">{r.username}</td>
                  <td className="px-6 py-5 font-black text-orange-500">{r.amount}</td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold">{r.method}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{r.transactionId}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                      r.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {r.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => manageTopUp(r.id, 'approved')} className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500"><Check className="w-5 h-5" /></button>
                        <button onClick={() => manageTopUp(r.id, 'rejected')} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {tab === 'withdrawals' && filteredWithdrawals.map(w => (
                <tr key={w.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 font-bold text-sm">{w.username}</td>
                  <td className="px-6 py-5 font-black text-orange-500">{w.amount}</td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold">{w.method}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{w.accountNumber}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                      w.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {w.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => manageWithdraw(w.id, 'approved')} className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500"><Check className="w-5 h-5" /></button>
                        <button onClick={() => manageWithdraw(w.id, 'rejected')} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {tab === 'users' && filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-sm">{u.username}</p>
                    <p className="text-[10px] text-zinc-500">{u.email}</p>
                  </td>
                  <td className="px-6 py-5 font-black text-orange-500">{u.coins}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      u.isAdmin ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => toggleAdmin(u.id, u.isAdmin)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400"><ShieldCheck className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
              {tab === 'tasks' && filteredTasks.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-sm">{getTaskLabel(t.type)}</p>
                    <a href={t.link} target="_blank" rel="noreferrer" className="text-[10px] text-orange-500 hover:underline flex items-center gap-1"><ExternalLink className="w-2 h-2" /> Link</a>
                  </td>
                  <td className="px-6 py-5 text-xs text-zinc-400">{t.creatorUsername}</td>
                  <td className="px-6 py-5 text-xs font-bold">{t.completedCount}/{t.requiredCount}</td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => deleteTask(t.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
