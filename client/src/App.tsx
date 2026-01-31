import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfileSetupPage from './pages/profile/ProfileSetupPage';
import MemberDashboard from './pages/dashboard/MemberDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AboutPage from './pages/info/AboutPage';
import FreshersSection from './pages/info/FreshersSection';
import Navbar from './components/Navbar';

import MarketplacePage from './pages/marketplace/MarketplacePage';
import CreateListingPage from './pages/marketplace/CreateListingPage';

import TradePage from './pages/trade/TradePage';

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/member') || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 relative z-0 pointer-events-auto">
        <Routes>
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
          <Route path="/freshers" element={<FreshersSection />} />
          <Route path="/dashboard" element={<Navigate to="/student" replace />} />
        </Routes>
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
