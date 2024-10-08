// import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandinPage from "./pages/landing.jsx";
import Authentication from "./pages/authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import VideoMeetComponent from "./pages/VideoMeetComponent.jsx";
import HomeComponent from "./pages/HomeComponent.jsx";
import History from "./pages/history.jsx";
import NavComponent from "./pages/navComponent.jsx";
import NotFound from "./pages/NotFound.jsx";
import Footer from "./pages/Footer.jsx";
import { useState } from "react";
import { UserProvider } from "./contexts/UserContext.jsx";
import { SnackbarProvider } from "notistack";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfServices.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from './pages/ResetPassword.jsx'

function App() {
  // const [user, setUser] = useState(null);
  return (
    <>
      <SnackbarProvider>
        <UserProvider>
          <Router>
            <NavComponent />
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandinPage />} />
                <Route path="/auth" element={<Authentication />} />
                <Route path="/home" element={<HomeComponent />} />
                <Route path="/history" element={<History />} />
                <Route path="/:url" element={<VideoMeetComponent />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-service" element={<TermsOfService />} />
                <Route path="/contact-page" element={<ContactPage />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route
                  path="/reset-password"
                  element={<ResetPassword />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
            <Footer />
          </Router>
        </UserProvider>
      </SnackbarProvider>
    </>
  );
}

export default App;
