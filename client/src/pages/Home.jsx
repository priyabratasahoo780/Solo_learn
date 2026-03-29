import { Link } from 'react-router-dom';
import { Terminal, Code2, Users, Trophy, Zap, Shield, ArrowRight, Sparkles, Cpu, Globe, Rocket, ShieldCheck, ChevronRight, BookOpen, GraduationCap, Microscope } from 'lucide-react';
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
    <div ref={containerRef} className="relative space-y-32 pb-32 overflow-hidden bg-slate-50 font-medium">
      {/* Academy Sketch Background Patterns */}
      <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#002D72 1px, transparent 1px)', backgroundSize: '100% 40px' }} />

      {/* Hero Section: Institutional Gateway */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-6 pt-24 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-lg bg-oxford-blue text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 border-2 border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722]"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            Academy Node Initialized: V2.5
          </motion.div>

          <div className="space-y-6">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-oxford-blue xl:leading-[0.8] leading-[1.1] italic uppercase title-fredoka">
              <motion.span 
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                 className="block drop-shadow-[2px_2px_0px_#FF5722] sm:drop-shadow-[4px_4px_0px_#FF5722] mb-2 sm:mb-0"
              >
                STUDY
              </motion.span>
              <motion.span 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                 className="block text-[#FF5722] drop-shadow-[2px_2px_0px_#002D72] sm:drop-shadow-[4px_4px_0px_#002D72]"
              >
                ENGINEERING
              </motion.span>
            </h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.5 }}
            className="text-lg sm:text-2xl text-slate-500 max-w-3xl mx-auto font-black uppercase tracking-widest italic border-b-[3px] border-dashed border-slate-200 pb-8"
          >
            "The world's premier digital institution for technical mastery. <br/> 
            Simulations. Battlegrounds. Certifications."
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-10 pt-8"
          >
            <Link
              to="/signup"
              className="btn-sketch py-6 px-16 text-sm hover:-translate-y-1 active:translate-y-0.5"
            >
              ENROLL NOW <ChevronRight className="w-6 h-6 text-orange-400" />
            </Link>
            <Link
              to="/quizzes"
              className="btn-sketch-outline py-6 px-16 text-sm bg-white text-oxford-blue border-oxford-blue hover:shadow-[10px_10px_0px_0px_#FF5722] hover:-translate-y-1 active:translate-y-0.5"
            >
              MODULE ARCHIVE
            </Link>
          </motion.div>
        </div>

        {/* Scroll Protocol Indicator */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-oxford-blue italic">Scroll to Explore Protocol</div>
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[2px] h-16 bg-gradient-to-b from-orange-500 to-transparent" 
          />
        </motion.div>
      </section>

      {/* Feature Departments */}
      <section className="container mx-auto px-6 space-y-20">
        <div className="text-center space-y-4">
           <h2 className="text-4xl sm:text-6xl font-black text-oxford-blue italic uppercase tracking-tighter">OUR <span className="text-orange-500 underline decoration-dashed underline-offset-8">DEPARTMENTS</span></h2>
           <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Operational Mastery Modules</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={Cpu}
            title="3D PROTOTYPING"
            desc="Step into interactive arenas where theoretical challenges materialize as real-time 3D simulations."
            tag="MASTERCLASS"
          />
          <FeatureCard 
            icon={Trophy}
            title="GLOBAL RANKING"
            desc="Authorize your skills in international duels. Earn prestigious certifications and secure dominance."
            tag="COMPETITIVE"
          />
          <FeatureCard 
            icon={GraduationCap}
            title="RESEARCH LABS"
            desc="Collaborate with world-class engineers. Review institutional records, create labs, and grow."
            tag="ACADEMIC"
          />
        </div>
      </section>
      
      {/* Institutional Evidence (Testimonials) */}
      <section className="space-y-16 py-20 bg-white/50 border-y-[3px] border-dashed border-slate-200">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black text-oxford-blue italic uppercase tracking-tighter">ACADEMIC <span className="text-orange-500">REPORTS</span></h2>
          <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Institutional Integrity Record</p>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <ReviewsCarousel />
        </div>
      </section>

      {/* Institutional Benchmarks (Metrics) */}
      <section className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sketch-card bg-white p-16 sm:p-24 border-oxford-blue shadow-[12px_12px_0px_0px_#FF5722] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12"><Microscope className="w-64 h-64 text-oxford-blue" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 text-center relative z-10">
            <Stat value="100K+" label="AUTHORIZED UNITS" />
            <Stat value="45+" label="STUDY SECTORS" />
            <Stat value="5M+" label="LABS COMPLETED" />
          </div>
        </motion.div>
      </section>

      {/* FINAL DIRECTIVE (CTA) */}
      <section className="text-center py-24 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto sketch-card bg-oxford-blue p-16 sm:p-24 border-oxford-blue shadow-[15px_15px_0px_0px_#FF5722] space-y-12 group transition-all">
          <h2 className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">INITIALIZE <span className="text-orange-500">CAREER PROTOCOL</span></h2>
          <p className="text-slate-300 font-black uppercase tracking-[0.1em] text-xs max-w-2xl mx-auto italic leading-relaxed">
             Submit your enrollment application today. Join the elite institutional ranks and redefine technical supremacy.
          </p>
          <Link
            to="/signup"
            className="btn-sketch py-6 px-16 text-sm bg-white text-oxford-blue border-white shadow-[10px_10px_0px_0px_#FF5722] hover:bg-slate-50 transition-all"
          >
            START ENROLLMENT <Rocket className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, tag }) => (
  <motion.div
    whileHover={{ y: -8, rotate: -1 }}
    transition={{ type: 'spring', damping: 12 }}
    className="h-full"
  >
    <div className="sketch-card group p-12 bg-white border-oxford-blue h-full shadow-[8px_8px_0px_0px_#cbd5e1] hover:shadow-[10px_10px_0px_0px_#FF5722] transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div className="icon-circle-sketch h-16 w-16 border-[2px] shadow-[4px_4px_0px_0px_#cbd5e1] group-hover:shadow-[4px_4px_0px_0px_#FF5722] transition-all">
            <Icon className="w-8 h-8 text-oxford-blue" />
          </div>
          <div className="badge-sketch bg-slate-50 border-oxford-blue text-slate-400 text-[8px]">{tag}</div>
        </div>
        <h3 className="text-2xl font-black text-oxford-blue italic uppercase tracking-tighter title-fredoka leading-none">{title}</h3>
        <p className="text-slate-500 font-bold leading-relaxed text-sm italic">
          "{desc}"
        </p>
      </div>
      
      <div className="mt-8 pt-8 border-t-[3px] border-dashed border-slate-100 flex items-center gap-3 text-oxford-blue font-black uppercase italic tracking-widest text-[10px]">
         Read Department Protocol <ChevronRight className="w-4 h-4 text-orange-500" />
      </div>
    </div>
  </motion.div>
);

const Stat = ({ value, label }) => (
  <div className="space-y-4">
    <div className="text-6xl sm:text-8xl font-black italic tracking-tighter text-oxford-blue drop-shadow-[4px_4px_0px_#FF5722]">
      {value}
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">{label}</div>
  </div>
);

export default Home;
