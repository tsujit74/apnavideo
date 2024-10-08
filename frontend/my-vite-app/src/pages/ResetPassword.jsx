import React, { useState } from "react";
import axios from "axios";
import { Snackbar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import server from "../environment";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

const ResetPassword = () => {

  const {enqueueSnackbar} = useSnackbar();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (!email || !password || !code) {
        enqueueSnackbar("All fields are required", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        return;
      }

      setLoading(true);
      const response = await axios.post(`${server}/api/v1/users/resetPassword`, {
        email,
        code,
        password,
      });
      setMessage(response.data.message);
      setOpen(true);
      setTimeout(() => navigate("/auth"), 2000);
      enqueueSnackbar("Password Update successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
  
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred.");
      enqueueSnackbar("Password Not Update", {
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
