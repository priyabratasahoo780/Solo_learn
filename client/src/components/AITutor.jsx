import { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, X, Sparkles, Copy, Check, 
  Terminal, Code, GitBranch, Database, BookOpen,
  MessageSquare, ChevronRight, Maximize2, Minimize2,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const AITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '### Strategic Academic Briefing\nI am your **Sketch Academy Assistant**. I specialize in decomposing complex engineering patterns into executable study modules.\n\nReady to begin your session?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState('Socratic');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: 'Deep Breakdown', prompt: 'Please provide a thorough technical breakdown of our previous discussed concept. Focus on the underlying engineering principles.', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Code Review', prompt: 'Perform a tactical code review of the snippet we just discussed. Point out optimization opportunities and potential security flaws.', icon: <Code className="w-3.5 h-3.5" /> },
    { label: 'Architecture', prompt: 'Decompose the current topic into a scalable system architecture. Explain how the components interact in a production environment.', icon: <Database className="w-3.5 h-3.5" /> },
    { label: 'Exam Mode', prompt: 'Switch to Exam Protocol. Ask me a challenging specialized question about our current topic to test my retention.', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const messageContent = customPrompt || input;
    if (!messageContent.trim()) return;

    // Tactical Memory: Keep last 5 messages for context
    const currentHistory = messages.slice(-5).map(m => ({
      role: m.role,
      content: m.content
    }));

    const userMessage = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/ask', { 
        question: userMessage.content,
        history: currentHistory 
      });
      
      const botMessage = { role: 'assistant', content: data.data.answer };
      if (data.data.personality) setPersonality(data.data.personality);
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('AI Tutor Error:', err);
      const errorMessage = '### Connectivity Intelligence\nOperating in **Local Cache Mode**. High-fidelity generative signals are currently experiencing atmospheric interference.\n\nReference our core modules for continued progress.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-10 right-10 z-[70] w-18 h-18 bg-oxford-blue rounded-full shadow-[6px_6px_0px_0px_#FF5722] flex items-center justify-center text-white border-[4px] border-white hover:scale-110 active:scale-95 transition-all group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ rotate: 5 }}
      >
        <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-orange-500/30 animate-[spin_10s_linear_infinite] group-hover:animate-[spin_3s_linear_infinite]" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}>
              <Bot className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
 
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            className={`fixed top-0 right-0 z-[65] h-screen bg-white border-l-[3px] border-oxford-blue flex flex-col transition-all duration-500 shadow-[-10px_0_40px_rgba(0,45,114,0.15)]
              ${isExpanded ? 'w-[800px]' : 'w-full sm:w-[480px]'}`}
          >
            {/* Academic Header (Institutional Branding) */}
            <div className="p-10 border-b-[3px] border-oxford-blue flex items-center justify-between bg-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 bg-oxford-blue border-[3px] border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722] rounded-2xl flex items-center justify-center text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-oxford-blue text-2xl uppercase tracking-tighter leading-none italic title-fredoka">Academic Intel</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-[2px_2px_0px_0px_#002D72]">
                      {personality}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none italic underline decoration-orange-500/30 underline-offset-4">Strategic Protocol Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="icon-circle-sketch h-12 w-12 border-2 text-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] hover:shadow-[4px_4px_0px_0px_#FF5722]"
                >
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="icon-circle-sketch h-12 w-12 border-2 text-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] hover:scale-105"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Study Feed with BluePrint Grid */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative">
              <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col relative z-10 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-8 rounded-[2rem] text-sm leading-relaxed border-[3px] ${
                      msg.role === 'assistant'
                        ? 'bg-white text-slate-700 border-oxford-blue shadow-[8px_8px_0px_0px_#cbd5e1] prose prose-academy max-w-[92%]'
                        : 'bg-oxford-blue text-white border-oxford-blue shadow-[6px_6px_0px_0px_#FF5722] max-w-[85%] font-bold'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeText = String(children).replace(/\n$/, '');
                            return !inline && match ? (
                              <div className="relative group my-8">
                                <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => copyToClipboard(codeText, 'code')}
                                    className="btn-sketch p-3 bg-white text-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1]"
                                  >
                                    {copiedId === 'code' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                                <div className="p-1 bg-oxford-blue border-[2px] border-oxford-blue rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#cbd5e1]">
                                  <code className={`${className} block overflow-x-auto p-6 text-xs`} {...props}>
                                    {children}
                                  </code>
                                </div>
                              </div>
                            ) : (
                              <code className={`${className} bg-slate-100 px-2 py-0.5 rounded-lg text-oxford-blue font-black underline decoration-orange-500/30`} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="title-fredoka tracking-tight text-lg italic">{msg.content}</div>
                    )}
                  </motion.div>
                  <div className="mt-4 px-4 flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'assistant' ? 'bg-orange-500' : 'bg-oxford-blue'}`} />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] italic">
                      {msg.role === 'assistant' ? 'Academy Intelligence' : 'Student_Input.proto'}
                    </span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border-[3px] border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] w-fit relative z-10">
                   <div className="flex gap-2.5">
                     <span className="w-2.5 h-2.5 bg-oxford-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-2.5 h-2.5 bg-oxford-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-2.5 h-2.5 bg-oxford-blue rounded-full animate-bounce" />
                   </div>
                   <span className="text-[11px] text-oxford-blue font-black uppercase tracking-[0.2em] italic animate-pulse">Decomposing Data...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Strategic Intervention Grid */}
            <div className="px-10 py-6 grid grid-cols-2 gap-5 border-t-[3px] border-oxford-blue bg-slate-50">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(null, action.prompt)}
                  className="flex items-center gap-4 p-5 text-[11px] bg-white hover:bg-oxford-blue hover:text-white border-[3px] border-oxford-blue rounded-3xl transition-all hover:-translate-y-1 active:translate-y-0.5 text-oxford-blue font-black uppercase tracking-tight group shadow-[4px_4px_0px_0px_#cbd5e1] hover:shadow-[6px_6px_0px_0px_#FF5722]"
                >
                  <div className="p-2 bg-slate-50 group-hover:bg-white/10 rounded-xl transition-colors">
                    <span className="group-hover:rotate-12 transition-transform block">{action.icon}</span>
                  </div>
                  <span className="truncate flex-1 text-left italic">{action.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400" />
                </button>
              ))}
            </div>

            {/* Academic Command Input */}
            <form onSubmit={handleSend} className="p-10 bg-white border-t-[3px] border-oxford-blue relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="TRANSMIT_QUERY_SIGNAL..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-[1.5rem] py-6 pl-10 pr-20 focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 text-slate-800 transition-all font-black uppercase italic tracking-tighter placeholder:text-slate-300 shadow-[8px_8px_0px_0px_#cbd5e1] focus:shadow-[10px_10px_0px_0px_#FF5722]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-4 top-4 p-4 bg-oxford-blue text-white rounded-2xl hover:scale-105 disabled:opacity-20 transition-all active:translate-y-2 shadow-[4px_4px_0px_0px_#FF5722] hover:shadow-[6px_6px_0px_0px_#FF5722]"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <span className="text-[8px] text-slate-300 font-black uppercase tracking-[0.5em] italic">Authorized Academy AI Session v2.5</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITutor;
