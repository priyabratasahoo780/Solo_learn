import { useParams, useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ArrowRight, RefreshCw, Trophy, Home, 
  ShieldCheck, AlertCircle, Camera, Timer, 
  Zap, Award, CheckCircle2, XCircle, BookOpen,
  Lock, Laptop, Activity, ChevronRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import emailService from '../services/emailService';
import { useAuth } from '../context/AuthContext';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/${id}`);
        setQuiz(data.data);
      } catch (err) {
        console.error('Failed to fetch quiz', err);
        navigate('/quizzes');
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  if (!quiz) return <LoadingSpinner fullScreen />;

  return <GameInterface quiz={quiz} navigate={navigate} />;
};

const GameInterface = ({ quiz, navigate }) => {
  const [attemptId, setAttemptId] = useState(null);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState('');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { user } = useAuth();

  const {
    currentQuestionIndex,
    currentQuestion,
    selectedOption,
    lives,
    score,
    isGameOver,
    isCompleted,
    feedback,
    handleAnswer,
    nextQuestion,
    totalQuestions
  } = useGameLogic(quiz);

  const handleEnableCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera permission denied:', err);
      toast.error('Camera access is REQUIRED for this examination.');
    }
  };

  const handleStartTest = async () => {
    try {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (fsErr) {
        console.warn('Fullscreen denied');
      }

      const { data } = await api.post(`/quizzes/${quiz._id}/start`);
      
      if (data.success) {
        setAttemptId(data.data.attemptId);
        setHasStarted(true);

        if (data.data.shouldSendEmail && data.data.emailData) {
          emailService.sendQuizReport(
            user?.name || 'User',
            user?.email,
            {
              quizTitle: data.data.emailData.quizTitle,
              category: data.data.emailData.category,
              type: 'START_NOTIFICATION'
            }
          );
        }
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setIsLocked(true);
      } else {
        console.error('Test Init Error:', err);
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, hasStarted]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (hasStarted && !document.fullscreenElement && !isGameOver && !isCompleted) {
        reportViolation('fullscreen-exit');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [hasStarted, isGameOver, isCompleted]);

  const reportViolation = async (type) => {
    if (!attemptId || isGameOver || isCompleted) return;
    try {
      const { data } = await api.post(`/quizzes/attempts/${attemptId}/violation`, { type });
      setViolations(data.violationCount);
      if (data.isTerminated) {
        setIsLocked(true);
        setHasStarted(false);
      } else {
        setWarningType(type);
        setShowWarning(true);
      }
    } catch (err) {
      console.error('Violation Error', err);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && !isGameOver && !isCompleted) {
        reportViolation('tab-switch');
      }
    };
    const handleBlur = () => {
      if (hasStarted && !isGameOver && !isCompleted) {
        reportViolation('focus-loss');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [hasStarted, isGameOver, isCompleted]);

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full sketch-card p-12 bg-white border-rose-500 shadow-[10px_10px_0px_0px_#002D72] text-center space-y-8"
        >
          <div className="icon-circle-sketch h-24 w-24 mx-auto bg-rose-50 border-rose-500 shadow-[6px_6px_0px_0px_#cbd5e1]">
            <XCircle className="w-12 h-12 text-rose-600" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">Access Restricted</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] bg-rose-50 p-4 border-2 border-dashed border-rose-200 rounded-xl leading-relaxed">
              Detection of <span className="text-rose-600">Cheating Violations</span>. Academic access suspended for 72 hours.
            </p>
          </div>

          <button 
            onClick={() => navigate('/quizzes')} 
            className="btn-sketch w-full py-5 text-sm bg-rose-600 border-oxford-blue"
          >
            EXIT EXAM ROOM
          </button>
        </motion.div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <div className="text-center space-y-4">
           <div className="badge-sketch">PROCTORING NODE: SECURE</div>
           <h1 className="text-5xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none">
              EXAM <span className="text-orange-500">GATEWAY</span>
           </h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-[10px] max-w-lg mx-auto">
              Identity verification and environment validation required before study assessment begins.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="sketch-card bg-white border-oxford-blue shadow-[12px_12px_0px_0px_#cbd5e1] aspect-video flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 sketch-grid opacity-10" />
            
            {isCameraActive ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover mirror" 
                />
                <motion.div 
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[3px] bg-orange-500 shadow-[0_0_15px_#FF5722] z-10"
                />
                <div className="absolute top-4 left-4 badge-sketch bg-oxford-blue text-white shadow-[3px_3px_0px_0px_#FF5722]">
                  STREAMING: 1080P
                </div>
              </>
            ) : (
              <div className="text-center space-y-6 relative z-10">
                 <div className="icon-circle-sketch h-20 w-20 mx-auto bg-slate-50 border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1]">
                    <Camera className="w-10 h-10 text-slate-300" />
                 </div>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] italic">Hardware Initialization Pending</p>
              </div>
            )}
          </div>

          <div className="sketch-card bg-orange-50 border-orange-500 shadow-[8px_8px_0px_0px_#002D72] p-8 space-y-8">
             <div className="flex items-center gap-4 border-b-2 border-dashed border-orange-200 pb-4">
                <ShieldCheck className="w-8 h-8 text-oxford-blue" />
                <h3 className="text-xl font-black text-oxford-blue italic uppercase tracking-tighter">Academic Integrity</h3>
             </div>
             
             <ul className="space-y-4">
                {[
                  "No tab switching or browser exits.",
                  "Fullscreen mode mandatory throughout.",
                  "Live proctoring active via terminal camera.",
                  "Cheating results in 72hr institutional ban."
                ].map((rule, i) => (
                  <li key={i} className="flex gap-4 text-xs font-bold text-oxford-blue">
                     <span className="text-orange-500 font-black">•</span> {rule}
                  </li>
                ))}
             </ul>

             <div className="pt-4">
                {!isCameraActive ? (
                  <button 
                    onClick={handleEnableCamera}
                    className="btn-sketch w-full py-4 text-xs"
                  >
                    INITIALIZE CAMERA ARRAY
                  </button>
                ) : (
                  <button 
                    onClick={handleStartTest}
                    className="btn-sketch w-full py-4 text-xs bg-orange-500"
                  >
                    START RIGOROUS TEST
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted || isGameOver) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="w-full sketch-card p-12 lg:p-16 bg-white border-oxford-blue shadow-[12px_12px_0px_0px_#cbd5e1] relative overflow-hidden"
        >
          <div className="absolute inset-0 sketch-grid opacity-5 pointer-events-none" />
          
          <div className="absolute top-10 right-10">
             <div className="badge-sketch bg-oxford-blue text-white shadow-[4px_4px_0px_0px_#FF5722]">
                CERTIFIED RESULT
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 mb-16 border-b-[3px] border-dashed border-slate-100 pb-12">
             <div className="icon-circle-sketch h-24 w-24 bg-white border-oxford-blue shadow-[8px_8px_0px_0px_#cbd5e1]">
                {isCompleted ? <Trophy className="w-12 h-12 text-yellow-500" /> : <Heart className="w-12 h-12 text-rose-500" />}
             </div>
             <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-oxford-blue italic tracking-tighter uppercase leading-none mb-3">
                  {isCompleted ? 'CHALLENGE CHAMPION' : 'ACADEMIC RE-EVALUATION'}
                </h1>
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Simulation Protocol: {quiz.title.toUpperCase()}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-16">
             <div className="sketch-card p-8 bg-slate-50 border-[2px] text-center shadow-[4px_4px_0px_0px_#cbd5e1]">
                <div className="text-4xl font-black mb-2 italic text-oxford-blue">{score}</div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">CUMULATIVE SCORE</div>
             </div>
             <div className="sketch-card p-8 bg-slate-50 border-[2px] text-center shadow-[4px_4px_0px_0px_#cbd5e1]">
                <div className={`text-4xl font-black mb-2 italic ${isCompleted ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isCompleted ? 'PASSED' : 'FAILED'}
                </div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">EXAM STATUS</div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => navigate('/quizzes')}
              className="btn-sketch flex-1 py-5 text-sm bg-slate-100 border-oxford-blue text-oxford-blue shadow-none hover:bg-slate-200"
            >
              MODULE ARCHIVE
            </button>
            {new URLSearchParams(window.location.search).get('challengeId') ? (
              <button 
                onClick={() => navigate('/battleground')}
                className="btn-sketch flex-1 py-5 text-sm bg-orange-500 text-white"
              >
                RETURN TO BATTLEGROUND
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-sketch flex-1 py-5 text-sm"
              >
                COMMAND CENTER
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }
 
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 pt-4 px-4">
      {/* Proctoring Hub */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white sketch-card p-6 border-oxford-blue shadow-[10px_10px_0px_0px_#FF5722]">
        <div className="w-full md:w-56 aspect-video sketch-card bg-slate-50 border-oxford-blue shadow-[4px_4px_0px_0px_#cbd5e1] overflow-hidden relative">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover mirror" 
          />
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-oxford-blue text-white px-2 py-0.5 rounded text-[8px] font-black tracking-widest">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            LIVE STUDY
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Heart 
                    key={i}
                    className={`w-6 h-6 ${i <= lives ? 'fill-rose-500 text-rose-500' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <div className="badge-sketch bg-oxford-blue text-white shadow-[2px_2px_0px_0px_#FF5722] text-[10px]">
                {score} XP GAINED
              </div>
           </div>
           
           <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black text-oxford-blue uppercase tracking-widest leading-none">
                <span>Modules {currentQuestionIndex + 1} of {totalQuestions}</span>
                <span className="text-orange-500">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% COMPLETE</span>
              </div>
              <div className="h-3 w-full bg-slate-100 border-[2px] border-oxford-blue rounded-full overflow-hidden shadow-[3px_3px_0px_0px_#cbd5e1]">
                <motion.div 
                  className="h-full bg-orange-500 border-r-[2px] border-oxford-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
           </div>
        </div>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-50/80 backdrop-blur-sm">
            <motion.div className="sketch-card bg-white border-rose-500 p-10 max-w-sm text-center shadow-[10px_10px_0px_0px_#002D72]">
              <div className="icon-circle-sketch h-16 w-16 mx-auto bg-rose-50 border-rose-500 mb-6">
                <AlertCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-2xl font-black text-oxford-blue italic uppercase mb-4">Integrity Violation</h3>
              <p className="text-slate-500 font-bold text-xs mb-8">
                {warningType === 'tab-switch' && "TAB SWITCH DETECTED."}
                {warningType === 'focus-loss' && "LOSS OF FOCUS DETECTED."}
                {warningType === 'fullscreen-exit' && "FULLSCREEN EXIT DETECTED."}
                <br /><br />
                <span className="text-rose-600 uppercase tracking-widest">Strike {violations} / 3</span>
              </p>
              <button 
                onClick={() => {
                  setShowWarning(false);
                  document.documentElement.requestFullscreen().catch(e => console.error(e));
                }}
                className="btn-sketch w-full py-4 text-xs bg-rose-600 border-oxford-blue"
              >
                ACKNOWLEDGEMENT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Platform */}
      <AnimatePresence mode='wait'>
        <motion.div
           key={currentQuestionIndex}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
        >
          <div className="sketch-card p-10 bg-white border-oxford-blue shadow-[12px_12px_0px_0px_#cbd5e1] min-h-[450px] flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Zap className="w-32 h-32 text-oxford-blue" />
             </div>

             <div className="space-y-8 relative z-10">
               <div className="space-y-4">
                 <div className="badge-sketch bg-slate-100 text-oxford-blue border-oxford-blue">QUESTION_{currentQuestionIndex + 1}</div>
                 <h2 className="text-3xl md:text-4xl font-black text-oxford-blue italic tracking-tighter leading-none title-fredoka">
                   {currentQuestion.question}
                 </h2>
               </div>
               
               <div className="grid grid-cols-1 gap-5">
                   {currentQuestion.options.map((option, index) => {
                   let stateStyles = "bg-white border-oxford-blue text-oxford-blue hover:shadow-[4px_4px_0px_0px_#FF5722] hover:-translate-y-0.5";
                   
                   if (selectedOption === index) {
                     stateStyles = "bg-orange-500 text-white border-oxford-blue shadow-[4px_4px_0px_0px_#002D72] -translate-y-1";
                   }
                   
                   if (feedback) {
                      if (index === currentQuestion.answerIndex) {
                        stateStyles = "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-[4px_4px_0px_0px_#cbd5e1]";
                      } else if (selectedOption === index) {
                        stateStyles = "bg-rose-50 text-rose-700 border-rose-500 shadow-[4px_4px_0px_0px_#cbd5e1]";
                      } else {
                        stateStyles = "opacity-40 grayscale pointer-events-none border-slate-200 text-slate-300";
                      }
                   }

                   return (
                     <button
                       key={index}
                       onClick={() => handleAnswer(index)}
                       disabled={!!feedback}
                       className={`w-full text-left p-6 rounded-2xl border-[3px] font-black transition-all flex items-center group shadow-[6px_6px_0px_0px_#cbd5e1] ${stateStyles}`}
                     >
                        <span className={`h-8 w-8 rounded-lg border-2 border-current flex items-center justify-center mr-6 font-black italic text-xs ${selectedOption === index ? 'bg-white text-orange-500' : ''}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                     </button>
                   );
                 })}
               </div>
             </div>

             {/* Dynamic Explanation Panel */}
             {feedback && (
               <motion.div
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-10 pt-10 border-t-[3px] border-dashed border-slate-100 space-y-6"
               >
                 <div className={`sketch-card p-6 border-[2px] ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                    <div className="flex items-center gap-3 mb-3">
                       {feedback === 'correct' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-rose-600" />}
                       <h4 className="font-black italic uppercase italic tracking-tight text-oxford-blue">
                          {feedback === 'correct' ? 'Session Optimization Successful' : 'Strategic Miscalculation'}
                       </h4>
                    </div>
                    <p className="text-slate-600 font-bold text-sm italic leading-relaxed">
                       "{currentQuestion.explanation || 'Protocol analyzed. Re-evaluating core concepts for next module.'}"
                    </p>
                 </div>
                 
                 <button
                   onClick={nextQuestion}
                   className="btn-sketch w-full py-5 text-sm"
                 >
                   {currentQuestionIndex < totalQuestions - 1 ? 'LOAD NEXT MODULE' : 'FINALIZE ASSESSMENT'}
                   <ChevronRight className="w-6 h-6 ml-2 text-orange-400" />
                 </button>
               </motion.div>
             )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
