import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/header.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import AdminPage from './pages/AdminPage.jsx';
import TestPage from './pages/testPage.jsx';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgetPasswordPage from './pages/forgetPassword.jsx';
import ReviewPage from './pages/client/reviews.jsx';
import ProducerHomePage from './pages/Producer/ProducerHomePage.jsx';
import ProducerOrders from './pages/Producer/ProducerOrders.jsx';
import ProducerListings from './pages/Producer/ProducerListings.jsx';
import ProducerReviews from './pages/Producer/ProducerReviews.jsx';
import ProducerProfile from './pages/Producer/producerProfile.jsx';
import CommunicationPage from './pages/communication.jsx';
import Footer from './components/Footer.jsx';
import ProductOverviewPage from './pages/client/productOverviewPage.jsx';
import ProfilePage from './pages/client/profile.jsx';
import ChatbotLauncher from './components/ChatbotLauncher.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
// ✅ Import ReviewPage

import ContactPage from './pages/client/contact.jsx';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/register', '/forget-password', '/communication'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname) || isAdminRoute;

  return (
    <div>
      <Toaster position='top-right' />
      {/* <Header /> */}
      <ChatbotLauncher />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/testing" element={<TestPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/review" element={<ReviewPage />} /> {/* ✅ Added */}
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<ProductOverviewPage />} />
        <Route path="/producer" element={<ProducerHomePage />} />
        <Route path="/producer/orders" element={<ProducerOrders />} />
        <Route path="/producer/listings" element={<ProducerListings />} />
        <Route path="/producer/categories" element={<ProducerReviews />} /> {/* Assuming this might be needed later, or removing if mistake */}
        <Route path="/producer/reviews" element={<ProducerReviews />} />
        <Route path="/producer/profile" element={<ProducerProfile />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="1090295728336-hiv3505s2di1ha3983vu2pam96b9becv.apps.googleusercontent.com">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;


//https://bhyvhhbfubygegvvlyss.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXZoaGJmdWJ5Z2VndnZseXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTM5NjcsImV4cCI6MjA4MzE4OTk2N30.GgxqFW_zGHoCp9Anquf1XMaF51f7S955isxd3E39NJs
