import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Cpu, Target, Zap, GraduationCap } from 'lucide-react';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Academy Protocols...');
  
  const statuses = [
    'Mapping Academic Modules...',
    'Calibrating Recruitment Intel...',
    'Synchronizing Research Papers...',
    'Initializing Neural Workspace...',
    'Deploying Engineering Heuristics...',
    'Study Session Ready.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    const statusInterval = setInterval(() => {
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 900);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[10000] bg-slate-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Notebook Paper Lines overlay */}
      <div className="absolute inset-0 sketch-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 h-full flex flex-col pointer-events-none opacity-5">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="h-[32px] border-b border-oxford-blue" />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg w-full px-8">
        {/* Animated Academic Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1,
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-white border-[3px] border-oxford-blue rounded-full shadow-[8px_8px_0px_0px_#FF5722] flex items-center justify-center mx-auto mb-12 relative"
        >
          <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-oxford-blue/20 animate-spin-slow" style={{ animationDuration: '10s' }} />
          <GraduationCap className="w-10 h-10 text-oxford-blue" />
        </motion.div>

        {/* Brand Presence */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">
            SOLO<span className="text-orange-500">LEARN</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
             <div className="h-[2px] w-8 bg-oxford-blue/10" />
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Academic Sketch Hub</span>
             <div className="h-[2px] w-8 bg-oxford-blue/10" />
          </div>
        </motion.div>

        {/* Progress System (Neubrutalist) */}
        <div className="w-full space-y-6">
           <div className="flex justify-between items-end px-2">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Protocol Status</span>
                <div className="text-xs text-oxford-blue font-black uppercase tracking-tight h-5 overflow-hidden">
                  <motion.div
                    key={status}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    {status}
                  </motion.div>
                </div>
              </div>
              <div className="text-3xl font-black text-oxford-blue italic tabular-nums">
                {progress}%
              </div>
           </div>
           
           <div className="h-6 bg-white border-[3px] border-oxford-blue rounded-2xl shadow-[6px_6px_0px_0px_#FF5722] overflow-hidden p-[3px]">
              <motion.div 
                className="h-full bg-oxford-blue rounded-xl relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-shimmer" />
              </motion.div>
           </div>
        </div>

        {/* Study Advice */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed"
        >
          Pro Tip: Use the AI Tutor to break down monolithic code architectures.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;
