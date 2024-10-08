import React, { useState } from "react";
import axios from "axios";
import { Snackbar,Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import server from "../environment";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const BackButton = () => {
  
}

const ResetPassword = () => {
  const {enqueueSnackbar} = useSnackbar();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      if (!email || !password || !code) {
        enqueueSnackbar("All fields are required", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        return;
      }

      if (!validateEmail(email)) {
        enqueueSnackbar("Email is not valid", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        return;
      }

      if(code.length !== 6 ){
        enqueueSnackbar("Code Should be 6 Character", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        return;
      }

      if(password.length < 6){
        enqueueSnackbar("Password must be 6 Character", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        return;
      }

      const response = await axios.post(`${server}/api/v1/users/resetPassword`, {
        email,
        code,
        password,
      });
      setMessage(response.data.message);
      setOpen(true);
      setTimeout(() => navigate("/auth"), 2000);
      enqueueSnackbar("Password Updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
  
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred.");
      let errorMsg = error.response?.data?.message || "An error occurred";
      enqueueSnackbar(errorMsg, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="resetPassword">
      <Button variant="outlined" onClick={handleBack}>
      Back
    </Button>

      {loading && (
        <div
          style={{ position: "absolute", top: "40%", left: "50%", zIndex: 9 }}
        >
          <CircularProgress />
        </div>
      )}
      <div className="container" style={{ opacity: loading ? 0.5 : 1 }}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
          type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      
      />
      <label htmlFor="code">Reset Code:</label>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your reset code"
      
      />
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"

            />
          </div>
          <button type="submit">Reset Password</button>
          {message && <p>{message}</p>}
        </form>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
