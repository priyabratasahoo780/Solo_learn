import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  Compass, Map, Target, Flag, CheckCircle2, 
  Circle, ChevronRight, Loader2, Sparkles, 
  AlertTriangle, Briefcase, 
  Cpu, Rocket, Trophy, Layout, Search, X,
  ShieldCheck, Beaker, Microscope, PenTool
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
      const res = await api.get('/career/me');
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
      const res = await api.post('/career/generate', { 
        dreamJob, 
        targetCompany 
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
      const res = await api.put('/career/task/complete', { 
        day, 
        taskName 
      });
      setRoadmap(res.data.data);
    } catch (err) {
      toast.error('Failed to update task progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 relative overflow-hidden">
         <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
         <div className="text-center space-y-4">
            <div className="icon-circle-sketch h-20 w-20 border-[3px] mx-auto bg-white shadow-[6px_6px_0px_0px_#FF5722] animate-bounce">
               <Microscope className="w-10 h-10 text-oxford-blue" />
            </div>
            <p className="text-oxford-blue font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">ANALYZING_FUTURE_ARCHITECTURE...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-slate-50 relative overflow-hidden">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
      <h1 className="sr-only">Sketch Academy AI Career Architect - Institutional Learning Path</h1>
      
      <div className="max-w-[1700px] mx-auto relative z-10">
        
        {!roadmap || isGenerating ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto sketch-card bg-white p-12 lg:p-20 border-oxford-blue shadow-[20px_20px_0px_0px_#FF5722] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[6px] bg-oxford-blue" />
            
            {isGenerating ? (
              <div className="py-16 space-y-10">
                 <div className="relative w-40 h-40 mx-auto">
                    <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-[6px] border-t-orange-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Cpu className="w-14 h-14 text-oxford-blue" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-4xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka leading-none">AI ARCHITECTING</h2>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest italic leading-relaxed px-6">"Synthesizing institutional performance metrics with enterprise requirements for <span className="text-orange-500 underline decoration-dashed decoration-2">{dreamJob}</span>."</p>
                 </div>
                 <div className="flex justify-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-0" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-150" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-300" />
                 </div>
              </div>
            ) : (
              <>
                <div className="icon-circle-sketch h-24 w-24 bg-slate-50 border-[4px] mx-auto mb-10 shadow-[8px_8px_0px_0px_#FF5722]">
                   <Compass className="w-10 h-10 text-oxford-blue group-hover:text-orange-500 transition-colors" />
                </div>
                <div className="space-y-4 mb-12">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxford-blue text-white text-[9px] font-black uppercase tracking-[0.2em] border-2 border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722] mx-auto">
                     <Target className="w-3 h-3 text-orange-400 fill-orange-400" />
                     FUTURE_MAPPING_UNIT: 1.0
                   </div>
                   <h1 className="text-5xl font-black text-oxford-blue tracking-tighter italic uppercase title-fredoka leading-none">
                     AI CAREER <span className="text-orange-500 underline underline-offset-4 decoration-dashed">ARCHITECT</span>
                   </h1>
                   <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] italic px-10 leading-loose">Input your dream job, and our AI will build a personalized 30-day Valor Roadmap based on your current institutional data.</p>
                </div>
                
                <form onSubmit={generateRoadmap} className="space-y-6">
                   <div className="sketch-card bg-slate-50 border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] p-1 flex items-center group focus-within:shadow-[8px_8px_0px_0px_#FF5722] transition-all">
                      <div className="px-6 py-2 border-r-[3px] border-dashed border-oxford-blue">
                         <Briefcase className="w-6 h-6 text-oxford-blue" />
                      </div>
                      <input 
                        type="text"
                        placeholder="DREAM JOB (E.G. SR BACKEND ENGINEER)"
                        value={dreamJob}
                        onChange={(e) => setDreamJob(e.target.value)}
                        className="w-full bg-transparent px-6 py-4 text-oxford-blue placeholder:text-slate-300 focus:outline-none text-xs font-black uppercase tracking-widest italic"
                      />
                   </div>
                   <div className="sketch-card bg-slate-50 border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] p-1 flex items-center group focus-within:shadow-[8px_8px_0px_0px_#FF5722] transition-all">
                      <div className="px-6 py-2 border-r-[3px] border-dashed border-oxford-blue">
                         <Layout className="w-6 h-6 text-oxford-blue" />
                      </div>
                      <input 
                        type="text"
                        placeholder="TARGET COMPANY (OPTIONAL - META, STRIPE)"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        className="w-full bg-transparent px-6 py-4 text-oxford-blue placeholder:text-slate-300 focus:outline-none text-xs font-black uppercase tracking-widest italic"
                      />
                   </div>
                   <button 
                    type="submit"
                    className="btn-sketch w-full py-6 text-sm bg-oxford-blue text-white shadow-[12px_12px_0px_0px_#FF5722] group"
                   >
                     ARCHITECT MY FUTURE <Rocket className="w-5 h-5 ml-4 text-orange-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </form>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Stats & Analysis */}
            <div className="lg:col-span-4 space-y-10">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="sketch-card bg-white p-10 border-oxford-blue shadow-[15px_15px_0px_0px_#FF5722] text-center relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                     <Target className="w-32 h-32 text-oxford-blue" />
                  </div>

                  <div className="space-y-8 mb-10 relative z-10">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] italic leading-none underline decoration-orange-400 decoration-2 underline-offset-4">Readiness Score</div>
                    <div className="relative w-40 h-40 mx-auto group cursor-help">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="white" className="text-slate-50 transition-colors group-hover:text-slate-100" />
                          <motion.circle 
                             cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                             strokeDasharray={2 * Math.PI * 72}
                             initial={{ strokeDashoffset: 2 * Math.PI * 72 }}
                             animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - roadmap.readinessScore / 100) }}
                             transition={{ duration: 2, ease: "easeOut" }}
                             className="text-oxford-blue" 
                          />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center border-[3px] border-oxford-blue rounded-full m-4 shadow-inner">
                          <div className="flex flex-col items-center">
                             <span className="text-5xl font-black text-oxford-blue title-fredoka leading-none tracking-tighter italic">{roadmap.readinessScore}</span>
                             <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest title-fredoka">PERCENT_UNIT</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-8 border-t-[3px] border-dashed border-slate-100">
                    <h2 className="text-3xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka leading-tight">
                       {roadmap.dreamJob}
                    </h2>
                    <div className="badge-sketch inline-block bg-slate-50 border-oxford-blue text-oxford-blue py-2 px-6">
                       {roadmap.targetCompany || 'TOP MNC CLUSTER'}
                    </div>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="sketch-card bg-white p-10 border-oxford-blue shadow-[15px_15px_0px_0px_#cbd5e1]"
               >
                  <h4 className="text-2xl font-black text-oxford-blue italic flex items-center gap-3 mb-10 title-fredoka uppercase tracking-tighter underline">
                     <Sparkles className="w-6 h-6 text-orange-500" />
                     Elite Analysis
                  </h4>
                  
                  <div className="space-y-10">
                     <div className="space-y-5">
                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3 italic">
                           <Trophy className="w-4 h-4 text-oxford-blue" /> Institutional Strengths
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {roadmap.analysis.strengths.map((str, i) => (
                              <span key={i} className="badge-sketch bg-white border-oxford-blue text-oxford-blue text-[9px] py-2 px-4 italic hover:bg-oxford-blue hover:text-white transition-colors cursor-help">
                                 {str}
                              </span>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-5">
                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3 italic">
                           <AlertTriangle className="w-4 h-4 text-orange-500" /> Focus Development Areas
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {roadmap.analysis.weaknesses.map((weak, i) => (
                              <span key={i} className="badge-sketch bg-slate-50 border-dashed border-oxford-blue text-slate-500 text-[9px] py-2 px-4 italic hover:border-orange-500 hover:text-orange-500 transition-colors cursor-help">
                                 {weak}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>

               <button 
                 onClick={() => setRoadmap(null)}
                 className="w-full py-5 sketch-card border-oxford-blue text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic hover:text-white hover:bg-oxford-blue hover:shadow-[10px_10px_0px_0px_#FF5722] transition-all flex items-center justify-center gap-3 group"
               >
                  RECONFIGURE ARCHITECT <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            {/* Right Column: Roadmap Timeline (Deployment path) */}
            <div className="lg:col-span-8 space-y-12">
               <div className="flex justify-between items-end border-b-[3px] border-dashed border-slate-200 pb-8 px-4">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka leading-none">VALOR <span className="text-orange-500 underline">PATHWAY</span></h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-none">Master 30-Day Specialized Deployment Strategy</p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-[2px] border-oxford-blue sketch-card text-[10px] font-black uppercase tracking-widest italic text-oxford-blue">
                     <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#FF5722]" />
                     ACTIVE_DEPLOYMENT_ACTIVE
                  </div>
               </div>

               <div className="space-y-10">
                  {roadmap.roadmap.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                       {/* Connection Line */}
                       {idx !== roadmap.roadmap.length - 1 && (
                         <div className="absolute left-10 top-24 bottom-[-40px] w-[3px] border-l-[3px] border-dashed border-slate-200 pointer-events-none" />
                       )}

                       <div className="flex flex-col md:flex-row gap-10">
                          <div className="w-20 h-20 icon-circle-sketch border-[3px] border-oxford-blue bg-white flex flex-col items-center justify-center shrink-0 group hover:bg-oxford-blue transition-all cursor-help relative z-10 shadow-[6px_6px_0px_0px_#cbd5e1] group-hover:shadow-[6px_6px_0px_0px_#FF5722]">
                             <div className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1 group-hover:text-orange-300">Phase</div>
                             <div className="text-2xl font-black text-oxford-blue italic leading-none title-fredoka group-hover:text-white">{step.day}</div>
                          </div>

                          <div className="flex-1 space-y-6">
                             <div className="flex items-center gap-4">
                                <h4 className="text-2xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka leading-none">{step.title}</h4>
                                <div className="h-[2px] bg-slate-100 flex-1" />
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {step.tasks.map((task, tidx) => (
                                   <div 
                                     key={tidx}
                                     onClick={() => toggleTask(step.day, task.taskName)}
                                     className={`sketch-card p-6 border-oxford-blue cursor-pointer transition-all group/task ${
                                       task.isCompleted 
                                       ? 'bg-slate-50 border-dashed opacity-70' 
                                       : 'bg-white shadow-[6px_6px_0px_0px_#cbd5e1] hover:shadow-[8px_8px_0px_0px_#FF5722] hover:-translate-y-1'
                                     }`}
                                   >
                                      <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-3">
                                            {task.isCompleted ? (
                                              <div className="h-6 w-6 border-[2px] border-oxford-blue bg-oxford-blue rounded-full flex items-center justify-center">
                                                 <CheckCircle2 className="w-4 h-4 text-orange-400" />
                                              </div>
                                            ) : (
                                              <Circle className="w-6 h-6 text-slate-200 group-hover/task:text-oxford-blue transition-colors" />
                                            )}
                                            <span className={`text-xs font-black uppercase tracking-widest italic ${task.isCompleted ? 'text-slate-300 line-through' : 'text-oxford-blue'}`}>{task.taskName}</span>
                                         </div>
                                         <div className="h-8 w-8 icon-circle-sketch border-[1px] opacity-10 group-hover/task:opacity-50 transition-all">
                                            <PenTool className="w-4 h-4" />
                                         </div>
                                      </div>
                                      <div className="flex items-center justify-between border-t-[2px] border-dashed border-slate-50 pt-4">
                                         <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${task.isCompleted ? 'text-slate-300' : 'text-slate-400 group-hover/task:text-orange-500'}`}>
                                            PROTOCOL_{task.taskType.toUpperCase()}
                                         </span>
                                         {task.isCompleted && <span className="text-[8px] font-black italic text-orange-400 underline decoration-2">VALIDATED</span>}
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
               
               {/* Final Mission Objective Badge */}
               <div className="pt-10">
                  <div className="sketch-card bg-oxford-blue p-10 text-center border-oxford-blue shadow-[15px_15px_0px_0px_#FF5722] relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-500" />
                     <Trophy className="w-16 h-16 text-white mx-auto mb-6 opacity-20" />
                     <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter title-fredoka mb-4">Final Certification Target</h3>
                     <p className="text-[10px] text-orange-400 font-black uppercase tracking-[0.4em] italic leading-loose">"Complete the 30-day Valor Path to authorize deep enterprise-grade certification."</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerArchitect;
