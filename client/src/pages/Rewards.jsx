import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { getBadgeIcon } from '../utils/badges';
import { Coins, Award, Zap, Trophy, ShieldCheck, Microscope, Beaker, ChevronRight } from 'lucide-react';

const Rewards = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-slate-50 relative overflow-hidden">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
      <h1 className="sr-only">Sketch Academy Academic Archive - Institutional Asset Inventory</h1>
      
      <div className="max-w-[1700px] mx-auto relative z-10 space-y-16">
        
        {/* Header Unit: Institutional Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxford-blue text-white text-[9px] font-black uppercase tracking-[0.2em] border-2 border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722]">
              <ShieldCheck className="w-3 h-3 text-orange-400 fill-orange-400" />
              RESOURCE_ALLOCATION_LEDGER_V2
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-oxford-blue tracking-tighter uppercase italic title-fredoka leading-none">
              ACADEMIC <span className="text-orange-500 underline decoration-dashed underline-offset-[12px]">ARCHIVE</span>
            </h1>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] italic">Institutional Resource Allocation & Merit Tracking Library</p>
          </div>
          
          <div className="sketch-card bg-white px-10 py-5 border-oxford-blue shadow-[8px_8px_0px_0px_#FF5722] flex items-center gap-6">
             <div className="icon-circle-sketch h-14 w-14 bg-slate-50 border-[2px]">
                <Coins className="w-7 h-7 text-orange-500" />
             </div>
             <div>
                <div className="text-3xl font-black text-oxford-blue title-fredoka leading-none tracking-tighter">{user.coins || 0}</div>
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic">UNALLOCATED CREDITS</div>
             </div>
          </div>
        </motion.div>

        {/* Dynamic Metric Tiles (Institutional Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'MERIT BADGES', value: user.badges?.length || 0, icon: Award, shadow: 'shadow-[8px_8px_0px_0px_#FF5722]' },
            { label: 'OPERATIONAL CYCLES', value: `${user.streak || 0}`, icon: Zap, shadow: 'shadow-[8px_8px_0px_0px_#cbd5e1]' },
            { label: 'TOTAL RECOGNITION', value: (user.xp || user.totalPoints || 0).toLocaleString(), icon: Trophy, shadow: 'shadow-[8px_8px_0px_0px_#cbd5e1]' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`sketch-card bg-white p-10 border-oxford-blue ${stat.shadow} hover:shadow-[10px_10px_0px_0px_#FF5722] transition-all group relative overflow-hidden cursor-help`}>
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity"><stat.icon className="w-16 h-16 text-oxford-blue rotate-12" /></div>
                <div className="flex items-center gap-8 relative z-10">
                  <div className="h-16 w-16 icon-circle-sketch border-[2px] bg-slate-50 group-hover:bg-oxford-blue transition-colors">
                    <stat.icon className="w-8 h-8 text-oxford-blue group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic">{stat.label}</p>
                    <p className="text-4xl font-black text-oxford-blue title-fredoka leading-none tracking-tighter italic">{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Augmented Badge Gallery (Validated Records) */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-4 border-l-[4px] border-orange-500">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-oxford-blue title-fredoka italic uppercase leading-none">
                VALIDATED <span className="text-orange-500">BADGES</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Institutional Certification Library</p>
            </div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] bg-white sketch-card border-oxford-blue px-4 py-2 opacity-50">SECTOR_ARCHIVE: ACTIVE</div>
          </div>
          
          {(!user.badges || user.badges.length === 0) ? (
            <div className="py-32 bg-white sketch-card border-oxford-blue border-dashed shadow-[15px_15px_0px_0px_#cbd5e1] text-center">
              <Beaker className="w-20 h-20 text-slate-200 mx-auto mb-8" />
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs italic px-10 leading-loose mx-auto max-w-2xl">
                "No merit signatures detected. Execute mission directives to unlock institutional certifications."
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {user.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: i * 0.05 }}
                >
                  <div className="sketch-card bg-white p-10 border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] hover:shadow-[10px_10px_0px_0px_#FF5722] hover:-translate-y-2 transition-all group cursor-pointer relative overflow-hidden flex flex-col items-center gap-8 h-full">
                    {/* Security Watermark */}
                    <div className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-5 transition-opacity">
                       <Microscope className="w-24 h-24 text-oxford-blue -rotate-12" />
                    </div>
                    
                    <div className="h-24 w-24 icon-circle-sketch border-[3px] bg-slate-50 group-hover:bg-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] group-hover:shadow-[4px_4px_0px_0px_#FF5722] transition-all flex items-center justify-center relative z-10">
                      <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:text-white">
                        {getBadgeIcon(badge)}
                      </div>
                    </div>
                    
                    <div className="text-center space-y-3 relative z-10 w-full">
                      <span className="block font-black text-oxford-blue uppercase tracking-tighter text-lg title-fredoka italic group-hover:text-orange-500 transition-colors">
                        {badge.toUpperCase()}
                      </span>
                      <div className="h-[2px] w-12 bg-slate-100 mx-auto group-hover:bg-orange-200 group-hover:w-full transition-all duration-500" />
                      <div className="flex items-center justify-center gap-2 text-[9px] text-slate-300 font-black uppercase tracking-widest italic pt-2">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED_RECORD
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 overflow-hidden">
                       <div className="h-full bg-orange-500 w-full -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    </div>
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
