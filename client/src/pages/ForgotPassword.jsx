import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Send, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setIsSent(true);
      } else {
        setError(res.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-10 sm:p-14 rounded-[48px] text-center relative overflow-hidden border border-white/10"
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
          
          <div className="mx-auto h-24 w-24 glass-panel border-white/10 rounded-[32px] flex items-center justify-center mb-10 shadow-2xl">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Transmission <span className="text-emerald-400">Success</span></h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10 leading-relaxed">
            Link dispatched to <br/>
            <span className="text-white font-black bg-white/5 px-3 py-1 rounded-lg mt-3 inline-block border border-white/5">{email}</span>
          </p>
          <Link 
            to="/login" 
            className="w-full relative py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            System Return
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-20 px-6 relative z-10 transition-all">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full glass-panel p-10 sm:p-14 rounded-[48px] border border-white/10 shadow-3xl relative group overflow-hidden"
      >
        {/* Animated Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] -ml-32 -mb-32 transition-all duration-700" />

        <div className="text-center mb-12 relative z-10">
          <motion.div 
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="mx-auto h-24 w-24 glass-panel border-white/10 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500"
          >
            <Mail className="h-12 w-12 text-indigo-400" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-3">
            RECOVERY <span className="text-gradient">REQUEST</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Access Code Restoration
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 relative z-10"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 tracking-[0.3em] ml-2 uppercase">Command Email</label>
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

          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-bold flex items-center gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all active:scale-95 disabled:opacity-50 group/btn overflow-hidden"
          >
            {isLoading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : (
              <span className="flex items-center justify-center gap-3 text-center">
                SEND LINK <Send className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </button>
        </motion.form>

        <div className="mt-12 text-center relative z-10 pt-10 border-t border-white/10">
          <Link 
            to="/login" 
            className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
