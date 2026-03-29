import { useState, useEffect } from 'react';
import api from '../services/api';
import Certificate from '../components/Certificate';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await api.get('/certificates');
        setCertificates(data.data);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-16 pb-24">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12">
        <div className="space-y-4">
          <div className="badge-sketch">Official Academic Archive</div>
          <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter leading-none uppercase">
            STUDENT <span className="text-orange-500">DIPLOMAS</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs max-w-xl">
             Your verified technical credentials. Certificates are issued upon achieving a scoring threshold of 80% or higher in major intelligence modules.
          </p>
        </div>
        <div className="icon-circle-sketch h-16 w-16 bg-white shadow-[6px_6px_0px_0px_#cbd5e1]">
          <Award className="w-8 h-8 text-oxford-blue" />
        </div>
      </div>
 
       {certificates.length === 0 ? (
         <div className="sketch-card p-24 text-center bg-white border-dashed shadow-[12px_12px_0px_0px_#cbd5e1]">
           <div className="icon-circle-sketch h-20 w-20 mx-auto mb-8 bg-slate-50 text-slate-300 border-slate-200">
             <Lock className="w-10 h-10" />
           </div>
           <h3 className="text-3xl font-black text-oxford-blue italic tracking-tighter uppercase mb-3">Archive Restricted</h3>
           <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Complete an intelligence module with 80%+ accuracy to unlock your first diploma.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 gap-16">
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
               {certificates.map((cert) => (
                 <motion.div 
                   key={cert._id} 
                   whileHover={{ y: -5 }}
                   className="relative group"
                 >
                   <button
                     onClick={() => setSelectedCert(cert)}
                     className={`w-full p-6 bg-white border-[3px] transition-all text-left relative z-0 overflow-hidden ${selectedCert?._id === cert._id ? 'border-orange-500 shadow-[8px_8px_0px_0px_#002D72]' : 'border-oxford-blue shadow-[6px_6px_0px_0px_#cbd5e1] hover:shadow-[10px_10px_0px_0px_#FF5722]'}`}
                   >
                     <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
                     <div className="icon-circle-sketch h-12 w-12 bg-white border-oxford-blue mb-6 shadow-[3px_3px_0px_0px_#cbd5e1]">
                        <Award className="w-6 h-6 text-oxford-blue" />
                     </div>
                     <h4 className="font-black text-oxford-blue text-sm uppercase italic tracking-tighter leading-snug mb-2 line-clamp-2">{cert.title}</h4>
                     <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{new Date(cert.issueDate).toLocaleDateString()}</p>
                   </button>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       window.open(`${api.defaults.baseURL}/certificates/${cert._id}/download`, '_blank');
                     }}
                     className="absolute top-4 right-4 p-2.5 bg-oxford-blue text-white rounded-xl shadow-[3px_3px_0px_0px_#FF5722] opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110"
                     title="Download PDF Archive"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                   </button>
                 </motion.div>
               ))}
            </div>
 
            {/* Selected High-Stakes Inspection */}
            <AnimatePresence>
              {selectedCert && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="sketch-card bg-white p-12 lg:p-16 border-[4px] border-oxford-blue shadow-[16px_16px_0px_0px_#FF5722] relative overflow-hidden flex justify-center"
                >
                   <div className="absolute inset-0 sketch-grid opacity-10 pointer-events-none" />
                   <div className="absolute top-10 right-10">
                      <div className="badge-sketch bg-oxford-blue text-white shadow-[4px_4px_0px_0px_#FF5722] animate-pulse">
                         OFFICIAL ACADEMIC SEAL
                      </div>
                   </div>
                   <div className="relative z-10 w-full max-w-3xl transform scale-110 origin-center py-10">
                     <Certificate certificate={selectedCert} />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
       )}
    </div>
  );
};

export default Certificates;
