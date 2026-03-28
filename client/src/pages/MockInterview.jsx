import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, 
  Send, X, Award, BarChart3, ShieldCheck, 
  Terminal, User, Zap, ArrowRight, Loader2,
  CheckCircle2, AlertCircle, Layout
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:4000/api';

const MockInterview = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const chatEndRef = useRef(null);

  const companies = [
    { id: 'Google', name: 'Google', color: 'from-blue-500 to-red-500', recruiter: 'Sarah (Staff Engineer)' },
    { id: 'Amazon', name: 'Amazon', color: 'from-orange-400 to-amber-500', recruiter: 'David (Bar Raiser)' },
    { id: 'Netflix', name: 'Netflix', color: 'from-red-600 to-red-800', recruiter: 'Elena (Principal Engineer)' },
    { id: 'Swiggy', name: 'Swiggy', color: 'from-orange-500 to-rose-500', recruiter: 'Karthik (Tech Lead)' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [session?.transcript]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startInterview = async (company) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/mock-interview/start`, { company }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSession(res.data.data);
      setSelectedCompany(company);
      toast.success(`Interview with ${company} started!`);
    } catch (err) {
      toast.error('Failed to start interview session');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || chatLoading) return;

    const userMsg = message;
    setMessage('');
    setChatLoading(true);

    try {
      const res = await axios.post(`${API_URL}/mock-interview/${session._id}/chat`, 
        { message: userMsg },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setSession(res.data.session);
    } catch (err) {
      toast.error('Connection lost with recruiter');
    } finally {
      setChatLoading(false);
    }
  };

  const finishInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/mock-interview/${session._id}/finish`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setScorecard(res.data.data.scorecard);
      setSession(res.data.data);
      toast.success('Interview concluded. Results are in!');
    } catch (err) {
      toast.error('Failed to generate scorecard');
    } finally {
      setLoading(false);
    }
  };

  const shareToFeed = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/posts/share-scorecard`, { 
        scorecard, 
        company: selectedCompany 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Scorecard shared to feed!');
    } catch (err) {
      toast.error('Failed to share scorecard');
    } finally {
      setLoading(false);
    }
  };

  if (scorecard) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0b14] flex items-center justify-center">
        <h1 className="sr-only">AI Mock Interview Results</h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full glass-panel p-8 sm:p-12 rounded-[3rem] border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className={`text-4xl font-black italic ${scorecard.verdict === 'HIRE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {scorecard.verdict}
             </div>
          </div>

          <div className="flex items-center gap-6 mb-12">
             <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20">
                <Award className="w-10 h-10 text-indigo-400" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-white">Interview Scorecard</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{selectedCompany} Technical Assessment</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             {[
               { label: 'Technical Depth', val: scorecard.technical, color: 'text-blue-400' },
               { label: 'Communication', val: scorecard.communication, color: 'text-purple-400' },
               { label: 'Culture Fit', val: scorecard.cultureFit, color: 'text-emerald-400' }
             ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                   <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.val}%</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
             ))}
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-3xl mb-12">
             <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Executive Summary
             </h4>
             <p className="text-gray-400 leading-relaxed text-sm italic">"{scorecard.summary}"</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={shareToFeed}
              disabled={loading}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Sharing...' : <><Send className="w-4 h-4" /> Share to Community Feed</>}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
            >
              Review Another MNC
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0b14]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight">AI Recruiter <span className="text-indigo-500">Simulation</span></h1>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">Practice your technical interviews with MNC recruiters in a high-fidelity environment. Choose your target company to begin.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((comp) => (
              <motion.div
                key={comp.id}
                whileHover={{ y: -10 }}
                className="glass-panel p-8 rounded-[2.5rem] border-white/5 cursor-pointer group relative overflow-hidden"
                onClick={() => startInterview(comp.id)}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${comp.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity animate-pulse`} />
                
                <div className={`w-14 h-14 bg-gradient-to-br ${comp.color} rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                   <User className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{comp.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">{comp.recruiter}</p>
                
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
                   Enter Boardroom <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#05060b] flex flex-col md:flex-row gap-6 max-w-[1600px] mx-auto">
      
      {/* Simulation Screen (Meet Style) */}
      <div className="flex-1 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-video glass-panel rounded-[3rem] border-white/5 overflow-hidden group shadow-2xl"
        >
          {/* Virtual Background / Recruiter Feed placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 flex items-center justify-center">
             <div className="text-center">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto border border-white/5">
                   <User className="w-16 h-16 text-indigo-400/50" />
                </div>
                <div className="text-white font-black text-xl italic">{session.recruiterPersona}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Active Technical Dialogue</div>
             </div>
          </div>

          {/* User Small Feed */}
          <div className="absolute bottom-10 right-10 w-48 aspect-video bg-black/60 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
             <User className="w-8 h-8 text-gray-700" />
             <div className="absolute bottom-2 left-3 text-[8px] text-white/50 font-bold uppercase">Candidate (You)</div>
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
             <button className="p-3 bg-white/5 rounded-2xl hover:bg-emerald-500/20 text-emerald-400 transition-all"><Video className="w-5 h-5" /></button>
             <button className="p-3 bg-white/5 rounded-2xl hover:bg-emerald-500/20 text-emerald-400 transition-all"><Mic className="w-5 h-5" /></button>
             <div className="h-6 w-px bg-white/10 mx-2"></div>
             <button 
              onClick={finishInterview}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-rose-600/20"
             >
               End Interview
             </button>
          </div>
        </motion.div>

        {/* AI Insight Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <div>
                 <div className="text-[8px] text-gray-500 font-bold uppercase">Latency</div>
                 <div className="text-xs text-white font-bold font-mono">24ms (ELITE)</div>
              </div>
           </div>
           <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div>
                 <div className="text-[8px] text-gray-500 font-bold uppercase">Encryption</div>
                 <div className="text-xs text-white font-bold font-mono">AES-256</div>
              </div>
           </div>
           <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-indigo-500" />
              <div>
                 <div className="text-[8px] text-gray-500 font-bold uppercase">Mode</div>
                 <div className="text-xs text-white font-bold font-mono text-indigo-400">TECHNICAL</div>
              </div>
           </div>
           <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-pink-500" />
              <div>
                 <div className="text-[8px] text-gray-500 font-bold uppercase">Evaluation</div>
                 <div className="text-xs text-white font-bold font-mono">LIVE AI GRID</div>
              </div>
           </div>
        </div>
      </div>

      {/* Chat / Transcription Panel */}
      <div className="w-full md:w-[450px] flex flex-col glass-panel rounded-[3.5rem] border-white/5 overflow-hidden shadow-2xl h-[800px]">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-black italic tracking-tight">Transcription Room</h3>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black border border-emerald-500/20">LIVE</span>
         </div>

         <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {session.transcript.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-600/10 font-medium' 
                  : 'bg-white/5 text-gray-300 rounded-bl-none border border-white/5'
                }`}>
                  {msg.message}
                </div>
              </motion.div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5 animate-pulse flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Recruiter is typing...</span>
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
         </div>

         <form onSubmit={sendMessage} className="p-8 bg-black/20 border-t border-white/5">
            <div className="relative">
               <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your response carefully..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
               />
               <button 
                type="submit"
                disabled={chatLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl transition-all shadow-lg"
               >
                 <Send className="w-4 h-4" />
               </button>
            </div>
         </form>
      </div>

    </div>
  );
};

export default MockInterview;
