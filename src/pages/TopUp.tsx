import React, { useState } from 'react';
import { useApp } from '../App';
import { Coins, Send, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopUp() {
  const { state, requestTopUp } = useApp();
  const user = state.currentUser!;
  const [amount, setAmount] = useState(100);
  const [success, setSuccess] = useState(false);

  const userRequests = (state.topUpRequests || []).filter(r => r.userId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    requestTopUp(amount);
    setSuccess(true);
    setAmount(100);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Top Up Coins</h2>
        <p className="text-zinc-500 mt-1">Request more coins to promote your tasks.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-bold">Request submitted! An admin will review it soon.</p>
            </motion.div>
          )}

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 ml-1">Amount to Request</label>
                <div className="grid grid-cols-3 gap-3">
                  {[100, 500, 1000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`p-4 rounded-2xl border transition-all font-bold ${
                        amount === val 
                          ? 'bg-orange-500/10 border-orange-500 text-orange-500' 
                          : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 ml-1">Custom Amount</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Your request will be sent to the admin for manual approval. Once approved, coins will be added to your balance.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Send className="w-6 h-6" />
                Submit Request
              </button>
            </form>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Request History
          </h3>

          <div className="space-y-4">
            {userRequests.length === 0 ? (
              <div className="p-12 text-center glass rounded-[2rem] border border-white/5 text-zinc-500">
                No requests yet.
              </div>
            ) : (
              userRequests.map((req) => (
                <div key={req.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                      req.status === 'approved' ? 'bg-emerald-500/10' : 
                      req.status === 'rejected' ? 'bg-red-500/10' : 'bg-zinc-800'
                    }`}>
                      <Coins className={`w-6 h-6 ${
                        req.status === 'approved' ? 'text-emerald-500' : 
                        req.status === 'rejected' ? 'text-red-500' : 'text-zinc-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold">{req.amount} Coins</p>
                      <p className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'approved' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    ) : req.status === 'rejected' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
