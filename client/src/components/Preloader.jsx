import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Cpu, Target, Zap, GraduationCap, ShieldCheck, Activity, Terminal } from 'lucide-react';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState('Initializing Academy Protocols...');
  
  const statuses = [
    'COLLECTING_TACTICAL_DATA...',
    'SYNCING_ACADEMY_PROTOCOLS...',
    'CALIBRATING_ENGINE_CORES...',
    'ESTABLISHING_SECURE_NODE...',
    'BOOTING_ENGINEER_OS...',
    'SYSTEM_READY_FOR_DEPLOYMENT.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    const statusInterval = setInterval(() => {
      if (!isReady) {
        setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 1100);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [isReady]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[10000] bg-oxford-blue flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Blueprint background grid */}
      <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
      
      {/* Dynamic scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-scanline pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl w-full px-12 space-y-16">
        
        {/* Central Tactical Hub Icon */}
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-32 h-32 bg-oxford-blue border-[4px] rounded-full flex items-center justify-center mx-auto relative z-20 transition-all duration-700 ${
              isReady ? 'border-white shadow-[0_0_80px_rgba(255,255,255,0.2)]' : 'border-orange-500 shadow-[0_0_50px_rgba(255,87,34,0.3)]'
            }`}
          >
            {isReady ? (
               <Zap className="w-16 h-16 text-white animate-pulse" />
            ) : (
               <ShieldCheck className="w-16 h-16 text-orange-500 animate-pulse" />
            )}
          </motion.div>
          
          {/* Rotating blueprint rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[2px] border-dashed border-white/10 rounded-full animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-[1px] border-white/5 rounded-full animate-reverse-spin" style={{ animationDuration: '15s' }} />
        </div>

        {/* Tactical Identification */}
        <div className="space-y-4">
           <motion.h1 
             initial={{ letterSpacing: '0.4em', opacity: 0 }}
             animate={{ letterSpacing: isReady ? '1.2em' : '1em', opacity: 1 }}
             className="text-white text-md font-black italic uppercase tracking-[1em] ml-[1em] transition-all"
           >
             SOLO<span className="text-orange-500">LEARN</span>
           </motion.h1>
           <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-[10px] text-orange-500/80 font-black uppercase tracking-[0.5em] italic">Engineer OS v2.05</span>
              <div className="h-[1px] w-12 bg-white/20" />
           </div>
        </div>

        {/* Progress System or Start Interaction */}
        <div className="w-full min-h-[140px] flex flex-col justify-end">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div 
                key="loading"
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                 <div className="flex justify-between items-end px-2">
                    <div className="flex flex-col items-start gap-2">
                       <div className="flex items-center gap-2 text-xs font-black text-white uppercase italic tracking-widest">
                          <Terminal className="w-4 h-4 text-orange-400" />
                          System Diagnostics:
                       </div>
                       <motion.div
                         key={status}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="text-[10px] text-orange-500/60 font-black uppercase tracking-[0.2em] font-mono"
                       >
                         {status}
                       </motion.div>
                    </div>
                    <div className="text-5xl font-black text-white italic tabular-nums title-fredoka">
                      {progress}<span className="text-orange-500 text-2xl">%</span>
                    </div>
                 </div>
                 
                 <div className="h-4 bg-white/5 border-[2px] border-white/10 rounded-full overflow-hidden p-[2px]">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:40px_40px] animate-shimmer" />
                    </motion.div>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="flex items-center gap-3">
                   <div className="h-[2px] w-8 bg-orange-500" />
                   <span className="text-white font-black uppercase text-[10px] tracking-[0.5em] italic">De-Encryption Complete</span>
                   <div className="h-[2px] w-8 bg-orange-500" />
                </div>
                <button
                  onClick={onFinish}
                  className="group relative px-12 py-5 bg-white overflow-hidden flex items-center gap-4 border-[3px] border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-orange-500/20 transition-all hover:-translate-y-1 active:translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-orange-500 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <Zap className="w-5 h-5 text-oxford-blue relative z-10 group-hover:text-white transition-colors" />
                  <span className="text-oxford-blue font-black uppercase italic tracking-widest text-sm relative z-10 group-hover:text-white transition-colors">AUTHORIZE DEPLOYMENT</span>
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Cpu className="w-3 h-3 text-white/40" />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Metrics Overlay */}
        <div className="grid grid-cols-3 gap-8 pt-6 opacity-30">
           {[
             { label: 'CORE', icon: Cpu },
             { label: 'TACTICAL', icon: Activity },
             { label: 'SECURITY', icon: ShieldCheck }
           ].map((metric, i) => (
              <div key={i} className="flex flex-col items-center gap-2 border-t-[1px] border-white/10 pt-4">
                 <metric.icon className="w-4 h-4 text-white" />
                 <span className="text-[8px] text-white font-black uppercase tracking-widest">{metric.label}</span>
              </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
