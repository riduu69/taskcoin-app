import React from 'react';
import { useApp } from '../App';
import { Coins, CheckCircle, ListTodo, TrendingUp, ArrowRight, PlusCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { state } = useApp();
  const user = state.currentUser!;

  const stats = user.isAdmin ? [
    { label: 'Total Users', value: (state.users || []).length, icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Tasks', value: (state.tasks || []).length, icon: ListTodo, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Pending Top Ups', value: (state.topUpRequests || []).filter(r => r.status === 'pending').length, icon: Coins, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ] : [
    { label: 'Total Coins', value: user.coins, icon: Coins, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Completed Tasks', value: user.completedTasks.length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Tasks', value: (state.tasks || []).filter(t => t.creatorId === user.id && t.status === 'active').length, icon: ListTodo, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  const recentTasks = (state.tasks || []).slice(0, 3);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {user.isAdmin ? 'Admin Dashboard' : `Welcome back, ${user.username}!`}
          </h2>
          <p className="text-zinc-500 mt-1">
            {user.isAdmin ? 'Platform overview and management.' : 'Ready to earn some coins today?'}
          </p>
        </div>
        {!user.isAdmin ? (
          <Link 
            to="/earn" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            Start Earning
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            Manage Platform
            <ShieldCheck className="w-4 h-4" />
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl flex items-center gap-5 border border-white/5"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              New Tasks
            </h3>
            <Link to="/earn" className="text-sm font-medium text-orange-500 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="glass p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-white/5 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    {task.type === 'youtube_subscribe' ? '🎬' : task.type === 'instagram_follow' ? '📸' : task.type === 'facebook_like' ? '👍' : '🎵'}
                  </div>
                  <div>
                    <p className="font-bold">{task.type.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</p>
                    <p className="text-xs text-zinc-500">By {task.creatorUsername}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-full">
                  <Coins className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-500">+{task.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {user.isAdmin ? (
          <section className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">System Status</h3>
                <p className="text-zinc-400 mt-2 leading-relaxed">All systems are operational. Monitor user activity and manage top-up requests from the admin panel.</p>
              </div>
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all duration-200"
              >
                Go to Admin Panel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        ) : (
          <section className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
                <PlusCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Need more followers?</h3>
                <p className="text-zinc-400 mt-2 leading-relaxed">Create your own task and get real engagement from our community members instantly.</p>
              </div>
              <Link 
                to="/create" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all duration-200"
              >
                Create Task
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


