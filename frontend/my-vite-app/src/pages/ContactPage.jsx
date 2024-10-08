import React, { useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import "../styles/ContactPage.css"; // Import the CSS file
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// const client = axios.create({
//   baseURL: `https://localhost:5500/api/v1/`,
// });

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ContactPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleMessage } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    try {
      
      if (!name || !email || !message) {
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
  
     
      let result = await handleMessage(name, email, message);
  
      
      setName("");
      setEmail("");
      setMessage("");
      navigate('/');
      enqueueSnackbar("Message sent successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
  
      
      setShowConfirmation(true);
      const confirmationTimeout = setTimeout(() => {
        setShowConfirmation(false);
      }, 12000);
  
     
      return () => clearTimeout(confirmationTimeout);
  
    } catch (err) {
      console.error(err); 
      let errorMsg = err.response?.data?.message || "An error occurred";
      enqueueSnackbar(errorMsg, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  
  

    // try {
    //   let result = await handleMessage(name,email,message);
    //   if(!name || !email || !message){
    //     enqueueSnackbar("All field Required",{variant:"error",anchorOrigin:{vertical:'top',horizontal:'center'}})
    //     return;
    //   }

    //   if (!validateEmail(email)) {
    //     enqueueSnackbar("Email is not valid", { variant: "error", anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 2000 });
    //     return;
    //   }

    //   // await client.post('/contact', {
    //   //   name,
    //   //   email,
    //   //   message,

    //   // });

    //   enqueueSnackbar("Message Sent",{variant:"success",anchorOrigin:{vertical:'top',horizontal:'center'},autoHideDuration:2000})
    //   setSuccessMessage('Your message has been sent successfully!');
    //   setErrorMessage('');
    //   setName('');
    //   setEmail('');
    //   setMessage('');
    //   // setTimeout(() => {
    //   //   setSuccessMessage('');
    //   // }, 3000);

    //   setTimeout(() => {
    //     setShowConfirmation(true);
    //   }, 7000);

    //   setTimeout(() => {
    //     setShowConfirmation(false);
    //   }, 12000);

    // } catch (err) {
    //   console.log(err)
    //   let errorMsg = err.response?.data?.message || "An error occurred";
    //   setErrorMessage('There was an error sending your message. Please try again.');
    //   enqueueSnackbar(errorMsg,{variant:"error",anchorOrigin:{vertical:'top',horizontal:'center'},autoHideDuration:2000})
    //   setSuccessMessage('');
    //   setTimeout(() => {
    //     setErrorMessage('');
    //   }, 3000);
    // }finally{
    //   setLoading(false);
    // }
  };

  return (
    <div className="contact-container">
      {loading && (
        <div
          style={{ position: "absolute", top: "45%", left: "50%", zIndex: 9 }}
        >
          <CircularProgress />
        </div>
      )}

      <h2>Contact Us</h2>
      <form
        className="contact-form"
        onSubmit={handleSubmit}
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        <div className="form-group">
          <label>Name:</label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-textarea"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
      {/* {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>} */}

      {showConfirmation && (
        <Typography
          variant="body1"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Thank you for reaching out, we will respond shortly!
        </Typography>
      )}
    </div>
  );
};

export default ContactPage;
