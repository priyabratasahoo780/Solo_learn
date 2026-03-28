import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, ChevronRight } from 'lucide-react';

const ActivityHeatmap = ({ user }) => {
  // Mocking 365 days of activity for visual fidelity
  const days = Array.from({ length: 350 }, (_, i) => ({
    id: i,
    intensity: Math.floor(Math.random() * 5), // 0 to 4
    date: new Date(Date.now() - (350 - i) * 86400000)
  }));

  const getLevelColor = (level) => {
    switch(level) {
      case 0: return 'bg-white/5 border border-white/5'; // No activity
      case 1: return 'bg-indigo-500/20 border border-indigo-500/10 shadow-sm'; // Low activity
      case 2: return 'bg-indigo-500/40 border border-indigo-500/20 shadow-md'; // Moderate
      case 3: return 'bg-indigo-500/70 border border-indigo-500/30 shadow-lg'; // High
      case 4: return 'bg-indigo-600 border border-indigo-400 shadow-xl shadow-indigo-500/50'; // Peak
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
            <Flame className="w-4 h-4" />
            Learning Streak Engineering
          </div>
          <h3 className="text-2xl font-black text-white">Global Activity Heatmap</h3>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-indigo-400 font-black text-xl">{user?.streak || 0}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Day Streak</div>
          </div>
          <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-emerald-400 font-black text-xl">{user?.quizzesAttempted?.length || 0}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Solves</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex flex-wrap gap-1 md:gap-1.5 min-w-[300px]">
          {days.map((day) => (
            <motion.div
              key={day.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: day.id * 0.001 }}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-[3px] transition-all cursor-crosshair hover:ring-2 hover:ring-indigo-400 hover:z-10 ${getLevelColor(day.intensity)}`}
              title={`${day.date.toDateString()}: ${day.intensity * 25}% Intensity`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
         <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Less</span>
            <div className="flex gap-1">
               <div className="w-3 h-3 rounded-[2px] bg-white/5"></div>
               <div className="w-3 h-3 rounded-[2px] bg-indigo-500/20"></div>
               <div className="w-3 h-3 rounded-[2px] bg-indigo-500/40"></div>
               <div className="w-3 h-3 rounded-[2px] bg-indigo-500/60"></div>
               <div className="w-3 h-3 rounded-[2px] bg-indigo-600"></div>
            </div>
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">More</span>
         </div>
         
         <button className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-all group">
            View Analytics <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
