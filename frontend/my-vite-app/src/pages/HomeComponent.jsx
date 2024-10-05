import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";
import { useUser } from '../contexts/UserContext';
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Email from "@mui/icons-material/Email";

function HomeComponent() {
  const { enqueueSnackbar } = useSnackbar();
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [isHosting, setIsHosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const {user,setUser} = useUser();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUser(storedUsername);
        }
    }, []);

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    setLoading(true);
    try {
      await addToUserHistory(meetingCode);
      if (meetingCode === "") {
        enqueueSnackbar(`Enter Meeting Code Ex: "a12bcc"`, {
          variant: "info",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        return;
      } else {
        navigate(`/${meetingCode}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const generateMeetingCode = () => {
    const characters = "abcdefghijklm234567nopqrstuvwxyz0189";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    setMeetingCode(code);
  };

  const shareViaWhatsApp = () => {
    if (meetingCode !== "") {
      const url = `https://wa.me/?text=Join my meeting with code: ${meetingCode}\n\nClick this link: https://apnavideofrontend.onrender.com`;
      window.open(url, "_blank");
    } else {
      enqueueSnackbar(`Enter Meeting Code Ex: "a12bcc"`, {
        variant: "info",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      return;
    }
  };

  // Function to share meeting code via email
  const shareViaEmail = () => {
    if (meetingCode !== "") {
      const subject = "Meeting Code";
      const body = `Join my meeting with code: ${meetingCode} Click this link: https://apnavideofrontend.onrender.com`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    } else {
      enqueueSnackbar(`Enter Meeting Code Ex: "a12bcc"`, {
        variant: "info",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <>
      <div className="landingPageContainer details">
        <div className="detailsUserPage">
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                navigate("/history");
              }}
            >
              <RestoreIcon sx={{ml:2,mr:2}} />
            </IconButton>
          </div>
        </div>

        <div className="meetContainer">
          <div className="leftPanel">
            <div>
              <h2>Providing <span style={{color:"#d97500"}}>Quality Video</span> Call Just Like Quality Education</h2>

              <RadioGroup
                row
                value={isHosting ? "host" : "join"}
                onChange={(e) => setIsHosting(e.target.value === "host")}
              >
                <FormControlLabel
                  value="host"
                  control={<Radio />}
                  label="Host a Meeting"
                />

                <FormControlLabel
                  value="join"
                  control={<Radio />}
                  label="Join a Meeting"
                />
              </RadioGroup>
              
              <div className="leftPanelTextField">
                <TextField
                value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  id="outlined-basic"
                  label="Meeting Code"
                  variant="outlined"
                  style={{
                    backgroundColor: "white",    
                    color: "white",
                    
                  }} 
                />
                <div className="leftpanelButton" style={{ display: "flex" }}>
                  <div>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleJoinVideoCall}
                        sx={{ mt: 2, mr: 2 }}
                      >
                        JOIN
                      </Button>
                    )}
                  </div>
                  {isHosting && (
                    <Button
                      variant="outlined"
                      onClick={generateMeetingCode}
                      sx={{ mt: 2 }}
                    >
                      Get Code
                    </Button>
                  )}
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                Send To Code VIA : <br />
                <IconButton
                  variant="contained"
                  onClick={shareViaWhatsApp}
                  sx={{ mt: 1, marginRight: 1 }}
                >
                  <WhatsAppIcon />
                </IconButton>
                <IconButton
                  variant="contained"
                  onClick={shareViaEmail}
                  sx={{ mt: 1 }}
                >
                  <Email />
                </IconButton>
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
