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
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { label: 'Deep Breakdown', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Code Review', icon: <Code className="w-3.5 h-3.5" /> },
    { label: 'Architecture', icon: <Database className="w-3.5 h-3.5" /> },
    { label: 'Exam Mode', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e, customInput = null) => {
    if (e) e.preventDefault();
    const messageContent = customInput || input;
    if (!messageContent.trim()) return;

    const userMessage = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/ask', { question: userMessage.content });
      const botMessage = { role: 'assistant', content: data.data.answer };
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
      {/* Strategic Toggle Button */}
      <motion.button
        className="fixed bottom-10 right-10 z-[70] w-16 h-16 bg-oxford-blue rounded-full shadow-[4px_4px_0px_0px_#FF5722] flex items-center justify-center text-white border-[3px] border-white hover:scale-110 active:scale-95 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ rotate: 15 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
 
      {/* Sketch Assistant Workspace */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            className={`fixed top-0 right-0 z-[65] h-screen bg-white border-l-[3px] border-oxford-blue flex flex-col transition-all duration-500 shadow-[-10px_0_40px_rgba(0,45,114,0.1)]
              ${isExpanded ? 'w-[700px]' : 'w-full sm:w-[450px]'}`}
          >
            {/* Academic Header */}
            <div className="p-8 border-b-[3px] border-oxford-blue flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-5">
                <div className="icon-circle-sketch bg-white shadow-[3px_3px_0px_0px_#cbd5e1]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-oxford-blue text-lg uppercase tracking-tight leading-none italic">Academic Intel</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Generative Strategy Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2.5 bg-white border-2 border-oxford-blue rounded-xl text-oxford-blue hover:bg-slate-50 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#cbd5e1]"
                >
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 bg-white border-2 border-oxford-blue rounded-xl text-oxford-blue hover:bg-slate-50 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#cbd5e1]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Study Feed */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar sketch-grid">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-6 rounded-3xl text-sm leading-relaxed border-[3px] ${
                    msg.role === 'assistant'
                      ? 'bg-white text-slate-700 border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] prose prose-academy max-w-[90%]'
                      : 'bg-oxford-blue text-white border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722] max-w-[85%] font-bold'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeText = String(children).replace(/\n$/, '');
                            return !inline && match ? (
                              <div className="relative group my-6">
                                <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => copyToClipboard(codeText, 'code')}
                                    className="p-2.5 bg-white text-oxford-blue rounded-xl border-2 border-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] hover:bg-slate-50"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="p-1 bg-oxford-blue/5 rounded-2xl">
                                  <code className={`${className} block overflow-x-auto`} {...props}>
                                    {children}
                                  </code>
                                </div>
                              </div>
                            ) : (
                              <code className={`${className} bg-slate-100 px-1.5 py-0.5 rounded-md text-oxford-blue font-bold`} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className="mt-3 px-3 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      {msg.role === 'assistant' ? 'Academy Intelligence' : 'Student Transmission'}
                    </span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border-[3px] border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] w-fit">
                   <div className="flex gap-2">
                     <span className="w-2 h-2 bg-oxford-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <span className="w-2 h-2 bg-oxford-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <span className="w-2 h-2 bg-oxford-blue rounded-full animate-bounce" />
                   </div>
                   <span className="text-[10px] text-oxford-blue font-black uppercase tracking-widest">Processing Intelligence...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Strategic Intervention Options */}
            <div className="px-8 py-5 grid grid-cols-2 gap-4 border-t-[3px] border-oxford-blue bg-white">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(null, action.label)}
                  className="flex items-center gap-3 p-4 text-xs bg-slate-50 hover:bg-white border-[2px] border-oxford-blue rounded-2xl transition-all hover:translate-x-1 active:translate-y-0.5 text-oxford-blue font-black uppercase tracking-tight group shadow-[3px_3px_0px_0px_#cbd5e1]"
                >
                  <span className="group-hover:rotate-12 transition-transform">{action.icon}</span>
                  <span className="truncate">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Academic Command Hub (Input) */}
            <form onSubmit={handleSend} className="p-8 bg-slate-50 border-t-[3px] border-oxford-blue">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Transmit academic query..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border-[3px] border-oxford-blue rounded-2xl py-5 pl-8 pr-16 focus:outline-none focus:ring-4 focus:ring-oxford-blue/5 text-slate-800 transition-all font-bold placeholder:text-slate-300 shadow-[4px_4px_0px_0px_#cbd5e1]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-3 top-3 p-3 bg-oxford-blue text-white rounded-xl hover:bg-oxford-blue/90 disabled:opacity-20 transition-all active:translate-y-1 shadow-[3px_3px_0px_0px_#FF5722]"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AITutor;
