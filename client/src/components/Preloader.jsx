import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Globe, Shovel, ShieldCheck, Zap } from 'lucide-react';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing SoloLearn V2.0...');
  
  const statuses = [
    'Syncing AI Architect...',
    'Calibrating MNC Meeting Rooms...',
    'Entering BattleGround Arena...',
    'Optimizing Neural Networks...',
    'Preparing Elite Roadmaps...',
    'Platform Ready.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const statusInterval = setInterval(() => {
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 800);

    // Fail-safe: Force finish if progress is stuck
    const failSafe = setTimeout(() => {
      setProgress(100);
      setTimeout(onFinish, 500);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
      clearTimeout(failSafe);
    };
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[9999] bg-[#05060b] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="relative z-10 text-center">
        {/* Animated Brand Logo */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
             <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-3xl rotate-45" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-2 border-t-indigo-500 rounded-3xl rotate-45" 
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-10 h-10 text-indigo-400 fill-indigo-400" />
             </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Solo<span className="text-indigo-500">Learn</span>
          </h1>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em] mt-2">Elite Edition</div>
        </motion.div>

        {/* Progress System */}
        <div className="max-w-[280px] w-full mx-auto">
           <div className="flex justify-between items-end mb-4 px-1">
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest animate-pulse">
                {status}
              </div>
              <div className="text-xl font-black text-white italic">
                {progress}%
              </div>
           </div>
           <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
           </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {[...Array(20)].map((_, i) => (
           <motion.div 
             key={i}
             initial={{ 
               x: Math.random() * window.innerWidth, 
               y: Math.random() * window.innerHeight,
               scale: Math.random() * 0.5
             }}
             animate={{ 
               y: [null, Math.random() * -100],
               opacity: [0, 1, 0]
             }}
             transition={{ 
               duration: Math.random() * 5 + 5, 
               repeat: Infinity,
               ease: "linear"
              }}
             className="w-1 h-1 bg-white rounded-full"
           />
         ))}
      </div>
    </motion.div>
  );
};

export default Preloader;
