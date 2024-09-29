// import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandinPage from "./pages/landing.jsx";
import Authentication from "./pages/authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import VideoMeetComponent from "./pages/VideoMeetComponent.jsx";
import HomeComponent from "./pages/HomeComponent.jsx"
import History from "./pages/history.jsx";
import NavComponent from "./pages/navComponent.jsx";
import NotFound from "./pages/NotFound.jsx";
import Footer from "./pages/Footer.jsx";
import { useState } from "react";
import { UserProvider } from "./contexts/UserContext.jsx";
//import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  // const [user, setUser] = useState(null);
  return (
    <>
    <UserProvider>
      <Router>
        <NavComponent />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandinPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<HomeComponent/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/:url" element={<VideoMeetComponent/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <Footer/>
      </Router>
      </UserProvider>
    </>
  );
}

export default App;
