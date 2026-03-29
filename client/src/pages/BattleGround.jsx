import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  Zap, Trophy, Swords, Timer, Coins, 
  Users, User, ArrowRight, Play, 
  AlertCircle, CheckCircle2, X,
  TrendingUp, Shield, Crown, Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BattleGround = () => {
  const { user } = useAuth();
  const [openChallenges, setOpenChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [wager, setWager] = useState(0);
  const [activeDuel, setActiveDuel] = useState(null);
  const [duelStep, setDuelStep] = useState('lobby'); // lobby, playing, result

  useEffect(() => {
    fetchChallenges();
    fetchQuizzes();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await api.get('/challenges/open');
      setOpenChallenges(res.data.data);
    } catch (err) {
      toast.error('Failed to load battle lobby');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.data);
    } catch (err) {
      console.error('Quiz fetch failed');
    }
  };

  const createChallenge = async () => {
    if (!selectedQuiz) return toast.error('Select a target quiz for the duel');
    
    try {
      await api.post('/challenges/create', {
        quizId: selectedQuiz._id,
        pointsWager: wager
      });
      toast.success('Battle challenge posted to the feed!');
      setShowCreateModal(false);
      fetchChallenges();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create challenge');
    }
  };

  const acceptChallenge = async (id) => {
    try {
      const res = await api.put(`/challenges/${id}/accept`, {});
      setActiveDuel(res.data.data);
      setDuelStep('playing');
      toast.success('Entering Arena... Good luck!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join duel');
    }
  };

  if (duelStep === 'playing') {
     return (
        <div className="min-h-screen bg-[#05060b] flex items-center justify-center p-4">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="max-w-xl w-full glass-panel p-12 text-center rounded-[3rem] border-indigo-500/20"
           >
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                 <Swords className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">Arena Initialized</h2>
              <p className="text-gray-500 mb-8 font-medium">You are competing for <span className="text-amber-500 font-black">{activeDuel.pointsWager * 2} Coins</span>. Accuracy and Time are your only allies.</p>
              
              <button 
                onClick={() => {
                   // In a real implementation, this would redirect to QuizPage with Battle context
                   toast.success('Simulation: Redirecting to Battle Engine...');
                   setTimeout(() => setDuelStep('lobby'), 2000);
                }}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
              >
                Enter Combat
              </button>
           </motion.div>
        </div>
     );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0b14]">
      <h1 className="sr-only">SoloLearn PvP BattleGround Arena - 1V1 Specialized Challenges</h1>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                 <Zap className="w-10 h-10 text-indigo-500 fill-indigo-500" />
                 Battle<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Ground</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Elite 1V1 Competitive Arena • Wager & Win</p>
           </motion.div>

           <div className="flex items-center gap-4">
              <div className="glass-panel px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
                 <Coins className="w-5 h-5 text-amber-500" />
                 <span className="text-white font-black">{user?.coins || 0}</span>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                <Swords className="w-4 h-4" /> Create Duel
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Battles Won', val: '12', icon: Trophy, color: 'text-indigo-400' },
             { label: 'Win Rate', val: '68%', icon: TrendingUp, color: 'text-emerald-400' },
             { label: 'Coins Earned', val: '2,450', icon: Coins, color: 'text-amber-400' },
             { label: 'Global Rank', val: '#42', icon: Crown, color: 'text-rose-400' }
           ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-[2.5rem] border-white/5 flex items-center gap-4"
              >
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                    <div className="text-xl font-black text-white">{stat.val}</div>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Duel Lobby */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Active Challenges List */}
           <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center px-4">
                 <h3 className="text-white font-black italic uppercase tracking-tighter">Active Lobby</h3>
                 <span className="text-[10px] text-indigo-400 font-bold uppercase animate-pulse">Live Matchmaking...</span>
              </div>

              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 glass-panel rounded-[2.5rem] animate-pulse"></div>
                 ))
              ) : openChallenges.length === 0 ? (
                 <div className="text-center py-20 glass-panel rounded-[3rem] border-white/5 bg-white/5">
                    <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No active challenges. Create one to start the war.</p>
                 </div>
              ) : openChallenges.map((challenge, i) => (
                 <motion.div 
                   key={challenge._id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="glass-panel p-8 rounded-[3rem] border-white/5 hover:border-indigo-500/20 group transition-all relative overflow-hidden flex flex-col sm:flex-row gap-8 items-center"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Challenger Info */}
                    <div className="text-center sm:text-left min-w-[150px]">
                       <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full mx-auto sm:mx-0 p-1 mb-4 shadow-xl">
                          <div className="w-full h-full bg-[#0a0b14] rounded-full flex items-center justify-center text-white font-black">
                             {challenge.challenger?.name?.charAt(0).toUpperCase()}
                          </div>
                       </div>
                       <h4 className="text-white font-black tracking-tight">{challenge.challenger?.name}</h4>
                       <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Wants War</span>
                    </div>

                    {/* Quiz/Arena Info */}
                    <div className="flex-1 text-center sm:text-left">
                       <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                          <span className="text-[10px] text-indigo-400 font-black uppercase bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
                             {challenge.quizId?.category || 'General'}
                          </span>
                       </div>
                       <h3 className="text-xl font-black text-white mb-2">{challenge.quizId?.title}</h3>
                       <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-500">
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                             <Timer className="w-4 h-4 text-indigo-400" /> 10 mins
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                             <Coins className="w-4 h-4 text-amber-500" /> {challenge.pointsWager} Wager
                          </div>
                       </div>
                    </div>

                    {/* Action */}
                    <button 
                      onClick={() => acceptChallenge(challenge._id)}
                      className="px-8 py-4 bg-white/5 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 group-hover:border-emerald-500/50 transition-all flex items-center gap-2"
                    >
                       Join Duel <Play className="w-3 h-3 fill-white" />
                    </button>
                 </motion.div>
              ))}
           </div>

           {/* Right Sidebar: Rules & Hall of Fame */}
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-panel p-8 rounded-[2.5rem] border-white/5">
                 <h4 className="text-white font-black italic flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    Rules of War
                 </h4>
                 <div className="space-y-4">
                    {[
                      'Matchmaking is strictly asynchronous.',
                      'Highest accuracy wins the wager.',
                      'Total time is the tie-breaker.',
                      'Quitting mid-duel results in forfeit.'
                    ].map((rule, i) => (
                       <div key={i} className="flex gap-3 text-xs text-gray-400 font-medium">
                          <span className="text-indigo-400 font-black tracking-tighter">0{i+1}.</span>
                          {rule}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="glass-panel p-8 rounded-[2.5rem] border-white/5">
                 <h4 className="text-white font-black italic flex items-center gap-2 mb-6 text-amber-400">
                    <Crown className="w-5 h-5" />
                    Elite Dualists
                 </h4>
                 <div className="space-y-4">
                    {[
                      { name: 'Satoshi_Coder', wins: 142 },
                      { name: 'Binary_Beast', wins: 128 },
                      { name: 'NullPointer', wins: 95 }
                    ].map((elite, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-xs text-gray-500">
                                {i+1}
                             </div>
                             <span className="text-sm font-bold text-gray-300">{elite.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-amber-500">{elite.wins} Wins</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Create Duel Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-xl"
               onClick={() => setShowCreateModal(false)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="max-w-xl w-full glass-panel p-8 rounded-[3rem] border-white/5 z-10 relative overflow-hidden"
             >
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Prepare for War</h2>
                   <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <X className="w-6 h-6 text-gray-500" />
                   </button>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block">Target Arena (Quiz)</label>
                      <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                         {quizzes.slice(0, 10).map(quiz => (
                            <div 
                              key={quiz._id}
                              onClick={() => setSelectedQuiz(quiz)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                                selectedQuiz?._id === quiz._id 
                                ? 'bg-indigo-500/20 border-indigo-500' 
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                              }`}
                            >
                               <span className="text-sm font-bold text-white">{quiz.title}</span>
                               <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{quiz.category}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                       <div className="flex justify-between items-center mb-3 px-2">
                          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">Set Coin Wager</label>
                          <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Balance: {user?.coins ?? 0} Coins</p>
                       </div>
                       <div className="flex justify-between gap-3">
                          {[0, 10, 50, 100, 500].map(amount => (
                             <button 
                               key={amount}
                               onClick={() => setWager(amount)}
                               className={`flex-1 py-4 rounded-2xl border font-black transition-all text-xs ${
                                 wager === amount 
                                 ? 'bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/20' 
                                 : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                               }`}
                             >
                                {amount === 0 ? "Free" : amount}
                             </button>
                          ))}
                       </div>

                   <button 
                    onClick={createChallenge}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all mt-4"
                   >
                      Dispatch Challenge
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BattleGround;
