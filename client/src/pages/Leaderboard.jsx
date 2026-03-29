import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Trophy, Medal, Crown, Award, Zap, ChevronRight, Beaker, ShieldCheck, Microscope } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/leaderboard');
        setUsers(data.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-slate-50 relative overflow-hidden">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
      <h1 className="sr-only">Sketch Academy Institutional Standings - Global Global Rankings</h1>
      
      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        {/* Header Section: Institutional Achievement */}
        <div className="text-center space-y-8">
          <motion.div
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ type: "spring", duration: 1.2 }}
             className="inline-block relative"
          >
            <div className="icon-circle-sketch h-28 w-28 bg-white border-[4px] border-oxford-blue shadow-[10px_10px_0px_0px_#FF5722] flex items-center justify-center mx-auto mb-4">
               <Trophy className="w-14 h-14 text-oxford-blue group-hover:text-orange-500 transition-colors" />
            </div>
          </motion.div>
          
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxford-blue text-white text-[9px] font-black uppercase tracking-[0.2em] border-2 border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722] mx-auto">
               <ShieldCheck className="w-3 h-3 text-orange-400 fill-orange-400" />
               ACADEMIC_ACHIEVEMENT_PROTOCOL_V4
             </div>
             <h1 className="text-5xl sm:text-7xl font-black text-oxford-blue tracking-tighter uppercase italic title-fredoka leading-none">
               INSTITUTIONAL <span className="text-orange-500 underline decoration-dashed underline-offset-[12px]">STANDINGS</span>
             </h1>
             <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] italic">Verified Elite Operational Standings • Top Technical Talent</p>
          </div>
        </div>

        {/* Global Ranking Archive */}
        <div className="space-y-8 pb-10">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className={`sketch-card bg-white p-6 sm:p-10 border-oxford-blue flex flex-col sm:flex-row items-center justify-between gap-8 h-full transition-all hover:-translate-y-1 cursor-help group
                ${index === 0 ? 'shadow-[12px_12px_0px_0px_#FF5722]' : 
                  index === 1 ? 'shadow-[10px_10px_0px_0px_#94a3b8]' :
                  index === 2 ? 'shadow-[10px_10px_0px_0px_#92400e]' :
                  'shadow-[8px_8px_0px_0px_#cbd5e1]'}`}
              >
                <div className="flex items-center gap-8 sm:gap-12 w-full sm:w-auto">
                  {/* Rank Indicator Badge */}
                  <div className="w-16 flex-shrink-0 flex justify-center">
                    {index < 3 ? (
                      <div className="relative group/rank cursor-pointer">
                         <div className={`h-12 w-12 icon-circle-sketch border-[3px] border-oxford-blue flex items-center justify-center transition-all
                           ${index === 0 ? 'bg-orange-500 text-white' : index === 1 ? 'bg-slate-200 text-oxford-blue' : 'bg-amber-800 text-white'}`}
                         >
                            <Crown className="w-6 h-6" />
                         </div>
                         <span className="absolute -bottom-2 -right-2 text-[11px] bg-oxford-blue text-white px-2 py-0.5 font-black italic border-2 border-white title-fredoka">
                           #{index + 1}
                         </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-black text-slate-300 italic title-fredoka group-hover:text-oxford-blue transition-colors leading-none tracking-tighter">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                  
                  {/* Identity Fragment */}
                  <div className="flex items-center gap-6 sm:gap-8 overflow-hidden">
                    <div className={`h-20 w-20 icon-circle-sketch border-[3px] border-oxford-blue p-1 flex-shrink-0 transition-all ${index === 0 ? 'shadow-[4px_4px_0px_0px_#FF5722]' : 'shadow-[4px_4px_0px_0px_#cbd5e1]'}`}>
                       <div className="w-full h-full bg-oxford-blue rounded-full flex items-center justify-center text-white font-black text-3xl title-fredoka relative overflow-hidden">
                          {user.name.charAt(0).toUpperCase()}
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    </div>
                    <div className="min-w-0 space-y-2">
                      <h3 className="text-2xl font-black text-oxford-blue italic truncate title-fredoka tracking-tighter">
                        {user.name.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">
                        <span className="flex items-center gap-2 border-b-[2px] border-slate-50 transition-colors group-hover:text-orange-500">
                          <Award className="w-4 h-4 text-oxford-blue" /> {user.badges?.length || 0} BADGES
                        </span>
                        <span className="flex items-center gap-2 border-b-[2px] border-slate-50 transition-colors group-hover:text-orange-500">
                          <Zap className="w-4 h-4 text-oxford-blue" /> {user.quizzesAttempted?.length || 0} CYCLES
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Performance Metric Output */}
                <div className="w-full sm:w-auto text-center sm:text-right space-y-2 border-t sm:border-t-0 sm:border-l-[3px] border-dashed border-slate-100 pt-6 sm:pt-0 sm:pl-10">
                  <div className="text-4xl sm:text-5xl font-black text-oxford-blue italic leading-none tracking-tighter title-fredoka">
                    {user.totalPoints?.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] italic leading-none">
                    XP_METRIC_AGGREGATE
                  </div>
                </div>

                {/* Tactical Status Badge (Corner) */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                   <Microscope className="w-12 h-12 text-oxford-blue rotate-12" />
                </div>
              </div>
            </motion.div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-32 sketch-card bg-white border-oxford-blue border-dashed shadow-[15px_15px_0px_0px_#cbd5e1]">
              <Beaker className="w-20 h-20 text-slate-200 mx-auto mb-8" />
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs italic px-10 leading-loose">
                 "No verified technical identities detected within these institutional parameters."
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
