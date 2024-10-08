import React, { useState } from 'react';
import axios from 'axios';
import { Snackbar } from '@mui/material'; // Optional: For notifications
import { useNavigate } from 'react-router-dom';
import '../styles/ForgetPassword.css'
import server from '../environment';
import CircularProgress from '@mui/material/CircularProgress';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation after success

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const response = await axios.post(`${server}/api/v1/users/forgetPassword`, {
        email,
      });
      setMessage(response.data.message);
      setOpen(true);
      // Optionally redirect to another page after success
      setTimeout(() => navigate('/auth'), 2000);
    } catch (error) {
      setMessage(error.response.data.message || 'An error occurred.');
      setOpen(true);
    }finally{
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="forgetPage">
      {loading && (
        <div
          style={{ position: "absolute", top: "40%", left: "50%", zIndex: 9 }}
        >
          <CircularProgress />
        </div>
      )}
    <div className="containerForget" style={{opacity:loading ? 0.5:1}}>
    

      <h3>Forget Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Your Email'
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
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
