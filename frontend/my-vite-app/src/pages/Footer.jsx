import React from "react";
import '../styles/Footer.css'; // Import your CSS file for styling

const Footer = () => {
    return (
      <footer className="footer">
        <div className="container">
          <p className="footer-description">
            Apna Video connects you with your loved ones through video calls. Stay connected, no matter the distance!
          </p>
          
          <ul className="footer-links">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
  
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Apna Video. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;