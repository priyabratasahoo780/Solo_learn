import { Link } from 'react-router-dom';
import { Terminal, Code2, Users, Trophy, Zap, Shield, ArrowRight, Sparkles, Cpu, Globe, Rocket, ShieldCheck } from 'lucide-react';
import { Card3D } from '../components/Card3D';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);

  return (
    <div ref={containerRef} className="relative space-y-32 pb-32 overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-indigo-600/10 blur-[180px] rounded-full -z-10" 
        />
        
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel border-white/10 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
          >
            <Sparkles className="w-4 h-4" />
            V2.0 Elite Intelligence
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] italic">
            <motion.span 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="block"
            >
              ENGINEER
            </motion.span>
            <motion.span 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.4 }}
               className="text-gradient drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
              YOUR FUTURE
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed uppercase tracking-wide"
          >
            The world's most immersive platform for technical mastery. 
            3D Simulations, Real-time BattleGrounds, and AI-Powered Career Growth.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row justify-center gap-8 pt-8"
          >
            <Link
              to="/signup"
              className="group relative px-12 py-6 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.4em] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.4)] transition-all hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-3">
                Deploy Account <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link
              to="/quizzes"
              className="px-12 py-6 rounded-2xl glass-panel border-white/5 text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/5 hover:border-indigo-500/50 transition-all hover:-translate-y-1"
            >
              Explore Labs
            </Link>
          </motion.div>
        </div>

        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Scroll to Explore</div>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent" 
          />
        </motion.div>
      </section>

      {/* Feature Architecture */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={Cpu}
            title="3D BattleGrounds"
            desc="Step into an interactive arena where coding challenges come to life through real-time simulations."
            tag="Next-Gen"
          />
          <FeatureCard 
            icon={Trophy}
            title="Prestige Leaderboard"
            desc="Climb the global ranks. Earn distinguished badges and showcase your technical dominance."
            tag="Global"
          />
          <FeatureCard 
            icon={Globe}
            title="Elite Community"
            desc="Collaborate with world-class engineers. Share knowledge, create challenges, and grow together."
            tag="Social"
          />
        </div>
      </section>
      
      {/* Social Proof Intelligence */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tighter">OPERATIONAL <span className="text-gradient">TESTIMONIALS</span></h2>
          <p className="text-xs text-gray-500 font-black uppercase tracking-[0.3em]">User Intelligence Reports</p>
        </div>
        <div className="px-6">
          <ReviewsCarousel />
        </div>
      </section>

      {/* Global Metrics */}
      <section className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-12 sm:p-20 rounded-[60px] border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck className="w-64 h-64" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 text-center relative z-10">
            <Stat value="100K+" label="Active Units" />
            <Stat value="45+" label="Tech Sectors" />
            <Stat value="5M+" label="Labs Completed" />
          </div>
        </motion.div>
      </section>

      {/* Final Directive */}
      <section className="text-center py-20 px-6">
        <div className="max-w-4xl mx-auto glass-panel p-16 sm:p-24 rounded-[60px] space-y-10 border border-white/5 hover:border-indigo-500/30 transition-all group">
          <h2 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter">READY TO <span className="text-gradient">INITIALIZE?</span></h2>
          <p className="text-gray-400 font-medium uppercase tracking-[0.1em] max-w-xl mx-auto">Join the elite ranks today. Start your journey toward technical supremacy.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-white text-indigo-900 font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-50 transition-all active:scale-95"
          >
            Start Now <Rocket className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, tag }) => (
  <motion.div
    whileHover={{ y: -10 }}
    transition={{ type: 'spring', damping: 15 }}
  >
    <Card3D className="group p-10 glass-panel rounded-[40px] border border-white/5 h-full hover:border-indigo-500/50 transition-all duration-500 shadow-3xl">
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
          <Icon className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 border border-white/10">{tag}</div>
      </div>
      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4 group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed text-sm">
        {desc}
      </p>
    </Card3D>
  </motion.div>
);

const Stat = ({ value, label }) => (
  <div className="space-y-4">
    <div className="text-5xl sm:text-7xl font-black italic tracking-tighter text-white">
      {value}
    </div>
    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">{label}</div>
  </div>
);

export default Home;
