import { useRef, useState } from 'react';
// import html2canvas from 'html2canvas'; // No longer needed
// import jsPDF from 'jspdf'; // No longer needed
import { Download, Award, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

const Certificate = ({ certificate }) => {
  const { user } = useAuth();
  const certRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Use the new backend endpoint for official PDF
      const response = await api.get(`/certificates/${certificate._id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certificate.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      // Fallback or error notification could go here
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDateFormal = (dateString) => {
    if (!dateString) return 'The Present Day';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `This ${getOrdinal(day)} day of ${month}, ${year}`;
  };

  return (
    <div className="flex flex-col items-center gap-10 pb-12 w-full max-w-full overflow-hidden">
      {/* Visual Certificate Card - Premium Diploma Edition */}
      <div 
        ref={certRef}
        className="relative w-full aspect-[1.414/1] max-w-3xl bg-[#FCFBF7] border-[12px] border-double border-[#C5A059] p-2 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden group"
      >
        {/* Ornate Corner Decorations */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C5A059]/40 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C5A059]/40 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-lg" />

        {/* Inner Content Border */}
        <div className="relative h-full border-[1px] border-[#C5A059]/30 flex flex-col justify-between py-10 sm:py-14 px-6 sm:px-12 bg-white/40 backdrop-blur-[2px]">
          
          {/* Header Section */}
          <div className="space-y-4 text-center">
            <div className="relative inline-block mb-2">
               <Award className="w-16 h-16 text-[#C5A059] mx-auto filter drop-shadow-md" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-2 border-dashed border-[#C5A059]/20 rounded-full scale-150"
               />
            </div>
            <h2 className="text-2xl sm:text-4xl font-['Cinzel'] font-black text-oxford-blue tracking-[0.2em] uppercase leading-none">
              Diploma of <span className="text-[#C5A059]">Excellence</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Verified Professional Credential</p>
          </div>

          {/* Student Identification */}
          <div className="space-y-6 text-center">
            <p className="text-xs sm:text-base text-slate-500 font-['Libre_Baskerville'] italic">It is hereby certified that</p>
            <div className="relative">
              <h1 className="text-2xl sm:text-5xl font-['Libre_Baskerville'] font-bold text-oxford-blue tracking-tighter capitalize py-4">
                {user?.name || 'Academic Scholar'}
              </h1>
              <div className="w-32 sm:w-64 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent mx-auto" />
            </div>
            <p className="text-xs sm:text-base text-slate-500 font-['Libre_Baskerville'] italic">has demonstrated superior competence and successfully mastered</p>
            <h3 className="text-lg sm:text-3xl font-['Cinzel'] font-bold text-[#C5A059] tracking-wider uppercase">
              {certificate?.title || 'Core Intelligence Module'}
            </h3>
          </div>

          {/* Verification & Signatures */}
          <div className="grid grid-cols-3 items-end gap-4 mt-8">
            {/* Left: Formal Date */}
            <div className="text-center">
              <p className="text-[9px] sm:text-xs text-slate-800 font-['Dancing_Script'] font-bold h-8 flex items-end justify-center">
                {new Date(certificate?.issueDate).toLocaleDateString()}
              </p>
              <div className="w-full h-[1px] bg-slate-200 mt-1 mb-2" />
              <p className="text-[7px] sm:text-[9px] text-slate-400 font-black uppercase tracking-widest">Date of Attainment</p>
            </div>
            
            {/* Center: Official Seal */}
            <div className="flex justify-center relative -bottom-4">
              <div className="relative group/seal">
                 <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[1px] border-[#C5A059]/40 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-xl">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#E6B34B] via-[#C5A059] to-[#8E6D2F] flex items-center justify-center text-white shadow-inner relative overflow-hidden">
                       <ShieldCheck className="w-10 h-10 sm:w-14 sm:h-14 filter drop-shadow-lg" />
                       <div className="absolute inset-0 bg-white/10 rotate-45 transform translate-y-1/2" />
                    </div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-[#C5A059]/20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Right: Real Signature */}
            <div className="text-center">
              <p className="text-2xl sm:text-3xl text-oxford-blue font-['Dancing_Script'] font-bold h-8 flex items-end justify-center">
                Sahoo Priyabrata
              </p>
              <div className="w-full h-[1px] bg-slate-200 mt-1 mb-2" />
              <p className="text-[7px] sm:text-[9px] text-slate-400 font-black uppercase tracking-widest">Academy Provost</p>
            </div>
          </div>

          {/* Bottom Accreditation Footer */}
          <div className="text-center pt-8 border-t-[1px] border-dashed border-slate-100 flex justify-between items-center opacity-40">
             <span className="text-[7px] font-black uppercase tracking-[0.3em]">Institutional Verification Required</span>
             <span className="text-[7px] font-black uppercase tracking-[0.3em] font-mono">{certificate?.certificateCode || 'AX-772-B'}</span>
             <span className="text-[7px] font-black uppercase tracking-[0.3em]">SoloLearn Academy Official</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2 px-8 py-3 bg-[#C5A059] hover:bg-[#b08d4a] text-white rounded-full shadow-lg hover:shadow-xl transition-all font-bold tracking-wide uppercase text-sm disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Official PDF
          </>
        )}
      </button>
    </div>
  );
};



export default Certificate;
