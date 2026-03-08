import React, { useState } from 'react';
import { useApp } from '../App';
import { Coins, PlusCircle, Link as LinkIcon, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { TaskType } from '../types';
import { getTaskLabel } from '../utils/storage';

export default function CreateTask() {
  const { state, addTask } = useApp();
  const user = state.currentUser!;
  
  const [type, setType] = useState<TaskType>('youtube_subscribe');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [reward, setReward] = useState(5);
  const [success, setSuccess] = useState(false);

  const totalCost = quantity * reward;
  const canAfford = user.coins >= totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) return;

    addTask({
      type,
      link,
      reward,
      requiredCount: quantity,
    });

    setSuccess(true);
    setLink('');
    setTimeout(() => setSuccess(false), 3000);
  };

  const taskTypes: TaskType[] = ['facebook_like', 'instagram_follow', 'youtube_subscribe', 'tiktok_follow'];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Create Task</h2>
        <p className="text-zinc-500 mt-1">Promote your social media profiles instantly.</p>
      </header>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold">Task created successfully! It's now live for others to complete.</p>
        </motion.div>
      )}

      <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-zinc-400 ml-1">Select Task Type</label>
            <div className="grid grid-cols-2 gap-3">
              {taskTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    type === t 
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500' 
                      : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-2xl">
                    {t === 'youtube_subscribe' ? '🎬' : t === 'instagram_follow' ? '📸' : t === 'facebook_like' ? '👍' : '🎵'}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">{getTaskLabel(t).split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 ml-1">Social Media Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="url"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 ml-1">Quantity</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 ml-1">Reward per Task</label>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="number"
                  min="1"
                  required
                  value={reward}
                  onChange={(e) => setReward(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 font-medium">Total Cost</span>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-orange-500" />
                <span className="text-2xl font-black">{totalCost}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Your Balance</span>
              <span className={canAfford ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                {user.coins} coins
              </span>
            </div>
          </div>

          {!canAfford && (
            <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Insufficient balance. Complete more tasks to earn coins.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!canAfford || !link}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <PlusCircle className="w-6 h-6" />
            Launch Task
          </button>
        </form>
      </div>
    </div>
  );
}
