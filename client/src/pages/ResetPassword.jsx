import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Lock, ArrowRight, CheckCircle, Loader, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
      if (data.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
        // Optional: auto login user or redirect to login
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-panel p-10 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-[80px]" />
        
        <div className="mx-auto h-20 w-20 bg-green-500/10 rounded-3XL flex items-center justify-center mb-8 border border-green-500/20">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Security Updated!</h2>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed text-lg">
          Your password has been successfully reset. <br/>
          Redirecting to secured login...
        </p>
        <Link 
          to="/login" 
          className="group inline-flex items-center justify-center w-full py-4 px-6 rounded-xl bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-[0_10px_20px_-10px_rgba(108,99,255,0.5)]"
        >
          Go to Login Now
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
            <Lock className="h-12 w-12 text-indigo-400" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-3">
            NEW <span className="text-gradient">CREDENTIALS</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Identity Key Rotation
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
            <label className="block text-[10px] font-black text-gray-500 tracking-[0.3em] ml-2 uppercase">Secure Code</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-400 transition-colors">
                <Key className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/5 text-white px-6 py-5 pl-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:bg-white/10 transition-all font-medium placeholder-gray-600"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-500 tracking-[0.3em] ml-2 uppercase">Confirm Code</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-indigo-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/5 text-white px-6 py-5 pl-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 focus:bg-white/10 transition-all font-medium placeholder-gray-600"
                placeholder="Confirm your code"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span className="flex items-center justify-center gap-3">
                UPDATE KEY <CheckCircle className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
