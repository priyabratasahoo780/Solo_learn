import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';

const PremiumLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 overflow-hidden">
      {/* Notebook Paper Grid Overlay */}
      <div className="absolute inset-0 sketch-grid opacity-20" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Icon Circle */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1,
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-white border-[3px] border-oxford-blue rounded-full shadow-[8px_8px_0px_0px_#FF5722] flex items-center justify-center mb-10"
        >
          <BookOpen className="w-10 h-10 text-oxford-blue" />
        </motion.div>

        {/* Brand Presence */}
        <div className="text-center space-y-3">
          <motion.h2 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-2xl font-black text-oxford-blue italic tracking-tighter uppercase"
          >
            SOLO<span className="text-orange-500">LEARN</span> <span className="text-sm not-italic opacity-50 block mt-1 tracking-widest font-black">ACADEMY OPS</span>
          </motion.h2>

          <div className="flex items-center justify-center gap-3">
             <div className="flex gap-1.5">
               <motion.span 
                 animate={{ scale: [1, 1.5, 1], backgroundColor: ['#002D72', '#FF5722', '#002D72'] }}
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="w-2 h-2 rounded-full"
               />
               <motion.span 
                 animate={{ scale: [1, 1.5, 1], backgroundColor: ['#002D72', '#FF5722', '#002D72'] }}
                 transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                 className="w-2 h-2 rounded-full"
               />
               <motion.span 
                 animate={{ scale: [1, 1.5, 1], backgroundColor: ['#002D72', '#FF5722', '#002D72'] }}
                 transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                 className="w-2 h-2 rounded-full"
               />
             </div>
             <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.3em]">Mapping Academic Modules...</span>
          </div>
        </div>

        {/* Background Floating Elements (Subtle) */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 45, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -top-32 -left-32"
        >
          <Sparkles className="w-24 h-24 text-oxford-blue" />
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumLoader;
