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
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative z-10 transition-all">
      <div className="max-w-md w-full glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group border-white/10">
        
        {/* Animated Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -ml-32 -mt-32 transition-all duration-700 group-hover:bg-primary/30" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -mr-32 -mb-32 transition-all duration-700 group-hover:bg-secondary/20" />

        <div className="text-center mb-10 relative z-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto h-20 w-20 bg-white shadow-2xl shadow-primary/20 rounded-3xl flex items-center justify-center mb-8 transform hover:-rotate-6 transition-transform cursor-pointer"
          >
            <UserPlus className="h-10 w-10 text-primary" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tighter">
            Join the Quest
          </h2>
          <p className="text-slate-400 font-medium tracking-wide">
            Start your learning adventure today
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 relative z-10"
          onSubmit={handleSignup}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border-l-4 border-red-500 p-5 rounded-r-2xl backdrop-blur-xl ring-1 ring-red-500/10"
            >
              <p className="text-sm text-red-200 leading-relaxed font-bold">{error}</p>
            </motion.div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-slate-200 ml-1">
              FULL NAME
            </label>
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <UserPlus className="h-5 w-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-5 py-4 pl-14 border border-white/5 placeholder-slate-600 text-white bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-slate-900/90 sm:text-sm transition-all shadow-inner"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email-address" className="block text-sm font-bold text-slate-200 ml-1">
              EMAIL ADDRESS
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-5 py-4 pl-14 border border-white/5 placeholder-slate-600 text-white bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-slate-900/90 sm:text-sm transition-all shadow-inner"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" throws className="block text-sm font-bold text-slate-200 ml-1">
              PASSWORD
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-5 py-4 pl-14 border border-white/5 placeholder-slate-600 text-white bg-slate-900/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-slate-900/90 sm:text-sm transition-all shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-5 px-8 border-none text-lg font-black rounded-2xl text-white bg-primary hover:bg-primary/90 focus:outline-none shadow-[0_15px_30px_-10px_rgba(108,99,255,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed overflow-hidden active:shadow-inner"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                PREPARING...
              </span>
            ) : (
              <span className="flex items-center tracking-tighter">
                CREATE ACCOUNT
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" strokeWidth={3} />
              </span>
            )}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[110%] group-hover:translate-x-[110%] transition-transform duration-1000 ease-in-out pointer-events-none" />
          </button>
        </motion.form>
        
        <div className="mt-12 text-center relative z-10 pt-10 border-t border-white/10">
           <p className="text-slate-500 font-bold tracking-wide">
            Already a member?{' '}
            <Link to="/login" className="ml-2 font-black text-white hover:text-primary transition-all uppercase tracking-widest text-xs border-b-2 border-primary/30 hover:border-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
