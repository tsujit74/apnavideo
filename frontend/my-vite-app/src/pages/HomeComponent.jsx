import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="landingPageContainer">
        <div className="navBar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 className="navLogo">Apna Video</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                navigate("/history");
              }}
            >
              <RestoreIcon />
            </IconButton>
            <p>History</p>

            <Button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="meetContainer">
          <div className="leftPanel">
            <div>
              <h2>Providing <span style={{color:"#d97500"}}>Quality Video</span> Call Just Like Quality Education</h2>

              <div style={{ display: "flex", gap: "10px",marginTop:"10px" }}>
                <TextField
                  onChange={(e) => setMeetingCode(e.target.value)}
                  id="outlined-basic"
                  label="Meeting Code"
                  variant="outlined"
                  style={{
                    backgroundColor: "white",    
                    color: "white",
                    
                  }}
                  
                />
                <Button onClick={handleJoinVideoCall} variant="contained">
                  Join
                </Button>
              </div>
            </div>
          </div>
          <div className="rightPanel">
            <img srcSet="images/logo3.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
