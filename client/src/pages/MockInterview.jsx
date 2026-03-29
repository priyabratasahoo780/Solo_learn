import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, 
  Send, X, Award, BarChart3, ShieldCheck, 
  Terminal, User, Zap, ArrowRight, Loader2,
  CheckCircle2, AlertCircle, Layout, Globe,
  Activity, Shield, Laptop
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const MockInterview = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const companies = [
    { id: 'Google', name: 'Google', color: 'border-blue-500', recruiter: 'Sarah (Staff Engineer)', icon: <Globe className="w-8 h-8" /> },
    { id: 'Amazon', name: 'Amazon', color: 'border-orange-500', recruiter: 'David (Bar Raiser)', icon: <Zap className="w-8 h-8" /> },
    { id: 'Netflix', name: 'Netflix', color: 'border-red-600', recruiter: 'Elena (Principal Engineer)', icon: <Video className="w-8 h-8" /> },
    { id: 'Swiggy', name: 'Swiggy', color: 'border-orange-500', recruiter: 'Karthik (Tech Lead)', icon: <Layout className="w-8 h-8" /> }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [session?.transcript]);

  useEffect(() => {
    if (session && isVideoOn && !stream) {
      startMedia();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [session]);

  const startMedia = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setIsVideoOn(true);
      setIsMicOn(true);
      return true;
    } catch (err) {
      console.error('Media error:', err);
      toast.error('Media access denied. Camera/Mic features will be unavailable.');
      setIsVideoOn(false);
      setIsMicOn(false);
      return false;
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    } else {
      startMedia();
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startInterview = async (company) => {
    setLoading(true);
    try {
      const res = await api.post(`/mock-interview/start`, { company });
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
      const res = await api.post(`/mock-interview/${session._id}/chat`, { message: userMsg });
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
      const res = await api.post(`/mock-interview/${session._id}/finish`, {});
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
      await api.post(`/posts/share-scorecard`, { 
        scorecard, 
        company: selectedCompany 
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
      <div className="min-h-screen py-16 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full sketch-card p-12 lg:p-16 bg-white relative overflow-hidden"
        >
          <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
          
          <div className="absolute top-10 right-10">
             <div className="badge-sketch bg-oxford-blue text-white shadow-[4px_4px_0px_0px_#FF5722]">
                OFFICIAL EVALUATION
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 mb-16 border-b-[3px] border-dashed border-slate-200 pb-12">
             <div className="icon-circle-sketch h-24 w-24 bg-white border-oxford-blue shadow-[8px_8px_0px_0px_#cbd5e1]">
                <Award className="w-12 h-12 text-oxford-blue" />
             </div>
             <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none mb-3">Academic Performance Cert</h1>
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Simulation Node: {selectedCompany?.toUpperCase()} ELITE ASSESSMENT</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
             {[
               { label: 'Technical Depth', val: scorecard.technical, color: 'text-oxford-blue', shadow: '#cbd5e1' },
               { label: 'Communication', val: scorecard.communication, color: 'text-orange-500', shadow: '#cbd5e1' },
               { label: 'Culture Fit', val: scorecard.cultureFit, color: 'text-oxford-blue', shadow: '#cbd5e1' }
             ].map((stat, i) => (
                <div key={i} className="sketch-card p-8 bg-slate-50 border-[2px] text-center shadow-[4px_4px_0px_0px_#cbd5e1]">
                   <div className={`text-4xl font-black mb-2 italic ${stat.color}`}>{stat.val}%</div>
                   <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
             ))}
          </div>

          <div className="sketch-card bg-orange-50 border-orange-500 p-10 mb-16 shadow-[6px_6px_0px_0px_#002D72]">
             <h4 className="text-oxford-blue font-black mb-5 flex items-center gap-3 italic uppercase tracking-wider">
                <BarChart3 className="w-6 h-6 text-orange-500" />
                Assessment Narrative
             </h4>
             <p className="text-oxford-blue leading-relaxed font-bold text-lg italic bg-white/50 p-6 border-[2px] border-dashed border-orange-200 rounded-2xl">
               "{scorecard.summary}"
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={shareToFeed}
              disabled={loading}
              className="btn-sketch flex-1 py-5 text-sm"
            >
              {loading ? 'TRANSMITTING...' : <><Send className="w-5 h-5" /> BROADCAST TO COMMUNITY</>}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="btn-sketch-outline flex-1 py-5 text-sm"
            >
              NEW EVALUATION CYCLE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-16 pb-24">
        {/* Strategic Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12">
          <div className="space-y-4">
            <div className="badge-sketch">Simulation Chamber Ready</div>
            <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter leading-none uppercase">
              RECRUITER <span className="text-orange-500">SIMULATION</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs max-w-xl">
              Experience the evolution of technical hiring. Practice with Staff Engineer personas from top-tier MNCs in a professional boardroom environment.
            </p>
          </div>
          <div className="icon-circle-sketch h-16 w-16 bg-white shadow-[6px_6px_0px_0px_#cbd5e1]">
            <Laptop className="w-8 h-8 text-oxford-blue" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {companies.map((comp) => (
            <motion.div
              key={comp.id}
              whileHover={{ y: -8 }}
              className={`sketch-card p-10 bg-white border-oxford-blue shadow-[8px_8px_0px_0px_#cbd5e1] hover:shadow-[10px_10px_0px_0px_#FF5722] cursor-pointer group transition-all`}
              onClick={async () => {
                  const hasAccess = await startMedia();
                  startInterview(comp.id);
              }}
            >
              <div className="icon-circle-sketch h-16 w-16 bg-slate-50 border-oxford-blue text-oxford-blue mb-10 group-hover:bg-oxford-blue group-hover:text-white transition-all duration-500">
                 {comp.icon}
              </div>
              
              <h3 className="text-3xl font-black text-oxford-blue italic tracking-tighter uppercase mb-2 group-hover:text-orange-500 transition-colors uppercase">{comp.name}</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10">{comp.recruiter}</p>
              
              <div className="flex items-center gap-3 text-oxford-blue text-[10px] font-black uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                 INITIALIZE <ArrowRight className="w-5 h-5 text-orange-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-10 pb-24 pt-4">
      
      {/* Simulation Screen (Meet Style) */}
      <div className="flex-1 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video sketch-card bg-white border-oxford-blue shadow-[12px_12px_0px_0px_#cbd5e1] overflow-hidden group"
        >
          {/* Recruiter Feed / Virtual Boardroom */}
          <div className="absolute inset-0 bg-slate-50 overflow-hidden">
             <div className="absolute inset-0 sketch-grid opacity-10" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10 space-y-8 px-10">
                   <div className="icon-circle-sketch h-40 w-40 mx-auto bg-white border-oxford-blue shadow-[8px_8px_0px_0px_#FF5722]">
                      <User className="w-20 h-20 text-oxford-blue" />
                   </div>
                   <div className="space-y-3">
                      <div className="text-oxford-blue font-black text-3xl italic tracking-tighter uppercase leading-none">{session.recruiterPersona}</div>
                      <div className="badge-sketch bg-oxford-blue text-white shadow-[4px_4px_0px_0px_#FF5722]">
                        ACTIVE TECHNICAL DIALOGUE
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Candidate Small Feed (Top Right) */}
          <div className="absolute top-8 right-8 w-48 sm:w-64 aspect-video sketch-card bg-white border-oxford-blue shadow-[6px_6px_0px_0px_#FF5722] z-20 overflow-hidden">
             {isVideoOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover mirror"
                  onLoadedMetadata={(e) => e.target.play()}
                />
             ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-slate-50">
                   <VideoOff className="w-8 h-8 text-slate-300" />
                   <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">FEED BLOCKED</span>
                </div>
             )}
             <div className="absolute bottom-3 left-4 text-[9px] text-oxford-blue font-black uppercase tracking-widest bg-white/90 border-2 border-oxford-blue px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#FF5722]">CANDIDATE</div>
          </div>

          {/* Control Platform */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-5 bg-white border-[3px] border-oxford-blue rounded-3xl shadow-[8px_8px_0px_0px_#FF5722] z-20">
             <div className="flex items-center gap-5">
               <button 
                onClick={toggleCamera}
                className={`icon-circle-sketch h-12 w-12 transition-all border-[2.5px] ${
                  isVideoOn ? 'bg-white border-oxford-blue text-oxford-blue hover:bg-oxford-blue hover:text-white' : 'bg-orange-500 border-oxford-blue text-white'
                }`}
               >
                 {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
               </button>
               <button 
                onClick={toggleMic}
                className={`icon-circle-sketch h-12 w-12 transition-all border-[2.5px] ${
                  isMicOn ? 'bg-white border-oxford-blue text-oxford-blue hover:bg-oxford-blue hover:text-white' : 'bg-orange-500 border-oxford-blue text-white'
                }`}
               >
                 {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
               </button>
             </div>
             <div className="h-10 w-[2px] bg-slate-100 hidden sm:block" />
             <button 
              onClick={finishInterview}
              className="btn-sketch py-3 px-8 text-[11px] bg-orange-500 border-oxford-blue text-white shadow-[4px_4px_0px_0px_#002D72]"
             >
               CONCLUDE INTERVIEW
             </button>
          </div>
        </motion.div>

        {/* Academic Insight Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { icon: Activity, label: 'Latencey', val: '24MS (ELITE)', color: 'text-orange-500' },
             { icon: Shield, label: 'Encryption', val: 'AES-256 STUDY', color: 'text-oxford-blue' },
             { icon: Terminal, label: 'Protocol', val: 'TECH DEPTH', color: 'text-oxford-blue' },
             { icon: BarChart3, label: 'Validation', val: 'LIVE AI GRID', color: 'text-oxford-blue' }
           ].map((stat, i) => (
             <div key={i} className="sketch-card p-5 bg-white flex items-center gap-4 border-[2px] shadow-[4px_4px_0px_0px_#cbd5e1]">
                <div className={`p-2 rounded-lg border-2 border-dashed ${stat.color} border-current opacity-60`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <div>
                   <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">{stat.label}</div>
                   <div className={`text-[10px] font-black italic ${stat.color}`}>{stat.val}</div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Transcription Room (Notebook Panel) */}
      <div className="w-full xl:w-[480px] flex flex-col sketch-card bg-white border-oxford-blue shadow-[12px_12px_0px_0px_#cbd5e1] h-[800px] overflow-hidden">
         <div className="p-8 border-b-[3px] border-dashed border-slate-200 flex items-center justify-between">
            <h3 className="text-xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">Recordings / Transcription</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white text-[9px] font-black rounded shadow-[2px_2px_0px_0px_#002D72]">
               <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE STREAMING
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide relative">
            <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
            {session.transcript.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-6 rounded-3xl text-sm leading-relaxed border-[2px] ${
                  msg.sender === 'user' 
                  ? 'bg-oxford-blue text-white border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722] rounded-br-none font-bold' 
                  : 'bg-slate-50 text-oxford-blue border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] rounded-bl-none italic font-bold'
                }`}>
                  {msg.message}
                </div>
              </motion.div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                 <div className="sketch-card bg-white p-5 border-dashed flex items-center gap-3 animate-pulse">
                    <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest italic">Recruiter analyzing response...</span>
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
         </div>

         <form onSubmit={sendMessage} className="p-10 bg-slate-50 border-t-[3px] border-oxford-blue border-dashed">
            <div className="relative">
               <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Draft your academic response..."
                  className="w-full bg-white border-[3px] border-oxford-blue rounded-2xl py-5 pl-8 pr-16 text-oxford-blue font-bold placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all text-sm shadow-[4px_4px_0px_0px_#cbd5e1]"
               />
               <button 
                type="submit"
                disabled={chatLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-orange-500 text-white border-[2px] border-oxford-blue rounded-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[3px_3px_0px_0px_#002D72]"
               >
                 <Send className="w-5 h-5" />
               </button>
            </div>
         </form>
      </div>

    </div>
  );
};

export default MockInterview;
