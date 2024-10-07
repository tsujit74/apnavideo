import React from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import "../styles/Footer.css";

const Footer = () => {
  const {enqueueSnackbar} = useSnackbar();
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-description">
          Apna Video connects you with your loved ones through video calls. Stay
          connected, no matter the distance!
        </p>

        <ul className="footer-links">
          <Link className="link" to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="link" to="/terms-service">
            Terms of Service
          </Link>
          <Link to={'/contact-page'}>
          </Link>
        </ul>

        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Apna Video. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
