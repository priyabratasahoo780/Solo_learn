import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Save, AlertCircle, X, ShieldCheck, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ActivityHeatmap from '../components/ActivityHeatmap';
import PerformanceChart from '../components/PerformanceChart';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await updateProfile({ name, email });
      if (res.success) {
        toast.success('Profile credentials updated!');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0b14]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Traditional Profile Form */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] border-white/5"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <User className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white leading-tight">Settings</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Engineering Profile</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 ml-1">Full Identity</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 ml-1">Email Access</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-gray-500 cursor-not-allowed text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Processing...' : <><Save className="w-4 h-4" /> Save Signature</>}
              </button>
            </form>
          </motion.div>

          {/* Social Stats Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-around text-center">
             <div>
                <div className="text-white font-black text-xl italic">{user?.xp || 0}</div>
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Global XP</div>
             </div>
             <div className="h-8 w-px bg-white/5"></div>
             <div>
                <div className="text-indigo-400 font-black text-xl italic">{user?.coins || 0}</div>
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Solocoins</div>
             </div>
             <div className="h-8 w-px bg-white/5"></div>
             <div>
                <div className="text-emerald-400 font-black text-xl italic">{user?.certificates?.length || 0}</div>
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Awards</div>
             </div>
          </div>
        </div>

        {/* Right Columns: Engineering Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <PerformanceChart user={user} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ActivityHeatmap user={user} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                   <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                   <h4 className="text-white font-bold text-sm">Elite Verification</h4>
                   <p className="text-xs text-gray-500">Your account is fully verified for PvP duels.</p>
                </div>
             </div>
             <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                   <Award className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                   <h4 className="text-white font-bold text-sm">Top 1% Contributor</h4>
                   <p className="text-xs text-gray-500">Recognized for quality UGC quiz creations.</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
