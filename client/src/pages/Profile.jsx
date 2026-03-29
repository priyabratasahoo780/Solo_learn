import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Save, AlertCircle, X, ShieldCheck, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ActivityHeatmap from '../components/ActivityHeatmap';
import PerformanceChart from '../components/PerformanceChart';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await api.get('/certificates');
        setCertificates(data.data || []);
      } catch (err) {
        console.error('Failed to fetch certificates', err);
      }
    };
    fetchCerts();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await updateProfile({ name, email, avatar });
      if (res.success) {
        toast.success('Profile credentials updated!');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12">
        <div className="space-y-4">
          <div className="badge-sketch">Academic Identity Hub</div>
          <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter leading-none uppercase">
            STUDENT <span className="text-orange-500">PROFILE</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs max-w-xl">
            Manage your institutional enrollment, review technical performance metrics, and optimize your engineering path.
          </p>
        </div>
        <div className="icon-circle-sketch h-16 w-16 bg-white shadow-[6px_6px_0px_0px_#cbd5e1]">
          <User className="w-8 h-8 text-oxford-blue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Enrollment Credentials */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sketch-card p-10 bg-white shadow-[8px_8px_0px_0px_#cbd5e1]"
          >
            <div className="flex items-center gap-5 mb-10 border-b-[2px] border-dashed border-slate-100 pb-8">
              <div className="relative group cursor-pointer shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-[3px] border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722]" />
                ) : (
                  <div className="icon-circle-sketch h-20 w-20 bg-slate-50 border-oxford-blue shadow-[4px_4px_0px_0px_#FF5722]">
                    <User className="w-10 h-10 text-oxford-blue" />
                  </div>
                )}
                <div className="absolute inset-0 bg-oxford-blue/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[8px] font-black uppercase text-center leading-tight">CHANGE<br/>PHOTO</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Click to upload profile photo" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">Enrollment</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-orange-50 border-[2px] border-orange-500 p-5 rounded-2xl flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <p className="text-xs text-orange-700 font-black uppercase tracking-tight">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-3 block ml-1">Full Legal Alias</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-2xl py-4 px-6 text-oxford-blue font-bold focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all text-sm placeholder:text-slate-300 shadow-[4px_4px_0px_0px_#cbd5e1]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-3 block ml-1">Institutional Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-200 border-[3px] border-slate-300 rounded-2xl py-4 px-6 text-slate-500 cursor-not-allowed text-sm font-bold opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-sketch w-full py-5 text-xs font-black"
              >
                {isLoading ? 'DOCUMENTING...' : <><Save className="w-5 h-5" /> RE-SIGN CREDENTIALS</>}
              </button>
            </form>
          </motion.div>

          {/* Academic Stats Module */}
          <div className="sketch-card p-8 bg-oxford-blue text-white shadow-[8px_8px_0px_0px_#FF5722] flex items-center justify-around text-center">
             <div className="space-y-1">
                <div className="text-3xl font-black italic tracking-tighter text-white leading-none">{user?.xp || 0}</div>
                <div className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em]">Global XP</div>
             </div>
             <div className="h-10 w-[2px] bg-white/10"></div>
             <div className="space-y-1">
                <div className="text-3xl font-black italic tracking-tighter text-white leading-none">{user?.coins || 0}</div>
                <div className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em]">Solocoins</div>
             </div>
             <div className="h-10 w-[2px] bg-white/10"></div>
             <div className="space-y-1">
                <div className="text-3xl font-black italic tracking-tighter text-white leading-none">{user?.certificates?.length || 0}</div>
                <div className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em]">Awards</div>
             </div>
          </div>
        </div>

        {/* Right Columns: Performance Intel */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="sketch-card bg-white p-2 shadow-[12px_12px_0px_0px_#cbd5e1]"
          >
            <PerformanceChart user={user} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sketch-card bg-white p-2 shadow-[12px_12px_0px_0px_#cbd5e1]"
          >
            <ActivityHeatmap user={user} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="sketch-card p-8 bg-white border-oxford-blue flex items-center gap-6 shadow-[6px_6px_0px_0px_#cbd5e1]">
                <div className="icon-circle-sketch h-14 w-14 bg-emerald-50 border-emerald-500 text-emerald-600">
                   <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                   <h4 className="text-oxford-blue font-black text-sm uppercase italic tracking-tighter leading-none mb-2">Elite Verification</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authorized for high-stakes PvP duels.</p>
                </div>
             </div>
             <div className="sketch-card p-8 bg-white border-oxford-blue flex items-center gap-6 shadow-[6px_6px_0px_0px_#cbd5e1]">
                <div className="icon-circle-sketch h-14 w-14 bg-orange-50 border-orange-500 text-orange-600">
                   <Award className="w-7 h-7" />
                </div>
                <div>
                   <h4 className="text-oxford-blue font-black text-sm uppercase italic tracking-tighter leading-none mb-2">Academic Contributor</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ranked in the top 1% for content creation.</p>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Verified Credentials Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sketch-card p-12 bg-white shadow-[12px_12px_0px_0px_#FF5722] border-oxford-blue relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Award className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-b-[3px] border-dashed border-slate-100 pb-10">
           <div className="space-y-4">
              <div className="badge-sketch bg-orange-500 text-white shadow-[3px_3px_0px_0px_#002D72]">Verified Diplomas</div>
              <h3 className="text-4xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">Academic <span className="text-orange-500">Hall of Fame</span></h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your institutional validations for technical mastery.</p>
           </div>
           <button 
             onClick={() => navigate('/certificates')}
             className="btn-sketch px-10 py-4 text-xs flex items-center gap-3"
           >
             EXPAND ARCHIVE <ArrowRight className="w-4 h-4" />
           </button>
        </div>

        {certificates.length === 0 ? (
          <div className="py-12 text-center space-y-6">
             <div className="icon-circle-sketch h-20 w-20 mx-auto bg-slate-50 border-slate-200 text-slate-300">
                <ShieldCheck className="w-10 h-10" />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs italic">No major credentials detected in local storage.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {certificates.slice(0, 4).map((cert) => (
              <div 
                key={cert._id}
                onClick={() => navigate('/certificates')}
                className="sketch-card p-6 bg-slate-50 border-[2px] border-oxford-blue hover:bg-white hover:border-orange-500 hover:shadow-[6px_6px_0px_0px_#002D72] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-circle-sketch h-10 w-10 bg-white border-oxford-blue shadow-[3px_3px_0px_0px_#FF5722] group-hover:rotate-12 transition-transform">
                    <Award className="w-5 h-5 text-oxford-blue" />
                  </div>
                  <div className="badge-sketch bg-oxford-blue text-white py-1 px-3 text-[8px] tracking-[0.2em]">VERIFIED</div>
                </div>
                <h4 className="font-black text-oxford-blue text-[13px] uppercase italic tracking-tighter leading-tight mb-2 truncate">
                  {cert.title}
                </h4>
                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                  <ExternalLink className="w-3 h-3 group-hover:text-orange-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
