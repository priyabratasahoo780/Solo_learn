import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Card3D } from '../components/Card3D';

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

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-8 h-8 text-yellow-400" fill="currentColor" />;
      case 1: return <Medal className="w-8 h-8 text-gray-300" />;
      case 2: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return <span className="text-xl font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0b14]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <motion.div
             initial={{ scale: 0, rotate: -180 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ type: "spring", duration: 1 }}
             className="inline-block relative"
          >
            <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] relative z-10" />
          </motion.div>
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
              GLOBAL <span className="text-gradient">RANKINGS</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Elite Operational Standings</p>
          </div>
        </div>

        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card3D className="glass-panel !bg-white/5 border-white/5 hover:border-indigo-500/30 transition-all rounded-[32px] group overflow-hidden">
                <div className="flex items-center justify-between p-6 sm:p-8 relative">
                  <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-600/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-6 sm:gap-10">
                    <div className="w-12 flex justify-center flex-shrink-0">
                      {index < 3 ? (
                        <div className={`relative ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-600'}`}>
                           <Crown className="w-10 h-10 drop-shadow-lg" fill="currentColor" />
                           <span className="absolute -bottom-1 -right-1 text-[10px] bg-black/80 px-1.5 rounded-md font-black italic border border-white/10">#{index+1}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-black text-gray-700 italic group-hover:text-indigo-400 transition-colors">#{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
                      <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-black text-white shadow-2xl transition-transform group-hover:rotate-6
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-600 shadow-orange-500/20' : 
                          index === 1 ? 'bg-gradient-to-br from-slate-400 to-gray-600 shadow-gray-400/20' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-brown-800 shadow-amber-800/20' :
                          'bg-white/5 border border-white/10 shadow-indigo-500/10'}`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-white italic truncate group-hover:text-indigo-400 transition-colors">
                          {user.name.toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                          <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {user.badges?.length || 0} Badges</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {user.quizzesAttempted?.length || 0} Cycles</span>
                        </div>
                      </div>
                    </div>
                  </div>
   
                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-white italic leading-none tracking-tighter">
                      {user.totalPoints?.toLocaleString()}
                    </div>
                    <div className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                      XP METRIC
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-20 glass-panel rounded-[3rem] border-white/5">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No active identities detected in this sector.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
