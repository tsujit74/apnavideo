// import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandinPage from "./pages/landing.jsx";
import Authentication from "./pages/authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import VideoMeetComponent from "./pages/VideoMeetComponent.jsx";
import HomeComponent from "./pages/HomeComponent.jsx"
import History from "./pages/history.jsx";
//import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandinPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<HomeComponent/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="/:url" element={<VideoMeetComponent/>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
