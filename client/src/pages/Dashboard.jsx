import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Play, TrendingUp, Award, Zap, ArrowRight, Target, 
  MessageSquare, X, ShieldCheck, Cpu, Globe, Rocket,
  BookOpen, ChevronRight, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import ReviewForm from '../components/ReviewForm';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
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

  const coursePortals = [
    {
      id: 1,
      title: 'FULLSTACK ARCHITECT',
      icon: <Globe className="w-6 h-6" />,
      description: 'Master the high-fidelity engineering patterns that power modern enterprise-grade applications.',
      features: ['React Design Patterns', 'Advanced Node Scalability', 'System Architecture Elite'],
      cta: 'Initialize Course'
    },
    {
      id: 2,
      title: 'RECRUITMENT ELITE',
      icon: <Target className="w-6 h-6" />,
      description: 'Navigate the elite engineering recruitment cycles with strategic technical preparations.',
      features: ['AI Mock Simulations', 'Intel-Driven Data Prep', 'Global Skill Rankings'],
      cta: 'Start Preparation'
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-16 pb-24"
    >
      {/* Welcome Header (Sketch Style) */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12">
        <div className="space-y-4">
          <div className="badge-sketch">Academic Session Active</div>
          <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter leading-none">
            COMMAND <span className="text-orange-500">CENTER</span>,<br /> 
            {user.name.toUpperCase()}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs">Student ID: #SK-{user._id?.slice(-6).toUpperCase() || 'UNAUTH'}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowReviewModal(true)} className="btn-sketch-outline py-4 px-6 text-[10px]"><MessageSquare className="w-4 h-4" /> SUBMIT FEEDBACK</button>
          <Link to="/quizzes" className="btn-sketch py-4 px-8 text-[10px]">NEW SESSION <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </motion.div>

      {/* Strategic Stats Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Target, label: 'XP Intelligence', val: user.totalPoints || 1250, color: 'text-oxford-blue' },
          { icon: Zap, label: 'Session Streak', val: `${user.streak || 14} Days`, color: 'text-orange-500' },
          { icon: Award, label: 'Certifications', val: user.badges?.length || 5, color: 'text-oxford-blue' },
          { icon: TrendingUp, label: 'Technique Mastery', val: `${user.quizzesAttempted?.length || 12} Labs`, color: 'text-oxford-blue' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <div className="sketch-card p-8 group">
              <div className="flex items-center gap-6">
                <div className={`icon-circle-sketch ${stat.color} bg-white shadow-[4px_4px_0px_0px_#cbd5e1] group-hover:bg-oxford-blue group-hover:text-white transition-all`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-oxford-blue italic leading-none">{stat.val}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div variants={item} className="lg:col-span-8 sketch-card p-10 lg:p-14 relative overflow-hidden bg-white">
          <div className="absolute inset-0 sketch-grid opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-black text-oxford-blue italic uppercase tracking-wider leading-none">Intelligence Growth</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">Statistical XP propagation hub</p>
               </div>
               <div className="icon-circle-sketch h-12 w-12 border-2"><TrendingUp className="w-5 h-5" /></div>
            </div>
            <div className="h-80 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: '01', xp: 400 }, { name: '02', xp: 300 }, { name: '03', xp: 550 },
                  { name: '04', xp: 450 }, { name: '05', xp: 600 }, { name: '06', xp: 800 },
                  { name: '07', xp: user.totalPoints || 950 }
                ]}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#002D72" opacity={0.1} vertical={false} />
                  <XAxis dataKey="name" stroke="#002D72" fontSize={10} tickLine={false} axisLine={false} dy={10} fontStyle="italic" fontWeight="900" />
                  <YAxis stroke="#002D72" fontSize={10} tickLine={false} axisLine={false} dx={-10} fontWeight="900" />
                  <Tooltip 
                    contentStyle={{ border: '3px solid #002D72', borderRadius: '16px', fontWeight: '900', color: '#002D72', boxShadow: '4px 4px 0px 0px #FF5722' }}
                  />
                  <Area type="step" dataKey="xp" stroke="#002D72" strokeWidth={4} fill="#002D72" fillOpacity={0.05} animationDuration={2500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4 sketch-card p-10 lg:p-14 relative overflow-hidden flex flex-col items-center">
           <div className="absolute inset-0 sketch-grid opacity-10" />
           <div className="relative z-10 w-full text-center">
             <div className="flex flex-col items-center gap-6 mb-12">
                <div className="icon-circle-sketch h-14 w-14 border-2"><Cpu className="w-6 h-6" /></div>
                <h3 className="text-2xl font-black text-oxford-blue italic uppercase tracking-wider">Skill Mapping</h3>
             </div>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                   { subject: 'ALGO', A: 120 }, { subject: 'DEV', A: 98 }, { subject: 'STYLE', A: 86 },
                   { subject: 'DATA', A: 99 }, { subject: 'SQL', A: 85 }, { subject: 'UX', A: 65 }
                 ]}>
                   <PolarGrid stroke="#002D72" opacity={0.1} />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#002D72', fontSize: 10, fontWeight: '900' }} />
                   <Radar name="Unit Capability" dataKey="A" stroke="#FF5722" strokeWidth={3} fill="#FF5722" fillOpacity={0.2} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Academic Portals (Exact reference design) */}
      <div className="space-y-10">
        <h2 className="text-3xl font-black text-oxford-blue italic uppercase tracking-[0.2em] px-4">Choose your portal</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {coursePortals.map((portal) => (
            <motion.div key={portal.id} variants={item} className="sketch-card p-12 lg:p-16 flex flex-col group">
               <div className="flex items-center gap-6 mb-8 pb-8 border-b-[2px] border-dashed border-slate-200">
                  <div className="icon-circle-sketch h-16 w-16 text-orange-500 border-orange-500 bg-orange-50">
                    {portal.icon}
                  </div>
                  <h3 className="text-3xl font-black text-oxford-blue tracking-tighter italic">{portal.title}</h3>
               </div>
               
               <p className="text-slate-500 font-bold mb-10 leading-relaxed text-lg">
                 {portal.description}
               </p>

               <div className="space-y-4 mb-12">
                 {portal.features.map((feature, idx) => (
                   <div key={idx} className="flex items-center gap-4 text-oxford-blue font-black uppercase tracking-widest text-xs">
                      <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      {feature}
                   </div>
                 ))}
               </div>

               <Link to={portal.id === 2 ? '/interview-prep' : '/quizzes'} className="btn-sketch text-lg py-5 mt-auto">
                 {portal.cta} <ArrowRight className="w-6 h-6" />
               </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Review Modal Sketch Style */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-oxford-blue/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-lg"
          >
            <div className="sketch-card p-1">
              <div className="bg-slate-50 p-8 rounded-[28px] relative">
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="absolute -top-4 -right-4 h-12 w-12 bg-white text-oxford-blue border-[3px] border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded-full flex items-center justify-center z-20"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-oxford-blue italic tracking-tighter leading-none mb-3 uppercase">Intelligence Feedback</h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Transmit session data to central academy command</p>
                </div>
                <ReviewForm onClose={() => setShowReviewModal(false)} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;

