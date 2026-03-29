import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AITutor from './AITutor';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// [SKETCH ACADEMY] Force Refresh - UI Overhaul V2
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-oxford-blue selection:bg-orange-500/20 relative overflow-x-hidden">
      {/* Primary Strategic Sidebar */}
      <Navbar />

      {/* Main Study Arena */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-500 lg:pl-72 relative z-10">
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Integrated Academic Assistant */}
      <AITutor />

      <Toaster 
        position="top-center" 
        toastOptions={{ 
          duration: 4000,
          className: 'sketch-card border-[3px] border-oxford-blue text-oxford-blue bg-white rounded-2xl font-black text-xs px-6 py-4 shadow-[4px_4px_0px_0px_#FF5722]' 
        }} 
      />
    </div>
  );
};

export default Layout;
