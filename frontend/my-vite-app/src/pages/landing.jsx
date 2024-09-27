import React from "react";
import {Link, useNavigate} from 'react-router-dom'
import '../App.css'

function LandingPage() {

const router = useNavigate();

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navLogo">
            <h2>Apna Video</h2>
        </div>
        <div className="navList">
            <p onClick={()=>{
              router('/g1u2e3s4t')
            }} >Join as Guest</p>
            <p onClick={()=>{
              router('/auth')
            }}>Register</p>
            <div role="button" onClick={()=>{
              router('/auth')
            }}>
                <p>Login</p>
            </div>
        </div>
      </nav>


      <div className="landingMain">
        <div>
            <h1><span style={{color:"#FF9839"}}>Connect</span> with your loved ones</h1>
            <p>Cover a distance by Apna Video Call</p>
            <div role="button">
                <Link to={"/auth"}>Get Started</Link>
            </div>
        </div>
        <div>
            <img src="/images/mobile.png" alt="mobile" />
        </div>
      </div>


    </div>
  );
}

export default LandingPage;
