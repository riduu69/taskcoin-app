import React, { useState } from 'react';
import { useApp } from '../App';
import { Coins, Send, Clock, CheckCircle2, XCircle, Smartphone, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export default function Withdraw() {
  const { state, requestWithdraw } = useApp();
  const user = state.currentUser!;
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userRequests = (state.withdrawRequests || []).filter(r => r.userId === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (amount < 500) {
      setError('Minimum withdrawal is 500 coins.');
      return;
    }
    if (user.coins < amount) {
      setError('Insufficient balance.');
      return;
    }
    if (!accountNumber) {
      setError('Account number is required.');
      return;
    }

    setLoading(true);
    try {
      await requestWithdraw({ amount, method, accountNumber });
      setSuccess(true);
      setAmount(500);
      setAccountNumber('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Withdraw Earnings</h2>
        <p className="text-zinc-500 mt-1">Convert your coins into real money (bKash/Nagad).</p>
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
              <p className="font-bold">Withdrawal request submitted!</p>
            </motion.div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
              <XCircle className="w-5 h-5" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-zinc-400 ml-1">Select Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {['bKash', 'Nagad'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m as any)}
                      className={`p-4 rounded-2xl border transition-all font-bold flex items-center justify-center gap-2 ${
                        method === m 
                          ? 'bg-orange-500/10 border-orange-500 text-orange-500' 
                          : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 ml-1">Amount (Coins)</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="number"
                    min="500"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    placeholder="Min 500"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 ml-1">100 Coins = 10 BDT (Example Rate)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 ml-1">{method} Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {loading ? 'Processing...' : 'Request Withdrawal'}
                {!loading && <Wallet className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Withdrawal History
          </h3>

          <div className="space-y-4">
            {userRequests.length === 0 ? (
              <div className="p-12 text-center glass rounded-[2rem] border border-white/5 text-zinc-500">
                No withdrawal requests yet.
              </div>
            ) : (
              userRequests.map((req) => (
                <div key={req.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                      req.status === 'approved' ? 'bg-emerald-500/10' : 
                      req.status === 'rejected' ? 'bg-red-500/10' : 'bg-zinc-800'
                    }`}>
                      <Wallet className={`w-6 h-6 ${
                        req.status === 'approved' ? 'text-emerald-500' : 
                        req.status === 'rejected' ? 'text-red-500' : 'text-zinc-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold">{req.amount} Coins ({req.method})</p>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase">{req.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'approved' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        Paid
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
