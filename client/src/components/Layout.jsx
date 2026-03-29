import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import GlobalSearch from './GlobalSearch';
import { useState } from 'react';

const Layout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toastStyle = {
    background: 'rgba(30, 41, 59, 0.9)',
    backdropFilter: 'blur(8px)',
    color: '#f8fafc',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div className="min-h-screen bg-[#05060b] font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-500/30 transition-colors duration-300 flex">
      {/* Fixed Sidebar */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 pt-[72px] lg:pt-0 lg:pl-[288px]">
        <div className="flex-1 py-8 sm:py-12 px-4 sm:px-10 lg:px-20 w-screen sm:w-full max-w-[1600px] mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: toastStyle,
          className: 'glass-panel border-white/10 text-white rounded-2xl font-bold text-xs' 
        }} 
      />
      <GlobalSearch isOpen={isSearchOpen} onClose={setIsSearchOpen} />
    </div>
  );
};

export default Layout;
