import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, LogIn, ArrowRight, Loader, Users, ShieldCheck, Terminal, Beaker, Zap } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden bg-slate-50">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
      
      {/* Blueprint Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 border-[1px] border-oxford-blue/5 rounded-full animate-spin-slow pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[1px] border-oxford-blue/5 rounded-full animate-reverse-spin pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full sketch-card bg-white p-12 sm:p-16 border-oxford-blue shadow-[15px_15px_0px_0px_#FF5722] relative z-10 overflow-hidden"
      >
        {/* Visual Engineering Overlay */}
        <div className="absolute -top-12 -left-12 opacity-5 rotate-12 pointer-events-none">
           <Beaker className="w-48 h-48 text-oxford-blue" />
        </div>

        <div className="text-center mb-14">
          <motion.div 
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="mx-auto h-24 w-24 icon-circle-sketch border-[3px] border-oxford-blue bg-white flex items-center justify-center mb-10 shadow-[6px_6px_0px_0px_#FF5722]"
          >
            <UserPlus className="h-10 w-10 text-oxford-blue" />
          </motion.div>
          
          <div className="space-y-2">
             <h2 className="text-4xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka">
               JOIN <span className="text-orange-500 underline decoration-dashed underline-offset-4">QUEST</span>
             </h2>
             <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-6 bg-slate-200" />
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] italic">
                   Initialization Sequence: Enlistment
                </p>
                <span className="h-[1px] w-6 bg-slate-200" />
             </div>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSignup}>
          {error && (
            <motion.div 
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-5 border-[3px] border-dashed border-red-500 bg-red-50/50 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 italic shadow-[6px_6px_0px_0px_#fee2e2]"
            >
              <Terminal className="w-4 h-4 animate-pulse" />
              {error}
            </motion.div>
          )}
          
          {/* Identity Handle Unit */}
          <div className="space-y-4">
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
               <Users className="w-4 h-4 text-oxford-blue" />
               Identity Handle
            </label>
            <input
              type="text"
              required
              className="w-full bg-white border-[3px] border-oxford-blue text-oxford-blue px-6 py-5 rounded-none focus:outline-none focus:shadow-[6px_6px_0px_0px_#cbd5e1] transition-all font-black placeholder-slate-300 italic"
              placeholder="FULL_NAME_OR_CALLSIGN"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Intelligence Link Unit */}
          <div className="space-y-4">
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
               <Mail className="w-4 h-4 text-oxford-blue" />
               Intelligence Link (Email)
            </label>
            <input
              type="email"
              required
              className="w-full bg-white border-[3px] border-oxford-blue text-oxford-blue px-6 py-5 rounded-none focus:outline-none focus:shadow-[6px_6px_0px_0px_#cbd5e1] transition-all font-black placeholder-slate-300 italic"
              placeholder="ENGINEER@SOLOLEARN.EDU"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Secure Code Unit */}
          <div className="space-y-4">
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
               <Lock className="w-4 h-4 text-oxford-blue" />
               Secure Access Code
            </label>
            <input
              type="password"
              required
              className="w-full bg-white border-[3px] border-oxford-blue text-oxford-blue px-6 py-5 rounded-none focus:outline-none focus:shadow-[6px_6px_0px_0px_#cbd5e1] transition-all font-black placeholder-slate-300 italic"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-sketch w-full py-6 text-sm bg-oxford-blue text-white border-oxford-blue shadow-[10px_10px_0px_0px_#FF5722] flex items-center justify-center gap-4 group"
          >
            {isLoading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : (
              <>
                CREATE IDENTITY <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform text-orange-400" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-14 pt-10 border-t-[3px] border-dashed border-slate-50 text-center">
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
            Verified Engineer? <Link to="/login" className="text-orange-500 hover:text-orange-600 ml-2 border-b-2 border-orange-200">Enter Gateway</Link>
          </p>
        </div>

        {/* Technical status pulse */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
           <span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">ENLISTMENT_READY</span>
           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
