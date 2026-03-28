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
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative z-10 transition-all">
      <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group border-white/10">
        
        {/* Animated Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-all duration-700 group-hover:bg-primary/30" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -ml-32 -mb-32 transition-all duration-700 group-hover:bg-secondary/20" />

        <div className="text-center mb-10 relative z-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto h-20 w-20 bg-white shadow-2xl shadow-primary/20 rounded-3xl flex items-center justify-center mb-8 transform hover:rotate-6 transition-transform cursor-pointer"
          >
            <Lock className="h-10 w-10 text-primary" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">
            New Credentials
          </h2>
          <p className="text-slate-400 font-medium tracking-wide">
            Update your password to regain access.
          </p>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="password" throws className="block text-sm font-bold text-slate-200 ml-1">
              NEW PASSWORD
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="appearance-none block w-full px-5 py-4 pl-14 border border-white/5 placeholder-slate-600 text-white bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-slate-900/90 sm:text-sm transition-all shadow-inner"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" throws className="block text-sm font-bold text-slate-200 ml-1">
              CONFIRM PASSWORD
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                required
                className="appearance-none block w-full px-5 py-4 pl-14 border border-white/5 placeholder-slate-600 text-white bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-slate-900/90 sm:text-sm transition-all shadow-inner"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-300 text-sm bg-red-500/10 p-5 rounded-2xl border border-red-500/20 backdrop-blur-sm mb-4 ring-1 ring-red-500/10 text-center font-bold"
            >
              <div className="flex items-center space-x-3 justify-center">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-5 px-8 border-none text-lg font-black rounded-2xl text-white bg-primary hover:bg-primary/90 focus:outline-none shadow-[0_15px_30px_-10px_rgba(108,99,255,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed overflow-hidden active:shadow-inner"
          >
            {isLoading ? (
              <Loader className="animate-spin h-6 w-6" />
            ) : (
              <span className="flex items-center tracking-tighter">
                UPDATE PASSWORD
                <CheckCircle className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              </span>
            )}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[110%] group-hover:translate-x-[110%] transition-transform duration-1000 ease-in-out pointer-events-none" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
