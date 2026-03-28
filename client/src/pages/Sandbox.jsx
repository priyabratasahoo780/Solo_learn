import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, RefreshCw, Layers, Monitor, Smartphone, Terminal, Save, Trash2, ShieldCheck, Zap } from 'lucide-react';

const Sandbox = () => {
  const [html, setHtml] = useState('<!-- Code your dream here -->\n<div class="hello">Hello SoloLearn!</div>\n\n<style>\n  body { background: #0f1020; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }\n  .hello { font-size: 3rem; font-weight: 900; background: linear-gradient(to right, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5)); }\n</style>');
  const [js, setJs] = useState('// JavaScript Logic\nconsole.log("Welcome to SoloLearn Sandbox!");\ndocument.querySelector(".hello").innerText = "Interactive Mode ON";');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <script>${js}</script>
        </html>
      `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [html, js]);

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 flex flex-col bg-[#0a0b14]">
      {/* Sandbox Header */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
            <Zap className="w-4 h-4" />
            SoloLearn Interactive Playground
          </div>
          <h1 className="text-3xl font-black text-white">Code <span className="text-indigo-400">Sandbox</span> v2.0</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
            <button 
              onClick={() => setActiveTab('html')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'html' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:text-white'}`}
            >
              HTML/CSS
            </button>
            <button 
              onClick={() => setActiveTab('js')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'js' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:text-white'}`}
            >
              JS Logic
            </button>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10" title="Save Project">
            <Save className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20" title="Reset All">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Editor Area */}
        <div className="glass-panel border-white/5 rounded-[2rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">{activeTab.toUpperCase()} Editor</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400/50"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400/50"></div>
            </div>
          </div>
          
          <textarea
            className="flex-1 w-full bg-transparent p-6 text-indigo-300 font-mono text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-white/10"
            value={activeTab === 'html' ? html : js}
            onChange={(e) => activeTab === 'html' ? setHtml(e.target.value) : setJs(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Preview Area */}
        <div className="glass-panel border-white/5 rounded-[2rem] overflow-hidden flex flex-col bg-white">
          <div className="bg-gray-100 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-500 underline decoration-indigo-400/50 decoration-2 underline-offset-4">Live Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-400 hover:text-indigo-500 cursor-pointer" />
              <Layers className="w-4 h-4 text-gray-400 hover:text-indigo-500 cursor-pointer" />
              <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin-slow cursor-pointer" onClick={() => setSrcDoc(srcDoc)} />
            </div>
          </div>
          
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
            className="flex-1 bg-white"
          />
        </div>
      </div>
      
      {/* Bottom Info */}
      <div className="max-w-7xl mx-auto w-full text-center group">
         <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em] group-hover:text-indigo-400 transition-colors">
            Powered by SoloLearn Infinity Engine &copy; 2026. <ShieldCheck className="w-3 h-3 inline-block ml-1" />
         </p>
      </div>
    </div>
  );
};

export default Sandbox;
