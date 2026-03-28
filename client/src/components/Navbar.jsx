import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Menu, X, User, LogOut, Code2, Trophy, Award, 
  FileText, Globe, Settings, Briefcase, Video, 
  Zap, Compass, LayoutDashboard, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    const langs = ['en', 'es', 'fr'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  const navGroups = [
    {
      name: 'Training',
      links: [
        { path: '/', label: t('home'), icon: LayoutDashboard },
        { path: '/quizzes', label: 'Quizzes', icon: Code2 },
        { path: '/sandbox', label: 'Sandbox', icon: Code2 },
      ]
    },
    {
      name: 'Battleground',
      links: [
        { path: '/battleground', label: 'Battles', icon: Zap },
        { path: '/leaderboard', label: t('leaderboard'), icon: Trophy },
        { path: '/rewards', label: t('rewards'), icon: Award },
      ]
    },
    {
      name: 'Recruitment Hub',
      links: [
        { path: '/interview-prep', label: 'Prep Hub', icon: Briefcase },
        { path: '/mock-interview', label: 'AI Mock', icon: Video },
        { path: '/architect', label: 'AI Architect', icon: Compass },
      ]
    },
    {
      name: 'Community',
      links: [
        { path: '/feed', label: 'Universal Feed', icon: Globe },
        { path: '/certificates', label: 'My Wallet', icon: FileText },
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
      {/* Brand Section */}
      <Link to="/" className="flex items-center gap-3 mb-12 group cursor-pointer">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-2xl shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
          <Code2 className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tight text-white italic">SoloLearn</span>
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em] -mt-1">Engineer OS</span>
        </div>
      </Link>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-10 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.name}>
             <h4 className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-4 pl-4">{group.name}</h4>
             <div className="space-y-1">
               {group.links.map((link) => {
                 const isActive = location.pathname === link.path;
                 return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between group px-4 py-3 rounded-2xl transition-all duration-300 border
                        ${isActive 
                          ? 'bg-indigo-600/10 border-indigo-500/20 text-white shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
                          : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5 hover:border-white/5'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                         <link.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'text-gray-600 group-hover:text-indigo-400'} transition-colors`} />
                         <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{link.label}</span>
                      </div>
                      {isActive && <motion.div layoutId="active-nav" className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
                    </Link>
                 );
               })}
             </div>
          </div>
        ))}
      </div>

      {/* Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <button 
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-xs text-gray-400 font-bold"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Region: {language.toUpperCase()}</span>
          </div>
          <ChevronRight className="w-3 h-3" />
        </button>

        {user ? (
          <div className="space-y-3">
             <Link 
              to="/profile" 
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-600/10 to-transparent rounded-2xl border border-indigo-500/10 group overflow-hidden relative"
             >
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                   {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="text-xs font-black text-white truncate">{user.name}</div>
                   <div className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Premium Sub</div>
                </div>
                <Settings className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
             </Link>
             <button 
              onClick={handleLogout}
              className="w-full py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-600/20"
             >
                Shutdown Session
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
             <Link to="/login" className="py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest text-center rounded-2xl transition-all">Login</Link>
             <Link to="/signup" className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest text-center rounded-2xl transition-all shadow-lg shadow-indigo-600/10">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 w-full z-[80] p-4 flex justify-between items-center glass-panel bg-black/60 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg"><Code2 className="h-5 w-5 text-white" /></div>
          <span className="font-black text-white text-base">SoloLearn</span>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-white/5 rounded-xl border border-white/10 text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar Container */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-[#0a0b14] border-r border-white/5 z-50">
         <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#0a0b14] shadow-2xl z-[100]"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-xl text-white border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
