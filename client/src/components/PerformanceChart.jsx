import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Database, Layout, Globe, ArrowUpRight } from 'lucide-react';

const PerformanceChart = ({ user }) => {
  // Simplified Radar Chart Logic
  const categories = [
    { name: 'JavaScript', value: 85, icon: Cpu },
    { name: 'React', value: 92, icon: Layout },
    { name: 'Python', value: 65, icon: Globe },
    { name: 'SQL', value: 78, icon: Database },
    { name: 'Security', value: 45, icon: ShieldCheck }
  ];

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1 underline decoration-indigo-400/30 underline-offset-4">
            Skill Distribution Engine
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Technology Radar</h3>
        </div>
        <button className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
          <ArrowUpRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((cat, idx) => (
          <div key={cat.name} className="group relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-all">
                  <cat.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{cat.name} Mastery</span>
              </div>
              <span className="text-xs font-black text-indigo-400/80 tracking-widest">{cat.value}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.value}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 relative"
              >
                 {/* Glossy Overlay */}
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10"></div>
                 {/* Pulsing end */}
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
         <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.2em] mb-1">Elite Engineering Insight</p>
         <p className="text-gray-400 text-xs italic">"You are in the TOP 5% of React developers globally this week."</p>
      </div>
    </div>
  );
};

export default PerformanceChart;
