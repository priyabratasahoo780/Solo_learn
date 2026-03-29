import { useState, useMemo, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Search, Filter, Play, Code2, Database, Coffee, Layers, Globe, Lock, Unlock, Coins, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Layers },
  { name: 'HTML', icon: Globe },
  { name: 'CSS', icon: Code2 },
  { name: 'JavaScript', icon: Code2 },
  { name: 'ReactJS', icon: Code2 },
  { name: 'NextJs', icon: Code2 },
  { name: 'AngularJS', icon: Code2 },
  { name: 'Java', icon: Coffee },
  { name: 'SQL', icon: Database },
  { name: 'NoSQL', icon: Database },
];

const QuizList = () => {
  const { user, refreshUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [unlockingId, setUnlockingId] = useState(null);
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await api.get('/quizzes');
        setQuizzes(data.data);
      } catch (err) {
        console.error('Failed to fetch quizzes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleUnlock = async (quiz) => {
    if (unlockingId) return;
    
    if (user.coins < quiz.unlockCost) {
      toast.error(`Not enough coins! You need ${quiz.unlockCost} coins.`);
      return;
    }

    if (!confirm(`Unlock "${quiz.title}" for ${quiz.unlockCost} coins?`)) return;

    setUnlockingId(quiz._id);
    try {
      await api.post(`/quizzes/${quiz._id}/unlock`);
      await refreshUser();
      toast.success(`"${quiz.title}" unlocked!`);
    } catch (err) {
      console.error('Unlock failed', err);
      toast.error(err.response?.data?.message || 'Unlock failed');
    } finally {
      setUnlockingId(null);
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || quiz.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [quizzes, searchTerm, activeCategory]);

  return (
    <div className="space-y-12 pb-24">
      {/* Academy Header & Control Module */}
      <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-10 border-b-[3px] border-dashed border-slate-200 pb-12">
        <div className="space-y-4 max-w-2xl">
          <div className="badge-sketch bg-oxford-blue text-white shadow-[4px_4px_0px_0px_#FF5722]">Knowledge Labs Node</div>
          <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">
            LECTURE <span className="text-orange-500">CHALLENGES</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs leading-relaxed">
            Test your expertise across the full stack. Earn academic credits, unlock masterclasses, and climb the institutional leaderboard.
          </p>
        </div>
        
        <div className="w-full xl:w-[450px] relative group">
          <div className="absolute inset-0 bg-orange-500 rounded-2xl translate-x-1.5 translate-y-1.5 group-focus-within:translate-x-2 group-focus-within:translate-y-2 transition-all opacity-20" />
          <div className="relative flex items-center bg-white border-[3px] border-oxford-blue rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#cbd5e1] group-focus-within:shadow-[8px_8px_0px_0px_#FF5722] transition-all">
            <Search className="absolute left-5 text-oxford-blue w-6 h-6" />
            <input
              type="text"
              placeholder="Query study module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent py-5 pl-14 pr-6 text-oxford-blue font-black placeholder:text-slate-300 focus:outline-none text-sm italic tracking-tight"
            />
          </div>
        </div>
      </div>

      {/* Specialty Filter Grid */}
      <div className="relative group">
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">
          {CATEGORIES.map((cat) => (
             <button
               key={cat.name}
               onClick={() => setActiveCategory(cat.name)}
               className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-black whitespace-nowrap transition-all snap-start border-[3px]
                 ${activeCategory === cat.name 
                   ? 'bg-oxford-blue text-white border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722] -translate-y-1' 
                   : 'bg-white text-oxford-blue border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] hover:shadow-[6px_6px_0px_0px_#FF5722] hover:-translate-y-0.5'
                 }`}
             >
               <cat.icon className={`w-5 h-5 ${activeCategory === cat.name ? 'text-orange-400' : 'text-slate-400'}`} />
               <span className="italic uppercase tracking-tight">{cat.name}</span>
             </button>
          ))}
        </div>
        {/* Shadow Fades */}
        <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => {
            const isPremium = quiz.isPremium;
            const isLocked = isPremium && user && !user.unlockedQuizzes?.includes(quiz._id);

            return (
              <div key={quiz._id} className="sketch-card p-8 bg-white border-oxford-blue shadow-[10px_10px_0px_0px_#cbd5e1] hover:shadow-[12px_12px_0px_0px_#FF5722] hover:-translate-y-1 flex flex-col justify-between transition-all group min-h-[420px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                   <BookOpen className="w-24 h-24 text-oxford-blue rotate-12" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className={`px-4 py-1.5 rounded-lg border-2 border-oxford-blue text-[10px] font-black uppercase tracking-[0.2em] shadow-[3px_3px_0px_0px_#002D72]
                      ${quiz.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : 
                        quiz.difficulty === 'Intermediate' ? 'bg-orange-50 text-orange-600' : 
                        'bg-rose-50 text-rose-600'}`}>
                      {quiz.difficulty || 'CORE'}
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className="text-oxford-blue/40 text-[10px] font-black uppercase tracking-widest italic">{quiz.category}</span>
                       {isPremium && (
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-white bg-oxford-blue px-3 py-1 rounded shadow-[3px_3px_0px_0px_#FF5722]">
                           <Sparkles className="w-3 h-3 text-orange-400" />
                           {quiz.unlockCost} CR
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-oxford-blue italic tracking-tighter uppercase leading-tight group-hover:text-orange-500 transition-colors flex items-center gap-3">
                       {quiz.title}
                       {isLocked && <Lock className="w-5 h-5 text-slate-300" />}
                    </h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-3 bg-slate-50/50 p-4 border-2 border-dashed border-slate-200 rounded-xl italic">
                      "{quiz.description}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t-[3px] border-dashed border-slate-100 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="icon-circle-sketch h-8 w-8 border-2 shadow-[2px_2px_0px_0px_#cbd5e1]">
                       <Layers className="w-4 h-4 text-oxford-blue" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{quiz.questions?.length || 0} MODULES</span>
                  </div>
                  
                  {isLocked ? (
                    <button
                      onClick={() => handleUnlock(quiz)}
                      disabled={unlockingId === quiz._id}
                      className="btn-sketch py-3 px-6 text-[10px] bg-slate-800 border-oxford-blue shadow-[4px_4px_0px_0px_#002D72]"
                    >
                      {unlockingId === quiz._id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          AUTHORIZE ACCESS
                        </div>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={`/quizzes/${quiz._id}`}
                      className="btn-sketch py-3 px-8 text-[10px]"
                    >
                      BEGIN SESSION <ChevronRight className="w-5 h-5 text-orange-400" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        ) : (
           <div className="col-span-full py-32 text-center sketch-card bg-white border-dashed shadow-[10px_10px_0px_0px_#cbd5e1]">
              <div className="icon-circle-sketch h-24 w-24 mx-auto bg-slate-50 border-oxford-blue mb-8">
                 <Filter className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-3xl font-black text-oxford-blue italic tracking-tighter uppercase mb-4">No Study Records Identified</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">Try a different Specialty or clear your query parameters.</p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('All');}}
                className="btn-sketch-outline py-4 px-10"
              >
                RESET RESEARCH PANEL
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
