import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from './ProtectedRoute';
import PageTransition from './PageTransition';
import { Loader } from 'lucide-react';

// Lazy Loaded Pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const QuizList = lazy(() => import('../pages/QuizList'));
const CreateQuiz = lazy(() => import('../pages/CreateQuiz'));
const QuizPage = lazy(() => import('../pages/QuizPage'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));
const Rewards = lazy(() => import('../pages/Rewards'));
const Feed = lazy(() => import('../pages/Feed'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Certificates = lazy(() => import('../pages/Certificates'));
const Profile = lazy(() => import('../pages/Profile'));
const InterviewPrep = lazy(() => import('../pages/InterviewPrep'));
const Sandbox = lazy(() => import('../pages/Sandbox'));
const MockInterview = lazy(() => import('../pages/MockInterview'));
const BattleGround = lazy(() => import('../pages/BattleGround'));
const CareerArchitect = lazy(() => import('../pages/CareerArchitect'));

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <Loader className="w-10 h-10 text-oxford-blue animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Synchronizing Data Node...</span>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={
            <PageTransition>
              <Home />
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />
          <Route path="/signup" element={
            <PageTransition>
              <Signup />
            </PageTransition>
          } />
          <Route path="/forgot-password" element={
            <PageTransition>
              <ForgotPassword />
            </PageTransition>
          } />
          <Route path="/reset-password/:token" element={
            <PageTransition>
              <ResetPassword />
            </PageTransition>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/quizzes" element={
            <ProtectedRoute>
              <PageTransition>
                <QuizList />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute>
              <PageTransition>
                <QuizPage />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/create-quiz" element={
            <ProtectedRoute>
              <PageTransition>
                <CreateQuiz />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <PageTransition>
                <Leaderboard />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute>
              <PageTransition>
                <Rewards />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/feed" element={
            <ProtectedRoute>
              <PageTransition>
                <Feed />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/certificates" element={
            <ProtectedRoute>
              <PageTransition>
                <Certificates />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/interview-prep" element={
            <ProtectedRoute>
              <PageTransition>
                <InterviewPrep />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/sandbox" element={
            <ProtectedRoute>
              <PageTransition>
                <Sandbox />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/mock-interview" element={
            <ProtectedRoute>
              <PageTransition>
                <MockInterview />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/battleground" element={
            <ProtectedRoute>
              <PageTransition>
                <BattleGround />
              </PageTransition>
            </ProtectedRoute>
          } />
          <Route path="/architect" element={
            <ProtectedRoute>
              <PageTransition>
                <CareerArchitect />
              </PageTransition>
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
