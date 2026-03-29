import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, RefreshCw, Layers, Monitor, Smartphone, Terminal, Save, Trash2, ShieldCheck, Zap, Beaker, ChevronRight, Microscope } from 'lucide-react';

const Sandbox = () => {
  const [html, setHtml] = useState('<!-- Laboratory Sandbox v2.5 -->\n<div class="academy-node">PROJECT: FUTURE ENGINEERING</div>\n\n<style>\n  body { background: #F8FAFC; color: #002D72; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: "Fredoka", sans-serif; }\n  .academy-node { \n    font-size: 3rem; \n    font-weight: 900; \n    background: white; \n    color: #002D72; \n    padding: 2rem 4rem;\n    border: 4px solid #002D72;\n    box-shadow: 10px 10px 0px 0px #FF5722;\n    transform: rotate(-1deg);\n    text-transform: uppercase;\n  }\n</style>');
  const [js, setJs] = useState('// Scripting Protocol Initialized\nconsole.log("Academy Lab Ready.");\n// document.querySelector(".academy-node").innerText = "AUTHORIZED ACCESS";');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet">
          </head>
          <body>${html}</body>
          <script>${js}</script>
        </html>
      `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [html, js]);

  const handleReset = () => {
    if(window.confirm('PROTOCOL WARNING: This will purge all active laboratory data. Proceed?')) {
       setHtml('<!-- Resetting Lab... -->');
       setJs('// Purged.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
      
      {/* Sandbox Header: Institutional Branding */}
      <div className="max-w-[1700px] mx-auto w-full mb-10 flex flex-wrap items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxford-blue text-white text-[9px] font-black uppercase tracking-[0.2em] border-2 border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722]">
            <Beaker className="w-3 h-3 text-orange-400" />
            RESEARCH EVALUATION NODE: 1024
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-oxford-blue italic title-fredoka uppercase tracking-tighter">
            LABORATORY: <span className="text-orange-500">CODE SANDBOX</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1.5 border-[3px] border-oxford-blue shadow-[5px_5px_0px_0px_#cbd5e1]">
            <button 
              onClick={() => setActiveTab('html')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'html' ? 'bg-oxford-blue text-white shadow-[3px_3px_0px_0px_#FF5722]' : 'text-slate-400 hover:text-oxford-blue'}`}
            >
              STRUCTURE / STYLE
            </button>
            <button 
              onClick={() => setActiveTab('js')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'js' ? 'bg-oxford-blue text-white shadow-[3px_3px_0px_0px_#FF5722]' : 'text-slate-400 hover:text-oxford-blue'}`}
            >
              LOGIC PROTOCOL
            </button>
          </div>
          
          <div className="flex gap-3">
            <button className="icon-circle-sketch h-12 w-12 border-[3px] bg-white hover:shadow-[5px_5px_0px_0px_#FF5722]" title="Save Research">
              <Save className="w-5 h-5 text-oxford-blue" />
            </button>
            <button 
              onClick={handleReset}
              className="icon-circle-sketch h-12 w-12 border-[3px] bg-white hover:bg-orange-50 hover:border-orange-500 transition-all" title="Purge Lab"
            >
              <Trash2 className="w-5 h-5 text-slate-400 hover:text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Laboratory Area */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        
        {/* Editor Area (The Module Input) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="sketch-card bg-[#001D4A] border-oxford-blue shadow-[12px_12px_0px_0px_#FF5722] flex flex-col min-h-[500px] overflow-hidden"
        >
          <div className="bg-oxford-blue border-b-[3px] border-oxford-blue px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
                {activeTab === 'html' ? 'STRUCTURAL_MARKUP.EXE' : 'LOGIC_CORE.SYSTEM'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-white/20"></div>
              <div className="w-3 h-3 rounded-full border-2 border-white/20"></div>
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>
          </div>
          
          <textarea
            className="flex-1 w-full bg-transparent p-10 text-orange-200 font-mono text-sm resize-none focus:outline-none scrollbar-sketch placeholder-white/20"
            value={activeTab === 'html' ? html : js}
            onChange={(e) => activeTab === 'html' ? setHtml(e.target.value) : setJs(e.target.value)}
            spellCheck="false"
            placeholder={activeTab === 'html' ? "Enter HTML/CSS Protocol..." : "Enter Logic Flow..."}
          />
        </motion.div>

        {/* Evaluation Area (The Live Output) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="sketch-card border-oxford-blue shadow-[12px_12px_0px_0px_#cbd5e1] flex flex-col bg-white overflow-hidden"
        >
          <div className="bg-slate-50 border-b-[3px] border-oxford-blue px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-oxford-blue" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford-blue italic underline decoration-orange-400 decoration-[3px] underline-offset-4">
                REAL_TIME_EVALUATION.OUT
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  ACTIVE_LINK
               </div>
               <div className="h-6 w-[2px] bg-slate-200" />
               <Smartphone className="w-4 h-4 hover:text-oxford-blue cursor-pointer transition-colors" />
               <RefreshCw className="w-4 h-4 hover:text-oxford-blue cursor-pointer transition-all active:rotate-180" onClick={() => setSrcDoc(srcDoc)} />
            </div>
          </div>
          
          <div className="flex-1 p-2 bg-slate-100 flex items-center justify-center">
             <div className="w-full h-full bg-white border-[2px] border-oxford-blue overflow-hidden relative shadow-inner">
                <iframe
                  srcDoc={srcDoc}
                  title="Laboratory Output"
                  sandbox="allow-scripts"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                />
             </div>
          </div>
        </motion.div>
      </div>
      
      {/* Institutional Benchmarks Info */}
      <div className="max-w-[1700px] mx-auto w-full mt-12 flex items-center justify-between gap-6 border-t-[3px] border-dashed border-slate-200 pt-8 group">
         <div className="flex items-center gap-4">
            <Microscope className="w-6 h-6 text-oxford-blue opacity-50" />
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] italic">
               Institutional Practice Module Authorized &copy; 2026. Data Persistence Status: <span className="text-orange-500">VOLATILE</span>
            </p>
         </div>
         <div className="flex items-center gap-2 text-[9px] font-black text-oxford-blue uppercase tracking-widest px-4 py-2 border-[2px] border-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] group-hover:shadow-[3px_3px_0px_0px_#FF5722] transition-all bg-white cursor-help">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            Security Protocol Valid
         </div>
      </div>
    </div>
  );
};

export default Sandbox;
