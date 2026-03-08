import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Coins, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state, login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = state.users.find(u => u.email === email);
    
    const isAdmin = user?.email === 'admin69@taskcoin';
    const correctPassword = isAdmin ? 'riduu69' : 'password';

    if (user && password === correctPassword) {
      login(user);
      navigate('/');
    } else {
      setError(`Invalid email or password. (Hint: use ${isAdmin ? 'riduu69' : 'password'})`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl coin-gradient shadow-2xl shadow-orange-500/20 mb-4">
            <Coins className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">TaskCoin</h1>
          <p className="text-zinc-500">Welcome back! Please enter your details.</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 font-bold hover:underline">Sign up for free</Link>
            </p>
          </div>
        </div>

        <div className="text-center space-y-2 text-xs text-zinc-600 font-medium tracking-widest uppercase">
          <p>User: user@example.com / password</p>
          <p>Admin: admin69@taskcoin / riduu69</p>
        </div>
      </motion.div>
    </div>
  );
}
