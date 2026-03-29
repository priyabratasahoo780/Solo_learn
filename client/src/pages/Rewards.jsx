import { useAuth } from '../context/AuthContext';
import { Card3D } from '../components/Card3D';
import { motion } from 'framer-motion';
import { getBadgeIcon } from '../utils/badges';
import { Coins, Award, Zap } from 'lucide-react';

const Rewards = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const stats = [
    { label: 'Total Coins', value: user.coins || 0, icon: Coins, color: 'text-yellow-400' },
    { label: 'Badges Earned', value: user.badges?.length || 0, icon: Award, color: 'text-purple-400' },
    { label: 'Current Streak', value: `${user.streak || 0} Days`, icon: Zap, color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0b14]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Unit */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12"
        >
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
              ASSET <span className="text-gradient">INVENTORY</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Resource allocation & merit tracking</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
             <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <Coins className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <div className="text-2xl font-black text-white italic tracking-tighter leading-none">{user.coins || 0}</div>
                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1 text-center sm:text-left">Solocoins</div>
             </div>
          </div>
        </motion.div>

        {/* Dynamic Metric Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'MERIT BADGES', value: user.badges?.length || 0, icon: Award, color: 'text-purple-400', bColor: 'border-purple-500/30' },
            { label: 'OPERATIONAL STICK', value: `${user.streak || 0} CYCLES`, icon: Zap, color: 'text-orange-400', bColor: 'border-orange-500/30' },
            { label: 'TOTAL RECOGNITION', value: user.xp || user.totalPoints || 0, icon: Trophy, color: 'text-indigo-400', bColor: 'border-indigo-500/30' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card3D className={`glass-panel p-8 rounded-[32px] border-l-4 ${stat.bColor} shadow-3xl hover:bg-white/5 transition-all group overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><stat.icon className="w-16 h-16" /></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`p-4 bg-white/5 rounded-2xl ${stat.color} border border-white/5`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-white italic leading-none">{stat.value}</p>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Augmented Badge Gallery */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-widest flex items-center gap-4">
              <Award className="w-8 h-8 text-indigo-400" />
              VALIDATED BADGES
            </h2>
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em]">Sector 7 Access: Verified</div>
          </div>
          
          {(!user.badges || user.badges.length === 0) ? (
            <div className="p-20 text-center glass-panel rounded-[3rem] border-white/5 border-2 border-dashed">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Execute mission directives to unlock localized badges.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
              {user.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: i * 0.05 }}
                  className="group"
                >
                  <div className="glass-panel border-white/5 rounded-[2.5rem] p-6 sm:p-8 flex flex-col items-center gap-6 hover:border-indigo-500/40 hover:-translate-y-2 transition-all group cursor-pointer relative overflow-hidden h-full shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner relative z-10">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {getBadgeIcon(badge)}
                      </div>
                    </div>
                    <span className="font-black text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors relative z-10">
                      {badge}
                    </span>
                    
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
