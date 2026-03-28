import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Compass, Map, Target, Flag, CheckCircle2, 
  Circle, ChevronRight, Loader2, Sparkles, 
  TrendingUp, AlertTriangle, Briefcase, 
  Cpu, Rocket, Trophy, Layout, Search, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:4000/api';

const CareerArchitect = () => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [dreamJob, setDreamJob] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/career/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.data) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap');
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async (e) => {
    e.preventDefault();
    if (!dreamJob.trim()) return toast.error('Please enter your dream job role');
    
    setIsGenerating(true);
    try {
      const res = await axios.post(`${API_URL}/career/generate`, { 
        dreamJob, 
        targetCompany 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRoadmap(res.data.data);
      toast.success('Your Career Roadmap has been architected!');
    } catch (err) {
      toast.error('AI Architect is currently overloaded. Try again in a minute.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = async (day, taskName) => {
    try {
      const res = await axios.put(`${API_URL}/career/task/complete`, { 
        day, 
        taskName 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRoadmap(res.data.data);
    } catch (err) {
      toast.error('Failed to update task progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0a0b14]">
         <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading Your Future...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#0a0b14]">
      <h1 className="sr-only">SoloLearn AI Career Architect - Personalized Learning Roadmaps</h1>
      <div className="max-w-6xl mx-auto">
        
        {!roadmap || isGenerating ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto glass-panel p-12 rounded-[3.5rem] border-white/5 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x" />
            
            {isGenerating ? (
              <div className="py-12">
                 <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-t-indigo-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Cpu className="w-10 h-10 text-indigo-400" />
                    </div>
                 </div>
                 <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">AI Architecting...</h2>
                 <p className="text-gray-500 text-sm font-medium">Synthesizing your performance data with industry requirements for <span className="text-indigo-400">{dreamJob}</span>.</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                   <Compass className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase">AI Career <span className="text-indigo-500">Architect</span></h1>
                <p className="text-gray-500 mb-10 font-medium text-sm">Input your dream job, and our AI will build a personalized 30-day roadmap based on your current skill radar.</p>
                
                <form onSubmit={generateRoadmap} className="space-y-4">
                   <div className="relative group">
                      <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Dream Job (e.g. Senior Backend Engineer)"
                        value={dreamJob}
                        onChange={(e) => setDreamJob(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                      />
                   </div>
                   <div className="relative group">
                      <Layout className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Target Company (Optional - e.g. Meta, Stripe)"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                      />
                   </div>
                   <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all mt-6 flex items-center justify-center gap-2 group"
                   >
                     Architect My Future <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </form>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Stats & Analysis */}
            <div className="lg:col-span-4 space-y-6">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="glass-panel p-8 rounded-[3rem] border-white/5 text-center relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Target className="w-24 h-24" />
                  </div>

                  <div className="mb-6">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-2">Readiness Score</div>
                    <div className="relative w-32 h-32 mx-auto">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <motion.circle 
                             cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                             strokeDasharray={2 * Math.PI * 58}
                             initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                             animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - roadmap.readinessScore / 100) }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                             className="text-indigo-500" 
                          />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                          <span className="text-3xl font-black text-white">{roadmap.readinessScore}</span>
                          <span className="text-xs text-gray-500 mt-2">%</span>
                       </div>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-black text-white mb-1 italic uppercase tracking-tighter">
                     {roadmap.dreamJob}
                  </h2>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{roadmap.targetCompany || 'Top MNCs'}</p>
               </motion.div>

               <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-8 rounded-[3rem] border-white/5"
               >
                  <h4 className="text-white font-black italic flex items-center gap-2 mb-6">
                     <Sparkles className="w-4 h-4 text-amber-500" />
                     Elite Analysis
                  </h4>
                  
                  <div className="space-y-6">
                     <div>
                        <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Trophy className="w-3 h-3 text-emerald-500" /> Key Strengths
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {roadmap.analysis.strengths.map((str, i) => (
                              <span key={i} className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 italic">
                                 {str}
                              </span>
                           ))}
                        </div>
                     </div>
                     <div>
                        <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                           <AlertTriangle className="w-3 h-3 text-rose-500" /> Growth Areas
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {roadmap.analysis.weaknesses.map((weak, i) => (
                              <span key={i} className="text-[10px] font-bold text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20 italic">
                                 {weak}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>

               <button 
                 onClick={() => setRoadmap(null)}
                 className="w-full py-4 glass-panel rounded-2xl border-white/5 text-gray-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center justify-center gap-2"
               >
                  Reset Architect <X className="w-3 h-3" />
               </button>
            </div>

            {/* Right Column: Roadmap Timeline */}
            <div className="lg:col-span-8">
               <div className="flex justify-between items-center mb-10 px-4">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Your Master Roadmap</h3>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">30 Day Path Active</span>
                  </div>
               </div>

               <div className="space-y-4">
                  {roadmap.roadmap.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-panel p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group"
                    >
                       <div className="flex flex-col md:flex-row gap-6 md:items-center">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                             <div className="text-2xl font-black text-indigo-400 italic">Day {step.day}</div>
                          </div>
                          <div className="flex-1">
                             <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {step.tasks.map((task, tidx) => (
                                   <div 
                                     key={tidx}
                                     onClick={() => toggleTask(step.day, task.taskName)}
                                     className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                       task.isCompleted 
                                       ? 'bg-emerald-500/10 border-emerald-500/30 line-through text-emerald-500/50' 
                                       : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-300'
                                     }`}
                                   >
                                      <div className="flex items-center gap-3">
                                         {task.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-gray-600" />}
                                         <span className="text-xs font-bold">{task.taskName}</span>
                                      </div>
                                      <span className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded shadow-inner">
                                         {task.taskType}
                                      </span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CareerArchitect;
