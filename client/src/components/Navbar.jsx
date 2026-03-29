import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Menu, X, User, LogOut, Code2, Trophy, Award, 
  FileText, Globe, Settings, Briefcase, Video, 
  Zap, Compass, LayoutDashboard, ChevronRight,
  BookOpen, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      name: 'Learning Curriculum',
      links: [
        { path: '/', label: 'Command Center', icon: LayoutDashboard },
        { path: '/quizzes', label: 'Knowledge Labs', icon: BookOpen },
        { path: '/sandbox', label: 'Neural Sandbox', icon: Code2 },
      ]
    },
    {
      name: 'Elite Battleground',
      links: [
        { path: '/battleground', label: 'Skill Duels', icon: Zap },
        { path: '/leaderboard', label: 'Global Rankings', icon: Trophy },
        { path: '/certificates', label: 'My Diplomas', icon: Award },
        { path: '/rewards', label: 'Asset Vault', icon: Sparkles },
      ]
    },
    {
      name: 'Recruitment Intel',
      links: [
        { path: '/interview-prep', label: 'Interview Mastery', icon: Briefcase },
        { path: '/mock-interview', label: 'AI Mock Simulation', icon: Video },
        { path: '/architect', label: 'Career Architect', icon: Compass },
      ]
    },
    {
      name: 'Academy Administration',
      adminOnly: true,
      links: [
        { path: '/create-quiz', label: 'Create Quiz', icon: Sparkles },
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8 bg-white border-r-[3px] border-oxford-blue">
      {/* Academy Brand */}
      <Link to="/" className="flex items-center gap-4 mb-16 px-2 group">
        <div className="icon-circle-sketch group-hover:bg-oxford-blue group-hover:text-white transition-all duration-300">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-oxford-blue italic tracking-tighter leading-none">SOLO<span className="text-orange-500">LEARN</span></span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Academy Sketch</span>
        </div>
      </Link>

      {/* Navigation Ecosystem */}
      <div className="flex-1 space-y-10 overflow-y-auto pr-2 custom-scrollbar">
        {navGroups.map((group) => {
          return (
          <div key={group.name} className="space-y-4">
             <h4 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] px-4">{group.name}</h4>
             <div className="space-y-2">
               {group.links.map((link) => {
                 const isActive = location.pathname === link.path;
                 return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between group px-5 py-3.5 rounded-2xl transition-all duration-300 border-[2px]
                        ${isActive 
                          ? 'bg-oxford-blue border-oxford-blue text-white shadow-[4px_4px_0px_0px_#FF5722]' 
                          : 'text-oxford-blue border-transparent hover:bg-slate-50 hover:border-oxford-blue hover:translate-x-1'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                         <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-oxford-blue'} transition-colors`} />
                         <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-oxford-blue'} transition-colors`}>{link.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                    </Link>
                 );
               })}
             </div>
          </div>
        )})}
      </div>

      {/* Student Profile Card (Sketch View) */}
      <div className="mt-auto pt-8 border-t-[2px] border-dashed border-slate-200">
        {user ? (
          <div className="p-4 rounded-3xl bg-slate-50 border-[2px] border-oxford-blue relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-2xl object-cover shadow-[3px_3px_0px_0px_#FF5722] border-[2px] border-white" />
                ) : (
                  <div className="w-12 h-12 bg-oxford-blue rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-[3px_3px_0px_0px_#FF5722] border-[2px] border-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-oxford-blue truncate uppercase">{user.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Member</span>
                  </div>
                </div>
             </div>
             
             <div className="flex gap-2 w-full mt-4">
               <button 
                onClick={() => navigate('/profile')}
                className="flex-1 py-3 bg-white hover:bg-slate-50 text-oxford-blue rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-[2px] border-oxford-blue flex items-center justify-center gap-2"
               >
                  <Settings className="w-3 h-3" />
                  Settings
               </button>
               <button 
                onClick={handleLogout}
                className="flex-1 py-3 bg-white hover:bg-orange-50 text-oxford-blue rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-[2px] border-oxford-blue flex items-center justify-center gap-2"
               >
                  <LogOut className="w-3 h-3" />
                  Sign Out
               </button>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
             <Link to="/login" className="btn-sketch-outline text-center py-4">Portal Access</Link>
             <Link to="/signup" className="btn-sketch text-center py-4">Enroll Free <ArrowRight className="w-4 h-4" /></Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Command Hub */}
      <div className="lg:hidden fixed top-0 w-full z-[80] p-4 flex justify-between items-center bg-white border-b-[3px] border-oxford-blue">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-oxford-blue p-2 rounded-xl h-9 w-9 flex items-center justify-center shadow-[2px_2px_0px_0px_#FF5722] border-[2px] border-white">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-oxford-blue text-lg italic tracking-tighter leading-none">SOLO<span className="text-orange-500">LEARN</span></span>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-slate-50 rounded-xl border-[2px] border-oxford-blue text-oxford-blue active:translate-y-1 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Persistent Workspace Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 z-50">
         <SidebarContent />
      </aside>

      {/* Mobile Curtain Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-oxford-blue/40 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 shadow-2xl z-[100]"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-8 right-8 p-3 bg-white rounded-2xl text-oxford-blue border-[2px] border-oxford-blue hover:bg-slate-50 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
