import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldCheck, Briefcase, BookOpen, ChevronRight, Bookmark, Building2, Terminal, Zap, ArrowRight } from 'lucide-react';

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
      const res = await axios.get(`${API_URL}/interview-daily/questions`);
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
      
      const res = await axios.get(`${API_URL}/interview/questions`, { params });
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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0a0b14]">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            Interview Mastery Hub
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Real Questions. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Real Companies.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Master the coding interviews of Big Tech with our curated collection of real, subject-wise, and company-targeted questions.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 sticky top-28">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              Intelligence Filters
            </h3>

            {/* Company Filter */}
            <div className="mb-8">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">By Top Company</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCompany('')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCompany === '' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  All
                </button>
                {companies.map(company => (
                  <button
                    key={company}
                    onClick={() => setFilterCompany(company)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCompany === company ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 block">By Technology Stack</label>
              <div className="grid grid-cols-1 gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setFilterCategory(subject)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${filterCategory === subject ? 'bg-white/10 text-indigo-400 border border-white/10 shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {subject}
                    {filterCategory === subject && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))}
                <button
                  onClick={() => setFilterCategory('')}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-white"
                >
                  Clear Subjects
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="lg:col-span-3 space-y-8">
          {/* Daily MNC Spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-[2.5rem] border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Live AI Refreshing</span>
                </div>
             </div>
             
             <div className="mb-6">
                <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
                   <Zap className="w-5 h-5 text-amber-400" />
                   MNC Daily Hot Picks
                </h3>
                <p className="text-gray-500 text-xs">Trending questions asked at Top MNCs. Updated Every 24 Hours.</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {dailyLoading ? (
                   Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
                   ))
                ) : dailyQuestions.map((item, i) => (
                   <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-2xl bg-white/5 border border-indigo-500/10 hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
                   >
                      <div>
                         <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-indigo-400 tracking-tighter uppercase">{item.company}</span>
                            <span className="text-[8px] text-gray-600 font-bold uppercase">{item.category}</span>
                         </div>
                         <p className="text-[13px] font-bold text-gray-300 group-hover:text-white transition-colors mb-3 line-clamp-3">
                            {item.question}
                         </p>
                      </div>
                      
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                         <button 
                            onClick={() => {
                               setExpandedId(item._id);
                               setSearchTerm(item.question);
                            }}
                            className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 hover:text-white transition-colors"
                         >
                            View Fix <ArrowRight className="w-3 h-3" />
                         </button>
                         <span className="text-[8px] text-gray-600 font-black uppercase">{item.difficulty}</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </motion.div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by topic, company, or concept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-bold">Fetching Interview Data...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
                <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-xl">No Questions Found</p>
                <p className="text-gray-600">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={q._id}
                  className={`glass-panel border rounded-3xl transition-all duration-300 overflow-hidden ${expandedId === q._id ? 'border-indigo-500/30 ring-1 ring-indigo-500/20' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div 
                    onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                    className="p-6 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest">{q.category}</span>
                          {q.companies.map(c => (
                            <span key={c} className="px-2 py-1 rounded bg-white/5 text-gray-500 text-[10px] font-bold border border-white/5">{c}</span>
                          ))}
                        </div>
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-relaxed">
                          {q.question}
                        </h4>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${expandedId === q._id ? 'rotate-90 text-indigo-400' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === q._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-white/[0.02]"
                      >
                        <div className="p-8">
                          <div className="flex items-start gap-4">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                              <Terminal className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-2">Concise Fix</p>
                              <p className="text-gray-300 leading-relaxed font-medium text-lg italic">
                                "{q.answer}"
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                <Bookmark className="w-4 h-4" /> Save to Prep
                              </button>
                              <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                                <BookOpen className="w-4 h-4" /> Practice Concepts
                              </button>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${q.difficulty === 'Advanced' ? 'text-red-400' : q.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {q.difficulty} level
                            </span>
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
