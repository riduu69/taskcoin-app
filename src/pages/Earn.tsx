import React, { useState } from 'react';
import { useApp } from '../App';
import { Coins, ExternalLink, CheckCircle2, AlertCircle, Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTaskLabel } from '../utils/storage';

export default function Earn() {
  const { state, completeTask } = useApp();
  const user = state.currentUser!;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; reward: number } | null>(null);

  const availableTasks = (state.tasks || []).filter(task => 
    task.creatorId !== user.id && 
    task.status === 'active' && 
    !user.completedTasks.includes(task.id)
  );

  const filteredTasks = availableTasks.filter(task => {
    const matchesFilter = filter === 'all' || task.type === filter;
    const matchesSearch = task.type.toLowerCase().includes(search.toLowerCase()) || 
                          task.creatorUsername.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirm = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    setConfirmingId(taskId);
    // Simulate verification delay
    setTimeout(() => {
      completeTask(taskId);
      setConfirmingId(null);
      setToast({ 
        show: true, 
        message: `Task completed!`, 
        reward: task.reward 
      });
      
      // Auto-hide toast
      setTimeout(() => {
        setToast(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="glass bg-emerald-500/20 border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white">{toast.message}</p>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-orange-400" />
                    <p className="text-xs font-bold text-orange-400">+{toast.reward} coins added</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Earn Coins</h2>
          <p className="text-zinc-500 mt-1">Complete tasks to grow your balance.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'facebook_like', 'instagram_follow', 'youtube_subscribe', 'tiktok_follow'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                  filter === t 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:bg-zinc-800'
                }`}
              >
                {t === 'all' ? 'All Tasks' : getTaskLabel(t).split(' ')[1]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredTasks.length === 0 ? (
        <div className="glass p-12 rounded-[2.5rem] text-center space-y-4 border border-white/5">
          <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold">No tasks found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto">Check back later for new tasks or try changing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between gap-6 group hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl shadow-inner">
                      {task.type === 'youtube_subscribe' ? '🎬' : task.type === 'instagram_follow' ? '📸' : task.type === 'facebook_like' ? '👍' : '🎵'}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{getTaskLabel(task.type)}</h4>
                      <p className="text-sm text-zinc-500">By {task.creatorUsername}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-2xl">
                    <Coins className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-black text-orange-500">{task.reward}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    Open Link
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleConfirm(task.id)}
                    disabled={confirmingId === task.id}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all ${
                      confirmingId === task.id 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                    }`}
                  >
                    {confirmingId === task.id ? (
                      <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirm
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
