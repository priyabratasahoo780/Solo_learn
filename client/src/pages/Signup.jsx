import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, LogIn, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const res = await signup(name, email, password);
      if (res.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-20 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-panel p-10 sm:p-14 rounded-[48px] border border-white/10 shadow-3xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -ml-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -mr-32 -mb-32" />

        <div className="text-center mb-12 relative z-10">
          <motion.div 
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="mx-auto h-24 w-24 glass-panel border-white/10 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500"
          >
            <UserPlus className="h-12 w-12 text-indigo-400" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-3">
            JOIN <span className="text-gradient">QUEST</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Initialization Sequence
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 relative z-10"
          onSubmit={handleSignup}
        >
          {error && (
            <motion.div 
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-bold leading-relaxed flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              {error}
            </motion.div>
          )}
          
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 tracking-[0.3em] ml-2 uppercase">Identity Handle</label>
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-400 transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/5 text-white px-6 py-5 pl-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:bg-white/10 transition-all font-medium placeholder-gray-600"
                placeholder="Full Name / Handle"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 tracking-[0.3em] ml-2 uppercase">Intelligence Link</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-400 transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/5 text-white px-6 py-5 pl-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:bg-white/10 transition-all font-medium placeholder-gray-600"
                placeholder="engineer@sololearn.v2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 tracking-[0.3em] ml-2 uppercase">Secure Code</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/5 text-white px-6 py-5 pl-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:bg-white/10 transition-all font-medium placeholder-gray-600"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all active:scale-95 disabled:opacity-50 group/btn overflow-hidden"
          >
            {isLoading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : (
              <span className="flex items-center justify-center gap-3">
                Create Identity <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </button>
        </motion.form>
        
        <div className="mt-12 text-center relative z-10 pt-10 border-t border-white/10">
           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Verified Engineer? <Link to="/login" className="text-white hover:text-indigo-400 ml-2 border-b border-indigo-500/30">Enter Gateway</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
