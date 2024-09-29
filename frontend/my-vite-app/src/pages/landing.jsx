import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavComponent from "./navComponent";
import "../App.css";
import "../styles/Button.css";

function LandingPage() {
  const router = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <div className="landingPageContainer">
        <div className="landingMain">
          <div>
            <h1>
              <span style={{ color: "#FF9839" }}>Connect</span> with your loved
              ones
            </h1>
            <p>Cover a distance by Apna Video Call</p>
            <div role="button" className="getStart">
              <Link to={isLoggedIn ? "/home" : "/auth"} className="glowing-txt">
                Get <span className="faulty-letter">Started</span>
              </Link>
            </div>
          </div>
          <div>
            <img src="/images/mobile.png" alt="mobile" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
