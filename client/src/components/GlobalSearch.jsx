import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, BookOpen, User, Zap, Hash, Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Mock results for visual fidelity
  const results = [
    { id: 1, type: 'Quiz', title: 'Advanced React Patterns', category: 'ReactJS', path: '/quizzes/1' },
    { id: 2, type: 'Interview', title: 'Google: MapReduce Logic', category: 'System Design', path: '/interview-prep' },
    { id: 3, type: 'Sandbox', title: 'JavaScript Canvas Playground', category: 'Creation', path: '/sandbox' },
    { id: 4, type: 'Social', title: 'Expert: Python Data Analysis', category: 'Feed', path: '/feed' },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape') onClose(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-start justify-center pt-[15vh] px-4"
        onClick={() => onClose(false)}
      >
        <motion.div
           initial={{ scale: 0.95, y: -20 }}
           animate={{ scale: 1, y: 0 }}
           exit={{ scale: 0.95, y: -20 }}
           className="w-full max-w-2xl glass-panel bg-[#0f1120] border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
           onClick={e => e.stopPropagation()}
        >
           {/* Search Input Area */}
           <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <Search className="w-5 h-5 text-indigo-400 animate-pulse" />
              <input
                autoFocus
                type="text"
                placeholder="Search across SoloLearn Intelligence..."
                className="flex-1 bg-transparent text-white border-none focus:ring-0 text-lg font-medium placeholder:text-gray-600"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                 <Command className="w-3 h-3" /> ESC
              </div>
           </div>

           {/* Results List */}
           <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-4 ml-2">Intelligent Matches</div>
              
              <div className="space-y-2">
                 {results.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => { navigate(res.path); onClose(false); }}
                      className="group flex items-center justify-between p-4 rounded-3xl hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl bg-white/5 transition-all group-hover:scale-110 ${res.type === 'Quiz' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                             {res.type === 'Quiz' ? <Zap className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                          </div>
                          <div>
                             <div className="text-white font-bold group-hover:text-indigo-300 transition-colors">{res.title}</div>
                             <div className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{res.type} &bull; {res.category}</div>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                 ))}

                 {results.length === 0 && (
                    <div className="text-center py-20 text-gray-600">
                       <Hash className="w-12 h-12 mx-auto mb-4 opacity-10" />
                       <p className="font-bold">No exact matches found.</p>
                       <p className="text-xs">Try searching for keywords like "React" or "Google".</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Footer Hint */}
           <div className="bg-white/5 p-4 flex items-center justify-between px-8 border-t border-white/5">
              <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold">
                 <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 150+ Quizzes</span>
                 <span className="flex items-center gap-1"><User className="w-3 h-3" /> 500+ Questions</span>
              </div>
              <p className="text-[10px] italic text-gray-600">Press ENTER to select</p>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
