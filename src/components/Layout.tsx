import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Coins, PlusCircle, User, ShieldCheck, LogOut, Wallet } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const { state, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/earn', icon: Coins, label: 'Earn' },
    { path: '/topup', icon: Wallet, label: 'Top Up' },
    { path: '/withdraw', icon: Wallet, label: 'Withdraw' },
    { path: '/create', icon: PlusCircle, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (state.currentUser?.isAdmin) {
    navItems.push({ path: '/admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl coin-gradient flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Coins className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TaskCoin</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-orange-500")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
              {state.currentUser?.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{state.currentUser?.username}</p>
              <p className="text-xs text-zinc-500 truncate">{state.currentUser?.coins} coins</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg coin-gradient flex items-center justify-center">
            <Coins className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg">TaskCoin</span>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/5">
          <Coins className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold">{state.currentUser?.coins}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-orange-500" : "text-zinc-500"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
