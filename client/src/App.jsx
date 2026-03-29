import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import AITutor from './components/AITutor';
import SecurityWrapper from './components/SecurityWrapper';
import Preloader from './components/Preloader';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AnimatePresence>
            {loading && <Preloader onFinish={() => setLoading(false)} />}
          </AnimatePresence>
          <Router>
            <SecurityWrapper>
              <Layout>
                <AnimatedRoutes />
              </Layout>
            </SecurityWrapper>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
