import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ShieldCheck, Briefcase, BookOpen, 
  ChevronRight, Bookmark, Building2, Terminal, Zap, 
  ArrowRight, SearchCode, Target, Globe
} from 'lucide-react';

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCompany, setFilterCompany] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const companies = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Meta', 'Netflix'];
  const subjects = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'DSA', 'System Design'];

  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [dailyLoading, setDailyLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
    fetchDailyQuestions();
  }, [filterCompany, filterCategory]);

  const fetchDailyQuestions = async () => {
    setDailyLoading(true);
    try {
      const res = await api.get('/interview-daily/questions');
      setDailyQuestions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch daily questions:', err);
    } finally {
      setDailyLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCompany) params.company = filterCompany;
      if (filterCategory) params.category = filterCategory;
      
      const res = await api.get('/interview/questions', { params });
      setQuestions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch interview questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-24">
      {/* Strategic Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12">
        <div className="space-y-5">
          <div className="badge-sketch">Recruitment Intelligence Hub</div>
          <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter leading-none">
            RECRUITMENT <span className="text-orange-500">INTEL</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs max-w-xl">
            Master the coding interviews of Big Tech with our curated collection of real-world targeted question modules.
          </p>
        </div>
        <div className="icon-circle-sketch h-16 w-16 bg-white shadow-[6px_6px_0px_0px_#cbd5e1]">
          <Briefcase className="w-8 h-8 text-oxford-blue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sketch Filters Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="sketch-card p-10 bg-white sticky top-12">
            <h3 className="text-xl font-black text-oxford-blue uppercase tracking-tight mb-8 flex items-center gap-3">
              <Filter className="w-5 h-5 text-orange-500" />
              Study Filters
            </h3>

            {/* Company Selection */}
            <div className="mb-10">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-4 block">By Enterprise</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterCompany('')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-[2px] ${filterCompany === '' ? 'bg-oxford-blue border-oxford-blue text-white shadow-[3px_3px_0px_0px_#FF5722]' : 'bg-white border-slate-200 text-slate-500 hover:border-oxford-blue hover:text-oxford-blue'}`}
                >
                  ALL
                </button>
                {companies.map(company => (
                  <button
                    key={company}
                    onClick={() => setFilterCompany(company)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-[2px] ${filterCompany === company ? 'bg-oxford-blue border-oxford-blue text-white shadow-[3px_3px_0px_0px_#FF5722]' : 'bg-white border-slate-200 text-slate-500 hover:border-oxford-blue hover:text-oxford-blue'}`}
                  >
                    {company.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Stack Selection */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-4 block">By Intelligence Stack</label>
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => setFilterCategory(subject)}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-between border-[2px] ${filterCategory === subject ? 'bg-oxford-blue border-oxford-blue text-white shadow-[4px_4px_0px_0px_#cbd5e1]' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                  {subject.toUpperCase()}
                  <ChevronRight className={`w-4 h-4 ${filterCategory === subject ? 'text-white' : 'text-slate-300'}`} />
                </button>
              ))}
              <button
                onClick={() => setFilterCategory('')}
                className="w-full text-center py-4 text-[10px] font-black uppercase text-orange-500 hover:underline mt-4 tracking-widest"
              >
                Clear Subjects
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Stream */}
        <div className="lg:col-span-3 space-y-12">
          {/* Daily Spotlight Portal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sketch-card p-12 bg-white relative overflow-hidden group"
          >
             <div className="absolute inset-0 sketch-grid opacity-5" />
             <div className="absolute top-8 right-8 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_12px_#FF5722]"></div>
                <span className="text-[10px] text-oxford-blue font-black uppercase tracking-[0.2em]">Live Intelligence Feed</span>
             </div>
             
             <div className="mb-12 border-b-[2px] border-dashed border-slate-200 pb-8 flex items-center gap-5">
                <div className="icon-circle-sketch bg-orange-50 border-orange-500 text-orange-500">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">MNC Spotlight</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Daily extracted trending challenge modules</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyLoading ? (
                   Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-48 rounded-3xl bg-slate-50 animate-pulse border-2 border-slate-100 italic"></div>
                   ))
                ) : dailyQuestions.slice(0, 6).map((item, i) => (
                   <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="sketch-card p-8 bg-slate-50 border-[2px] border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FF5722] transition-all flex flex-col group cursor-pointer"
                      onClick={() => {
                        setExpandedId(item._id);
                        setSearchTerm(item.question);
                      }}
                   >
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-[10px] font-black text-orange-500 tracking-tighter uppercase leading-none">{item.company}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-oxford-blue/20" />
                      </div>
                      <p className="text-sm font-bold text-oxford-blue leading-relaxed mb-6 flex-1 line-clamp-3">
                        {item.question}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-oxford-blue/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">View Module</span>
                        <ArrowRight className="w-4 h-4 text-oxford-blue group-hover:translate-x-1 transition-transform" />
                      </div>
                   </motion.div>
                ))}
             </div>
          </motion.div>

          {/* Search Hub */}
          <div className="relative group">
            <SearchCode className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-oxford-blue/20 group-focus-within:text-oxford-blue transition-colors" />
            <input
              type="text"
              placeholder="Search by intelligence stack, enterprise, or concept module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-[3px] border-oxford-blue rounded-3xl py-7 pl-20 pr-10 text-oxford-blue font-black tracking-tight focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all placeholder:text-slate-200 text-lg shadow-[8px_8px_0px_0px_#cbd5e1]"
            />
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="sketch-card p-20 text-center bg-white border-dashed">
                <div className="w-12 h-12 border-4 border-oxford-blue border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-oxford-blue font-black uppercase tracking-widest text-xs">Syncing Recruitment Data...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="sketch-card p-24 text-center bg-white border-dashed">
                <div className="icon-circle-sketch h-16 w-16 mx-auto mb-8 bg-slate-50 text-slate-300 border-slate-200">
                  <Building2 className="w-8 h-8" />
                </div>
                <p className="text-oxford-blue font-black text-2xl uppercase italic tracking-tighter">No Active Intel Found</p>
                <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest">Adjust study filters for deeper coverage.</p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={q._id}
                  className={`sketch-card transition-all duration-300 overflow-hidden ${expandedId === q._id ? 'border-orange-500 shadow-[8px_8px_0px_0px_#002D72]' : 'bg-white'}`}
                >
                  <div 
                    onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                    className="p-10 cursor-pointer group hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1 space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1.5 rounded-lg bg-oxford-blue text-white text-[10px] font-black uppercase tracking-[0.2em]">{q.category}</span>
                          {q.companies.map(c => (
                            <span key={c} className="px-3 py-1.5 rounded-lg bg-orange-100 border-[2px] border-orange-500 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em]">{c}</span>
                          ))}
                        </div>
                        <h4 className="text-2xl font-black text-oxford-blue group-hover:text-orange-500 transition-colors tracking-tight leading-none italic">
                          {q.question}
                        </h4>
                      </div>
                      <div className={`icon-circle-sketch h-12 w-12 transition-all duration-300 ${expandedId === q._id ? 'bg-oxford-blue text-white rotate-90 border-oxford-blue' : 'bg-white text-oxford-blue group-hover:bg-slate-50'}`}>
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === q._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t-[3px] border-oxford-blue bg-slate-50 p-12 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="icon-circle-sketch h-10 w-10 bg-white shadow-[3px_3px_0px_0px_#cbd5e1]">
                                <Terminal className="w-5 h-5 text-oxford-blue" />
                              </div>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.3em]">Module Solution Feed</span>
                            </div>
                            <div className="sketch-card bg-white p-8 border-[2px] shadow-[4px_4px_0px_0px_#cbd5e1] relative">
                               <p className="text-oxford-blue leading-relaxed font-bold text-xl italic leading-relaxed">
                                 "{q.answer}"
                               </p>
                            </div>
                          </div>
                          
                          <div className="md:w-64 space-y-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Complexity Rank</label>
                               <div className={`sketch-card p-4 text-center font-black uppercase tracking-widest text-xs border-[2px] ${q.difficulty === 'Advanced' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-oxford-blue border-oxford-blue'}`}>
                                 {q.difficulty} LEVEL
                               </div>
                            </div>
                            <div className="flex flex-col gap-3">
                               <button className="btn-sketch py-4 px-6 text-[10px]"><Bookmark className="w-4 h-4" /> SAVE TO SYLLABUS</button>
                               <button className="btn-sketch-outline py-4 px-6 text-[10px]"><BookOpen className="w-4 h-4" /> CONTEXT PRACTICE</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
