import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

import { toast } from 'react-hot-toast'; // Updated to react-hot-toast
import { Plus, Trash2, Save, X, Settings, CheckCircle, Lock, Unlock } from 'lucide-react';
import { Card3D } from '../components/Card3D';

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HTML');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answerIndex: 0, explanation: '' }
  ]);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const ADMIN_SECRET = "ADMIN@123";

  const handleUnlock = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_SECRET) {
      setIsAdminUnlocked(true);
      toast.success('Admin Access Granted!');
    } else {
      toast.error('Incorrect Admin Password');
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl max-w-md w-full text-center border-[3px] border-oxford-blue shadow-[8px_8px_0px_0px_#FF5722]"
        >
          <div className="w-20 h-20 bg-orange-100 border-[3px] border-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <Lock className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-2xl font-black text-oxford-blue mb-2 uppercase italic tracking-tighter leading-none">Security Clearance</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-4 mb-8">This facility is restricted. Enter clearance code to proceed.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-2xl p-4 text-oxford-blue focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-black text-center tracking-widest"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="btn-sketch w-full py-4 flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              Unlock Section
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answerIndex: 0, explanation: '' }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in title and description');
      return;
    }
    
    // Validate all questions
    for (const q of questions) {
      if (!q.question || q.options.some(o => !o)) {
        toast.error('Please fill in all questions and options');
        return;
      }
    }

    const newQuiz = {
      id: Date.now().toString(),
      title,
      description,
      category,
      difficulty,
      createdBy: user.name,
      createdById: user.id,
      createdAt: new Date().toISOString(),
      pointsPerQuestion: 10, // Default
      questions
    };


// ...

    try {
      // API call to create quiz
      await api.post('/quizzes', newQuiz);
      toast.success('Challenge Created Successfully!', { icon: '🚀' });
      navigate('/quizzes');
    } catch (err) {
      console.error('Failed to create quiz:', err);
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-[3px] border-dashed border-slate-200 pb-12 px-4 sm:px-0">
        <div className="space-y-4">
          <div className="badge-sketch bg-oxford-blue text-white shadow-[3px_3px_0px_0px_#FF5722] w-fit">Academy Administration</div>
          <h1 className="text-5xl sm:text-6xl font-black text-oxford-blue italic tracking-tighter leading-none uppercase">
            Create <span className="text-orange-500">Subject</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[10px] max-w-xl">
            Design rigorous technical challenges to augment the institutional curriculum.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="btn-sketch text-xs shrink-0"
        >
          <Save className="w-5 h-5" />
          PUBLISH TO DATABASE
        </button>
      </div>
      
      <div className="grid gap-8 px-4 sm:px-0">
        {/* Quiz Metadata */}
        <div className="sketch-card p-8 sm:p-12 bg-white shadow-[12px_12px_0px_0px_#cbd5e1] border-[3px] border-oxford-blue">
           <div className="flex items-center gap-5 border-b-[3px] border-dashed border-slate-200 pb-8 mb-10">
              <div className="icon-circle-sketch h-16 w-16 bg-slate-50 shadow-[4px_4px_0px_0px_#FF5722]">
                <Settings className="w-8 h-8 text-oxford-blue animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-oxford-blue italic uppercase tracking-tighter leading-none">Settings Matrix</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Subject Title</label>
               <input
                 type="text"
                 className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-2xl py-4 px-6 text-oxford-blue font-bold focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all text-sm placeholder:text-slate-300 shadow-[4px_4px_0px_0px_#cbd5e1]"
                 placeholder="e.g. Master React Hooks"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
             </div>
             <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Major Category</label>
               <select
                 className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-2xl py-4 px-6 text-oxford-blue font-bold focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all text-sm appearance-none cursor-pointer shadow-[4px_4px_0px_0px_#cbd5e1]"
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
               >
                 {['HTML', 'CSS', 'JavaScript', 'ReactJS', 'NextJs', 'AngularJS', 'Java', 'SQL', 'NoSQL'].map(c => (
                   <option key={c} value={c}>{c}</option>
                 ))}
               </select>
             </div>
             <div className="md:col-span-2 space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1">Curriculum Details</label>
               <textarea
                 className="w-full bg-slate-50 border-[3px] border-oxford-blue rounded-2xl py-4 px-6 text-oxford-blue font-black focus:outline-none focus:ring-8 focus:ring-oxford-blue/5 transition-all text-sm placeholder:text-slate-300 shadow-[4px_4px_0px_0px_#cbd5e1] min-h-[140px] resize-none"
                 placeholder="What engineering capabilities will developers acquire?"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
               />
             </div>
           </div>
        </div>
 
        {/* Questions Editor */}
        <div className="space-y-12">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="sketch-card p-8 sm:p-12 bg-white border-[3px] border-oxford-blue shadow-[10px_10px_0px_0px_#cbd5e1] group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                <CheckCircle className="w-64 h-64" />
              </div>

              <div className="flex justify-between items-center mb-10 border-b-[3px] border-dashed border-slate-200 pb-6 relative z-10">
                <div className="badge-sketch bg-oxford-blue text-white py-1.5 px-4 text-[10px] tracking-[0.3em] shadow-[3px_3px_0px_0px_#FF5722]">
                  BLOCK {qIndex + 1}
                </div>
                <button
                  onClick={() => handleRemoveQuestion(qIndex)}
                  disabled={questions.length === 1}
                  className="icon-circle-sketch h-10 w-10 border-[3px] border-slate-200 bg-white text-slate-400 hover:border-orange-500 hover:text-orange-500 hover:shadow-[4px_4px_0px_0px_#FF5722] transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

                           className={`w-8 h-8 rounded-xl border-[3px] flex items-center justify-center transition-all bg-white relative z-10 shadow-[2px_2px_0px_0px_#cbd5e1] shrink-0
                             ${q.answerIndex === oIndex ? 'border-orange-500 bg-orange-500 shadow-[2px_2px_0px_0px_#FF5722]' : 'border-slate-300 group-hover/option:border-oxford-blue text-transparent'}`}
                         >
                            {q.answerIndex === oIndex && <CheckCircle className="w-5 h-5 text-white" />}
                         </button>
                         <input
                           type="text"
                           className={`w-full bg-white rounded-xl py-3 px-5 font-bold focus:outline-none transition-all text-sm placeholder:text-slate-300 border-[3px] 
                             ${q.answerIndex === oIndex ? 'border-orange-500 text-orange-600 shadow-[3px_3px_0px_0px_#FF5722]' : 'border-slate-200 text-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] focus:border-oxford-blue focus:shadow-[3px_3px_0px_0px_#002D72]'}`}
                           placeholder={`Option Variant ${oIndex + 1}`}
                           value={opt}
                           onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                         />
                       </div>
                     ))}
                   </div>
                 </div>
                  
                 <div className="pt-6 border-t-[3px] border-dashed border-slate-200 mt-6">
                   <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-3 block ml-1 flex items-center gap-2">
                     <Sparkles className="w-3 h-3" /> Core Logic Reasoning
                   </label>
                   <input
                     type="text"
                     className="w-full bg-slate-100 border-[3px] border-slate-300 border-dashed rounded-xl p-4 text-sm font-bold text-slate-500 placeholder:text-slate-400 focus:outline-none focus:border-oxford-blue focus:ring-4 focus:ring-oxford-blue/5 transition-all"
                     placeholder="Why is this answer definitively correct in the context of computing?"
                     value={q.explanation}
                     onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                   />
                 </div>
               </div>
             </div>
          ))}
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full py-8 border-[4px] border-dashed border-slate-300 rounded-3xl text-slate-400 hover:text-oxford-blue hover:border-oxford-blue hover:bg-slate-50 shadow-none hover:shadow-[8px_8px_0px_0px_#cbd5e1] transition-all flex flex-col sm:flex-row items-center justify-center gap-4 font-black uppercase tracking-widest text-sm group"
        >
          <div className="icon-circle-sketch h-12 w-12 bg-white group-hover:bg-oxford-blue group-hover:text-white group-hover:scale-110 transition-all border-slate-300 group-hover:border-oxford-blue shadow-[3px_3px_0px_0px_#cbd5e1] group-hover:shadow-[4px_4px_0px_0px_#FF5722]">
            <Plus className="w-6 h-6" />
          </div>
          Add Logic Block
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
