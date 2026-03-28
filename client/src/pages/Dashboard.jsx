import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card3D } from '../components/Card3D';
import { Play, TrendingUp, Award, Zap, ArrowRight, Target, MessageSquare, X, ShieldCheck, Cpu, Globe, Rocket } from 'lucide-react';
import { useState } from 'react';
import ReviewForm from '../components/ReviewForm';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  if (!user) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md"
          >
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full p-2 shadow-lg z-10 border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <ReviewForm onClose={() => setShowReviewModal(false)} />
          </motion.div>
        </div>
      )}

      {/* Welcome Hero - Elite Command Concept */}
      <motion.div 
        variants={item}
        className="relative overflow-hidden rounded-[40px] glass-panel p-8 sm:p-16 border border-white/10 shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700" />
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-12">
          <div className="space-y-6 text-center xl:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
               <ShieldCheck className="w-4 h-4" />
               System Authenticated
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter leading-none">
              COMMAND <span className="text-gradient">CENTER</span>,<br /> 
              {user.name.toUpperCase()}
            </h1>
            <p className="text-gray-400 text-lg max-w-xl font-medium leading-relaxed">
              Your engineering progress is synchronized. Deploy your skills in the BattleGround or master new tech stacks.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
             <button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 px-8 py-5 rounded-2xl glass-panel border border-white/5 text-white font-black uppercase tracking-widest hover:border-indigo-500/50 hover:bg-white/5 transition-all active:scale-95 text-xs flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Intelligence Feedback
            </button>
            <Link
              to="/quizzes"
              className="flex-1 px-8 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95 text-xs flex items-center justify-center gap-3"
            >
              <Rocket className="w-5 h-5" />
              Initialize Session
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Optimized Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Target, label: 'XP Power', val: user.totalPoints || 1250, color: 'text-indigo-400', bColor: 'border-indigo-500' },
          { icon: Zap, label: 'Consecutive', val: `${user.streak || 14} Days`, color: 'text-amber-400', bColor: 'border-amber-500' },
          { icon: Award, label: 'Certifications', val: user.badges?.length || 5, color: 'text-purple-400', bColor: 'border-purple-500' },
          { icon: TrendingUp, label: 'Technique', val: `${user.quizzesAttempted?.length || 12} Labs`, color: 'text-emerald-400', bColor: 'border-emerald-500' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card3D className={`glass-panel p-8 rounded-[32px] border-l-4 ${stat.bColor} shadow-3xl hover:bg-white/5 transition-all`}>
              <div className="flex items-center gap-5">
                <div className={`p-4 bg-white/5 rounded-2xl ${stat.color} border border-white/5`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-white italic leading-none">{stat.val}</p>
                </div>
              </div>
            </Card3D>
          </motion.div>
        ))}
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div variants={item} className="lg:col-span-8 glass-panel p-8 sm:p-12 rounded-[40px] border border-white/5">
          <div className="flex items-center justify-between mb-10">
             <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-wider mb-1">Growth Trajectory</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none">Last 7 operational cycles</p>
             </div>
             <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-indigo-400"><TrendingUp className="w-6 h-6" /></div>
          </div>
          <div className="h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: '01', xp: 400 }, { name: '02', xp: 300 }, { name: '03', xp: 550 },
                { name: '04', xp: 450 }, { name: '05', xp: 600 }, { name: '06', xp: 800 },
                { name: '07', xp: user.totalPoints || 950 }
              ]}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff" opacity={0.03} vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0b14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorXp)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 glass-panel p-8 sm:p-12 rounded-[40px] border border-white/5 flex flex-col">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-white italic uppercase tracking-wider">Skill HUD</h3>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-purple-400"><Cpu className="w-6 h-6" /></div>
           </div>
           <div className="flex-1 flex items-center justify-center">
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                   { subject: 'ALGO', A: 120 }, { subject: 'DEV', A: 98 }, { subject: 'STYLE', A: 86 },
                   { subject: 'DATA', A: 99 }, { subject: 'SQL', A: 85 }, { subject: 'UX', A: 65 }
                 ]}>
                   <PolarGrid stroke="#fff" opacity={0.05} />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: '900' }} />
                   <Radar name="Unit Capability" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.2} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Strategic Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <motion.div variants={item} className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">Priority Labs</h2>
            <Link to="/quizzes" className="text-xs font-black text-indigo-400 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
              Access All Data <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['React Design Patterns', 'Advanced ES2024 Node', 'System Architecture Elite', 'CyberSec Foundations'].map((title, i) => (
              <motion.div key={i} variants={item}>
                <Card3D className="glass-panel p-6 rounded-[32px] border border-white/5 hover:border-indigo-500/30 group cursor-pointer transition-all overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><Globe className="w-16 h-16" /></div>
                   <Link to="/quizzes" className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#1e293b]/50 flex items-center justify-center font-black text-indigo-400 border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                        {title.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-white italic tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{title}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Difficulty: Tier 3 • +250 XP</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                      <Play className="w-4 h-4 text-indigo-400 fill-current" />
                    </div>
                  </Link>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contribution Terminal */}
        <motion.div variants={item} className="lg:col-span-4 glass-panel p-10 rounded-[40px] border border-white/5 flex flex-col justify-center items-center text-center space-y-8 overflow-hidden group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl relative">
               <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <Cpu className="w-12 h-12 text-indigo-500 animate-shimmer" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-wider mb-3">Architect Mode</h3>
              <p className="text-gray-500 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em] max-w-[200px] mx-auto">
                Engineer your own custom challenges. Earn 'Distinguished Contributor' status.
              </p>
            </div>
            <Link 
              to="/create-quiz"
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 hover:border-indigo-500/40 transition-all active:scale-95 shadow-lg"
            >
              Start Architecture
            </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
