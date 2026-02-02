import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfileSetupPage from './pages/profile/ProfileSetupPage';
import MemberDashboard from './pages/dashboard/MemberDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AboutPage from './pages/info/AboutPage';
import FAQPage from './pages/info/FAQPage';
import FeaturesPage, { HowItWorksPage } from './pages/info/LandingLegals';
import FreshersSection from './pages/info/FreshersSection';
import Navbar from './components/Navbar';

import MarketplacePage from './pages/marketplace/MarketplacePage';
import CreateListingPage from './pages/marketplace/CreateListingPage';

import TradePage from './pages/trade/TradePage';

import { AnimatePresence, motion } from 'framer-motion';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/member') || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-black overflow-x-hidden">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 relative z-0 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="h-full"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/profile-setup" element={<ProfileSetupPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route path="/trade/:id" element={<TradePage />} />
              <Route path="/member" element={<MemberDashboard />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/freshers" element={<FreshersSection />} />
              <Route path="/dashboard" element={<Navigate to="/student" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
