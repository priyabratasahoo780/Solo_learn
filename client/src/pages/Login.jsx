import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, LogIn, Loader, ShieldCheck, Terminal, Activity, Zap, Beaker } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Note: For @react-oauth/google, we usually get an access_token.
        // If we want an id_token, we use the 'GoogleLogin' component or a different flow.
        // For simplicity with 'useGoogleLogin', we can fetch user info or pass the access_token.
        // However, our backend expects an idToken. 
        // Let's use the 'implicit' flow which is standard for useGoogleLogin.
        
        // Actually, let's use the standard 'GoogleLogin' component for idTokens if possible,
        // but 'useGoogleLogin' is better for custom buttons. 
        // I will adjust the backend to handle access_tokens or stick to a simple strategy.
        
        // Re-implementing with a strategy that fetch info from google and then logs in
        const res = await googleLogin(tokenResponse.access_token);
        if (res.success) {
          toast.success('Neural Link Established. Welcome Engineer.');
          navigate(from, { replace: true });
        } else {
          setError(res.error);
        }
      } catch (err) {
        setError('Google synchronization failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Google Authentication Interrupted')
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden bg-slate-50">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
      
      {/* Blueprint Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 border-[1px] border-oxford-blue/5 rounded-full animate-spin-slow pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 border-[1px] border-oxford-blue/5 rounded-full animate-reverse-spin pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-xl w-full sketch-card bg-white p-12 sm:p-16 border-oxford-blue shadow-[15px_15px_0px_0px_#FF5722] relative z-10 overflow-hidden"
      >
        {/* Visual Security Overlay (Blueprint style) */}
        <div className="absolute -top-12 -right-12 opacity-5 -rotate-12 pointer-events-none">
           <ShieldCheck className="w-48 h-48 text-oxford-blue" />
        </div>

        <div className="text-center mb-14">
          <motion.div 
            initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            className="mx-auto h-24 w-24 icon-circle-sketch border-[3px] border-oxford-blue bg-white flex items-center justify-center mb-10 shadow-[6px_6px_0px_0px_#FF5722]"
          >
            <ShieldCheck className="h-10 w-10 text-oxford-blue" />
          </motion.div>
          
          <div className="space-y-2">
             <h2 className="text-4xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka">
               AUTH <span className="text-orange-500 underline decoration-dashed underline-offset-4">GATEWAY</span>
             </h2>
             <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-6 bg-slate-200" />
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] italic">
                   Identity Verification Required
                </p>
                <span className="h-[1px] w-6 bg-slate-200" />
             </div>
          </div>
        </div>

        <form className="space-y-10" onSubmit={handleLogin}>
          {/* Email Deployment Unit */}
          <div className="space-y-4">
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
               <Mail className="w-4 h-4 text-oxford-blue" />
               Command Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full bg-white border-[3px] border-oxford-blue text-oxford-blue px-6 py-5 rounded-none focus:outline-none focus:shadow-[6px_6px_0px_0px_#cbd5e1] transition-all font-black placeholder-slate-300 italic"
                placeholder="ENGINEER@SOLOLEARN.EDU"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Access Code Unit */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
                 <Lock className="w-4 h-4 text-oxford-blue" />
                 Access Code
              </label>
              <Link to="/forgot-password" size="xs" className="text-[9px] font-black text-orange-500 hover:text-orange-600 transition-colors tracking-widest uppercase italic">Lost Code?</Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full bg-white border-[3px] border-oxford-blue text-oxford-blue px-6 py-5 rounded-none focus:outline-none focus:shadow-[6px_6px_0px_0px_#cbd5e1] transition-all font-black placeholder-slate-300 italic"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 border-[3px] border-dashed border-red-500 bg-red-50/50 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 italic shadow-[6px_6px_0px_0px_#fee2e2]"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-sketch w-full py-6 text-sm bg-oxford-blue text-white border-oxford-blue shadow-[10px_10px_0px_0px_#FF5722] flex items-center justify-center gap-4 group"
          >
            {isLoading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : (
              <>
                INITIALIZE SYSTEM <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform text-orange-400" />
              </>
            )}
          </button>

          {/* Social Auth Separator */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-slate-400 font-bold uppercase tracking-widest italic">Or Initialize Via</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="w-full py-4 bg-white border-[3px] border-oxford-blue text-oxford-blue flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform shadow-[6px_6px_0px_0px_#FF5722] disabled:opacity-50"
          >
            <FcGoogle className="w-6 h-6" />
            Continue With Google
          </button>
        </form>

        <div className="mt-14 pt-10 border-t-[3px] border-dashed border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
            New Engineer Enlistment? <Link to="/signup" className="text-orange-500 hover:text-orange-600 ml-2 border-b-2 border-orange-200">Create Profile</Link>
          </p>
        </div>

        {/* Tactical status pulse */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
           <div className="w-2 h-2 bg-slate-200 rounded-full animate-pulse" />
           <span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">GATEWAY_ENCRYPTION: ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
