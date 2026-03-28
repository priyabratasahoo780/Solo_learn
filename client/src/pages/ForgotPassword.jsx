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
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-panel p-10 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-[80px]" />
        
        <div className="mx-auto h-20 w-20 bg-green-500/10 rounded-3xl flex items-center justify-center mb-8 border border-green-500/20">
          <CheckCircle className="h-12 w-12 text-green-500 animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Check your email</h2>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          We've sent a password reset link to <br/>
          <span className="text-white font-bold bg-white/5 px-2 py-1 rounded mt-2 inline-block">{email}</span>. <br/>
          Please check your inbox.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center justify-center w-full py-4 px-6 rounded-xl bg-white/5 text-slate-300 font-bold hover:bg-white/10 hover:text-white transition-all border border-white/5"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Login
        </Link>
      </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative z-10 transition-all">
      <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group border-white/10">
        
        {/* Animated Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -ml-32 -mt-32 transition-all duration-700 group-hover:bg-primary/30" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -mr-32 -mb-32 transition-all duration-700 group-hover:bg-secondary/20" />

        <div className="text-center mb-10 relative z-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto h-20 w-20 bg-white shadow-2xl shadow-primary/20 rounded-3xl flex items-center justify-center mb-8 transform hover:rotate-12 transition-transform cursor-pointer"
          >
            <Mail className="h-10 w-10 text-primary" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">
            Reset Request
          </h2>
          <p className="text-slate-400 font-medium tracking-wide leading-relaxed">
            Lost your key? Enter your email and we'll send a recovery link.
          </p>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-slate-200 ml-1">
              EMAIL ADDRESS
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="appearance-none block w-full px-5 py-4 pl-14 border border-white/5 placeholder-slate-600 text-white bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-slate-900/90 sm:text-sm transition-all shadow-inner"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl backdrop-blur-xl ring-1 ring-red-500/10"
            >
              <p className="text-sm text-red-300 font-bold text-center">{error}</p>
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
                SEND RECOVERY LINK
                <Send className="ml-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            )}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[110%] group-hover:translate-x-[110%] transition-transform duration-1000 ease-in-out pointer-events-none" />
          </button>

          <div className="text-center mt-12 pt-10 border-t border-white/10">
            <Link 
              to="/login" 
              className="inline-flex items-center text-xs font-black text-slate-500 hover:text-white transition-all tracking-widest uppercase border-b-2 border-transparent hover:border-primary/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
