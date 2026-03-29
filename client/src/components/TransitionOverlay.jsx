import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Activity } from 'lucide-react';

const TransitionOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
    >
      {/* Background Dimmer */}
      <div className="absolute inset-0 bg-oxford-blue/10 backdrop-blur-sm" />

      {/* Center Tactical Scanning Ring */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-[2px] border-dashed border-orange-500/40 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[4px] border-oxford-blue/20 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-orange-500 animate-pulse" />
        </div>
      </div>

      {/* Scanning status text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
         <div className="flex items-center gap-3">
            <Activity className="w-3 h-3 text-orange-500 animate-ping" />
            <span className="text-[10px] text-oxford-blue font-black uppercase tracking-[0.4em] italic">Synchronizing_Archive...</span>
         </div>
         <div className="w-48 h-[2px] bg-oxford-blue/10 overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-orange-500"
            />
         </div>
      </div>
    </motion.div>
  );
};

export default TransitionOverlay;
