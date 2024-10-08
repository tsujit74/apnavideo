import React, { useState } from "react";
import axios from "axios";
import { Snackbar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import server from "../environment";
import CircularProgress from "@mui/material/CircularProgress";

const ResetPassword = () => {
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
      setLoading(true);
      const response = await axios.post(`${server}/resetPassword`, {
        email,
        code,
        password,
      });
      setMessage(response.data.message);
      setOpen(true);
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred.");
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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <label htmlFor="code">Reset Code:</label>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your reset code"
        required
      />
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
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
