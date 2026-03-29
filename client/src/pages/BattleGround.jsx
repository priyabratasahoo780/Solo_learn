import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  Zap, Trophy, Swords, Timer, Coins, 
  Users, User, ArrowRight, Play, 
  AlertCircle, CheckCircle2, X,
  TrendingUp, Shield, Crown, Search,
  ChevronRight, Beaker, ShieldCheck, Microscope, Rocket
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BattleGround = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openChallenges, setOpenChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  const [wager, setWager] = useState(0);
  const [activeDuel, setActiveDuel] = useState(null);
  const [duelStep, setDuelStep] = useState('lobby'); // lobby, playing, result
  const [topPlayers, setTopPlayers] = useState([]);
  const [userStats, setUserStats] = useState({
    battlesWon: 0,
    winRate: 0,
    coins: 0,
    globalRank: '#--'
  });

  useEffect(() => {
    fetchChallenges();
    fetchQuizzes();
    fetchLeaderboard();
    fetchUserStats();

    // Mission Control: Live Data Polling (10s sync)
    const syncInterval = setInterval(() => {
      fetchChallenges();
      fetchLeaderboard();
      fetchUserStats();
    }, 10000);

    return () => clearInterval(syncInterval);
  }, []);

  const fetchUserStats = async () => {
    try {
      const res = await api.get('/challenges/stats');
      setUserStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch battle metrics', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard');
      setTopPlayers(res.data.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch rank', err);
    }
  };

  const fetchChallenges = async () => {
    try {
      const res = await api.get('/challenges/open');
      setOpenChallenges(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load battle lobby');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      const fetchedQuizzes = res.data.data || [];
      setQuizzes(fetchedQuizzes);
      if (fetchedQuizzes.length > 0) {
        setSelectedQuiz(fetchedQuizzes[0]);
      }
    } catch (err) {
      console.error('Quiz fetch failed', err.response?.data?.message || err.message);
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
      setLoading(true);
      const res = await api.put(`/challenges/${id}/accept`, {});
      setActiveDuel(res.data.data);
      setOpenChallenges(openChallenges.filter(c => c._id !== id)); // Remove immediately from UI
      setDuelStep('playing');
      toast.success('Entering Arena... Good luck!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join duel');
    } finally {
      setLoading(false);
    }
  };

  if (duelStep === 'playing') {
     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
           <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="max-w-xl w-full flex flex-col items-center"
           >
              <div className="sketch-card bg-white p-12 text-center border-oxford-blue shadow-[15px_15px_0px_0px_#FF5722] relative z-10 w-full space-y-8">
                <div className="w-24 h-24 bg-oxford-blue border-[4px] border-oxford-blue shadow-[6px_6px_0px_0px_#FF5722] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                   <Swords className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka">Arena Initialized</h2>
                <div className="p-4 bg-slate-50 border-[2px] border-dashed border-oxford-blue text-xs font-black text-slate-500 uppercase tracking-widest italic">
                   "You are competing for <span className="text-orange-500 font-extrabold">
                      {activeDuel.pointsWager > 0 ? `${activeDuel.pointsWager * 2} COINS` : 'HONOR AND GLORY'}
                   </span>. Accuracy and Time are your only allies."
                </div>
                
                <button 
                  onClick={() => {
                     toast.success('Initializing Neural Link to Quiz Module...');
                     // Navigate to the real quiz page and pass the challengeId as a query param
                     const quizId = activeDuel.quizId?._id || activeDuel.quizId;
                     setTimeout(() => {
                        navigate(`/quizzes/${quizId}?challengeId=${activeDuel._id}`);
                     }, 1000);
                  }}
                  className="btn-sketch w-full py-6 text-sm bg-oxford-blue text-white shadow-[8px_8px_0px_0px_#FF5722]"
                >
                  ENTER COMBAT <ChevronRight className="w-6 h-6 ml-2 text-orange-400" />
                </button>
              </div>
              <div className="mt-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] italic">Authorized Battle Session Node: {activeDuel._id}</div>
           </motion.div>
        </div>
     );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-slate-50 relative overflow-hidden">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
      <h1 className="sr-only">Sketch Academy Valor Arena - Institutional PvP Challenges</h1>
      
      <div className="max-w-[1700px] mx-auto relative z-10 space-y-12">
        
        {/* Header Section: Institutional Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-4"
           >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxford-blue text-white text-[9px] font-black uppercase tracking-[0.2em] border-2 border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722]">
                <Zap className="w-3 h-3 text-orange-400 fill-orange-400" />
                VALOR_ARENA_PROTOCOL: 2.5
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-oxford-blue tracking-tighter uppercase italic title-fredoka leading-none">
                 VALOR <span className="text-orange-500 underline decoration-dashed underline-offset-8">ARENA</span>
              </h1>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] italic">Institutional 1V1 Specialized Competitive Arena • Wager & Win</p>
           </motion.div>

           <div className="flex items-center gap-6">
              <div className="sketch-card bg-white px-8 py-4 border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] flex items-center gap-4">
                 <Coins className="w-6 h-6 text-orange-500" />
                 <div className="flex flex-col">
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Active Credits</span>
                    <span className="text-xl font-black text-oxford-blue leading-none">{user?.coins || 0}</span>
                 </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-sketch py-5 px-10 text-xs shadow-[8px_8px_0px_0px_#002D72] hover:shadow-[10px_10px_0px_0px_#FF5722]"
              >
                <Swords className="w-5 h-5 mr-3 text-orange-400" /> CREATE DUEL
              </button>
           </div>
        </div>

        {/* Institutional Metrics (Stats) Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { label: 'BATTLES WON', val: userStats.battlesWon, icon: Trophy, color: 'text-orange-500', shadow: 'shadow-[6px_6px_0px_0px_#FF5722]' },
             { label: 'WIN RATE', val: `${userStats.winRate}%`, icon: TrendingUp, color: 'text-oxford-blue', shadow: 'shadow-[6px_6px_0px_0px_#cbd5e1]' },
             { label: 'COINS EARNED', val: userStats.coins?.toLocaleString() || '0', icon: Coins, color: 'text-oxford-blue', shadow: 'shadow-[6px_6px_0px_0px_#cbd5e1]' },
             { label: 'GLOBAL RANK', val: userStats.globalRank, icon: Crown, color: 'text-oxford-blue', shadow: 'shadow-[6px_6px_0px_0px_#cbd5e1]' }
           ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`sketch-card bg-white p-6 border-oxford-blue ${stat.shadow} flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-help group`}
              >
                 <div className="h-14 w-14 icon-circle-sketch border-[2px] bg-slate-50 group-hover:bg-oxford-blue transition-colors">
                    <stat.icon className={`w-7 h-7 ${stat.color} group-hover:text-white transition-colors`} />
                 </div>
                 <div className="space-y-1">
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] italic">{stat.label}</div>
                    <div className="text-2xl font-black text-oxford-blue title-fredoka leading-none">{stat.val}</div>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Tactical Arena Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Active Duel Lobby (Institutional Record) */}
           <div className="lg:col-span-8 space-y-10">
              <div className="flex justify-between items-center px-4">
                 <h3 className="text-2xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka">Active Lobby <span className="text-orange-500 ml-1">Archive</span></h3>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic animate-pulse">Live Deployment Scan...</span>
                 </div>
              </div>

              {loading ? (
                 <div className="space-y-6">
                   {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-40 sketch-card bg-white border-oxford-blue opacity-50 animate-pulse"></div>
                   ))}
                 </div>
              ) : openChallenges.length === 0 ? (
                 <div className="text-center py-24 bg-white sketch-card border-oxford-blue shadow-[10px_10px_0px_0px_#cbd5e1] border-dashed">
                    <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic">No active deployments detected. Initialize a duel to start the mission.</p>
                 </div>
              ) : (
                <div className="space-y-8">
                  {openChallenges.map((challenge, i) => (
                    <motion.div 
                      key={challenge._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="sketch-card p-10 bg-white border-oxford-blue shadow-[8px_8px_0px_0px_#cbd5e1] hover:shadow-[10px_10px_0px_0px_#FF5722] group transition-all relative overflow-hidden flex flex-col sm:flex-row gap-10 items-center"
                    >
                       {/* Challenger Profile Fragment */}
                       <div className="text-center sm:text-left min-w-[160px] space-y-4">
                          <div className="h-20 w-20 icon-circle-sketch border-[3px] mx-auto sm:mx-0 shadow-[4px_4px_0px_0px_#cbd5e1] group-hover:shadow-[4px_4px_0px_0px_#FF5722] transition-all bg-white overflow-hidden">
                             <div className="w-full h-full bg-oxford-blue flex items-center justify-center text-white font-black text-2xl title-fredoka">
                                {challenge.challenger?.name?.charAt(0).toUpperCase()}
                             </div>
                          </div>
                          <div>
                             <h4 className="text-oxford-blue font-black uppercase italic tracking-tight text-sm title-fredoka">{challenge.challenger?.name}</h4>
                             <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic block mt-1 underline decoration-orange-400">Tactical Unit</span>
                          </div>
                       </div>

                       {/* Arena Objective Mapping */}
                       <div className="flex-1 text-center sm:text-left space-y-4">
                          <div className="flex items-center justify-center sm:justify-start gap-3">
                             <div className="badge-sketch bg-slate-50 border-oxford-blue text-slate-500 text-[8px] py-1.5 px-3">
                                {challenge.quizId?.category?.toUpperCase() || 'GENERAL'}
                             </div>
                             <div className="flex items-center gap-1.5 text-orange-500 font-black text-[10px] italic">
                                <Beaker className="w-4 h-4" /> AUTH_LVL_9
                             </div>
                          </div>
                          <h3 className="text-3xl font-black text-oxford-blue title-fredoka uppercase leading-tight italic">{challenge.quizId?.title}</h3>
                          <div className="flex items-center justify-center sm:justify-start gap-6 border-t-[2px] border-dashed border-slate-100 pt-5">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 italic">
                                <Timer className="w-4 h-4 text-oxford-blue" /> 10 MINUTES
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-oxford-blue italic">
                                <Coins className="w-4 h-4 text-orange-500" /> {challenge.pointsWager} UNIT WAGER
                             </div>
                          </div>
                       </div>

                       {/* Deployment Action */}
                       <button 
                         onClick={() => acceptChallenge(challenge._id)}
                         disabled={loading}
                         className={`btn-sketch py-6 px-10 text-[10px] text-white border-oxford-blue shadow-[6px_6px_0px_0px_#FF5722] group-hover:scale-105 transition-all w-full sm:w-auto ${
                           challenge.challenger._id === user?._id ? 'bg-oxford-blue border-dashed opacity-90' : 'bg-oxford-blue'
                         }`}
                       >
                          JOIN DUEL <Play className="w-4 h-4 ml-3 text-orange-400 fill-orange-400" />
                       </button>
                    </motion.div>
                  ))}
                </div>
              )}
           </div>

           {/* Tactical Sidebar: Rules & Ranking Hall */}
           <div className="lg:col-span-4 space-y-12">
              
              {/* Rules of Engagement Card */}
              <div className="sketch-card bg-white p-10 border-oxford-blue shadow-[10px_10px_0px_0px_#cbd5e1] border-dashed relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Shield className="w-16 h-16 text-oxford-blue" /></div>
                 <h4 className="text-xl font-black text-oxford-blue title-fredoka italic uppercase flex items-center gap-3 mb-8">
                    <Shield className="w-6 h-6 text-oxford-blue" />
                    Rules of Engagement
                 </h4>
                 <div className="space-y-6">
                    {[
                      'Matchmaking is strictly asynchronous.',
                      'Highest accuracy wins the wager.',
                      'Total time is the tie-breaker.',
                      'Quitting mid-duel results in forfeit.'
                    ].map((rule, i) => (
                       <div key={i} className="flex gap-4 text-[11px] text-slate-500 font-bold uppercase italic leading-relaxed">
                          <span className="text-orange-500 font-black tracking-tighter">0{i+1}.</span>
                          <span className="border-b-[2px] border-slate-50 pb-1 flex-1">{rule}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Distinguished Competitors (Hall of Fame) */}
              <div className="sketch-card bg-oxford-blue p-10 border-oxford-blue shadow-[10px_10px_0px_0px_#FF5722]">
                 <h4 className="text-xl font-black text-white title-fredoka italic uppercase flex items-center gap-3 mb-10">
                    <Crown className="w-6 h-6 text-orange-500" />
                    DISTINGUISHED RANK
                 </h4>
                 <div className="space-y-6">
                    {topPlayers.length === 0 ? (
                       <div className="text-[10px] text-center text-slate-400 uppercase tracking-widest mt-4">
                         Recalibrating Data...
                       </div>
                    ) : topPlayers.map((elite, i) => (
                       <div key={i} className="flex items-center justify-between group cursor-help">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 icon-circle-sketch border-[2px] border-white/20 bg-white/5 flex items-center justify-center font-black text-xs text-white title-fredoka group-hover:bg-white group-hover:text-oxford-blue transition-all">
                                {i+1}
                             </div>
                             <span className="text-sm font-black text-slate-200 uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">
                                {elite.name || 'Anonymous'}
                             </span>
                          </div>
                          <div className="text-[10px] font-black text-orange-500 border-[2px] border-orange-500/20 px-3 py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
                             {elite.points || elite.totalPoints || 0} XP
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Institutional integrity Badge */}
              <div className="p-8 border-[3px] border-dashed border-slate-200 rounded-[2rem] text-center space-y-4">
                 <Microscope className="w-10 h-10 text-slate-200 mx-auto" />
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] italic leading-relaxed px-4">
                    "All battle metrics are verified by the Institutional Integrity Council."
                 </p>
                 <div className="block h-[1px] bg-slate-100 w-1/2 mx-auto" />
                 <div className="text-[10px] font-black text-oxford-blue uppercase italic">Status: <span className="text-orange-500 animate-pulse">VALIDATED</span></div>
              </div>
           </div>
        </div>
      </div>

      {/* Institutional Create Duel Terminal (Modal) */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-oxford-blue/10 backdrop-blur-md"
               onClick={() => setShowCreateModal(false)}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 40 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 40 }}
               className="max-w-2xl w-full sketch-card bg-white p-12 border-oxford-blue shadow-[20px_20px_0px_0px_#FF5722] z-10 relative overflow-hidden"
             >
                <div className="flex justify-between items-center mb-10 border-b-[3px] border-dashed border-slate-100 pb-8">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-black text-oxford-blue uppercase italic tracking-tighter title-fredoka">Prepare For <span className="text-orange-500">Valor</span></h2>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Institutional Deployment Authorization</p>
                   </div>
                   <button onClick={() => setShowCreateModal(false)} className="icon-circle-sketch h-12 w-12 border-[2px] bg-white hover:bg-slate-50">
                      <X className="w-6 h-6 text-oxford-blue" />
                   </button>
                </div>

                <div className="space-y-10">
                   {/* Target Selection Cell */}
                   <div className="space-y-4">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
                         <Microscope className="w-4 h-4 text-oxford-blue" />
                         Target Arena Protocol
                      </label>
                      <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-4 scrollbar-sketch">
                         {quizzes.length === 0 ? (
                           <div className="p-10 text-center border-[2px] border-dashed border-slate-200 text-slate-400 font-bold uppercase text-xs italic">
                             No Authorized Target Protocols (Quizzes) Available
                           </div>
                         ) : quizzes.map(quiz => (
                            <div 
                              key={quiz._id}
                              onClick={() => setSelectedQuiz(quiz)}
                              className={`p-6 bg-white border-[3px] transition-all cursor-pointer flex justify-between items-center group ${
                                selectedQuiz?._id === quiz._id 
                                ? 'border-oxford-blue shadow-[6px_6px_0px_0px_#FF5722] -translate-y-1' 
                                : 'border-slate-100 hover:border-oxford-blue hover:shadow-[6px_6px_0px_0px_#cbd5e1]'
                              }`}
                            >
                               <div className="space-y-1">
                                  <span className={`text-md font-black uppercase italic title-fredoka transition-colors ${selectedQuiz?._id === quiz._id ? 'text-oxford-blue' : 'text-slate-400 group-hover:text-oxford-blue'}`}>{quiz.title}</span>
                                  <div className="text-[8px] font-black uppercase tracking-[0.2em] italic text-slate-300 group-hover:text-orange-500">{quiz.category}</div>
                               </div>
                               {selectedQuiz?._id === quiz._id && <CheckCircle2 className="w-5 h-5 text-orange-400" />}
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Wager Assignment Unit */}
                   <div className="space-y-6">
                       <div className="flex justify-between items-center px-2">
                          <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-2">
                             <Coins className="w-4 h-4 text-orange-500" /> Wager Deployment Matrix
                          </label>
                          <div className="text-[9px] text-oxford-blue font-black uppercase tracking-widest bg-slate-50 px-3 py-1 border-[2px] border-slate-100 italic">Balance: {user?.coins ?? 0} Credits</div>
                       </div>
                       <div className="grid grid-cols-5 gap-4">
                          {[0, 10, 50, 100, 500].map(amount => (
                             <button 
                               key={amount}
                               onClick={() => setWager(amount)}
                               className={`py-5 border-[3px] font-black transition-all text-[11px] italic title-fredoka uppercase tracking-tighter ${
                                 wager === amount 
                                 ? 'bg-oxford-blue text-white border-oxford-blue shadow-[5px_5px_0px_0px_#FF5722]' 
                                 : 'bg-white border-slate-100 text-slate-300 hover:border-oxford-blue hover:text-oxford-blue'
                               }`}
                             >
                                {amount === 0 ? "FREE" : amount}
                             </button>
                          ))}
                       </div>
                   </div>

                   {/* Final Initialization Button */}
                   <button 
                    onClick={createChallenge}
                    className="btn-sketch w-full py-6 text-sm bg-oxford-blue text-white border-oxford-blue shadow-[12px_12px_0px_0px_#FF5722]"
                   >
                      AUTHORIZE AND DISPATCH <Rocket className="w-6 h-6 ml-3 text-orange-400" />
                   </button>
                </div>
                {/* Visual Security Overlay */}
                <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12"><Beaker className="w-48 h-48 text-oxford-blue" /></div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BattleGround;
