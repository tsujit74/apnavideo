import React, { useState } from 'react';
import axios from 'axios';
import { Snackbar, CircularProgress } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import '../styles/ForgetPassword.css';
import server from '../environment';
import { useSnackbar } from 'notistack';
import BackButton from './BackButton';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return emailRegex.test(email);
};

const ForgetPassword = () => {

  const {enqueueSnackbar} = useSnackbar();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); 
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email input
    if (!email) {
      setMessage("Please enter your email");
      enqueueSnackbar("Please Enter Email", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      setOpen(true);
      return;
    }

    if (!validateEmail(email)) {
      enqueueSnackbar("Email is not valid", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      setMessage("Email is not valid");
      setOpen(true);
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post(`${server}/api/v1/users/forgetPassword`, { email });
      
      enqueueSnackbar("Code sent to your email", {
        variant: 'success',
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      setMessage("Code sent to your email");
      setOpen(true);

      // Redirect to reset password page after a short delay
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred";
      setMessage(errorMsg);
      enqueueSnackbar(errorMsg, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
      setOpen(true);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="forgetPage">
      <BackButton/>
      {loading && (
        <div style={{ position: "absolute", top: "40%", left: "50%", zIndex: 9 }}>
          <CircularProgress />
        </div>
      )}
      <div className="containerForget" style={{ opacity: loading ? 0.5 : 1 }}>
        <h3>Forget Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Your Email'
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
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

export default ForgetPassword;
