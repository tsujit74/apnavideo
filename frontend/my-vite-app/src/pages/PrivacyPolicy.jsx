import React from 'react';
import {Link} from 'react-router-dom'
import '../styles/PrivacyPolicy.css'
import BackButton from './BackButton';

export default function PrivacyPolicy() {
  return (
    <div className='privacy-policy-container'>
      <BackButton/>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> [01-10-2024]</p>
      <p>
        At <strong>Apna Video</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our video calling and chat services.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account Information</strong>: When you sign up, we collect basic information like your username and email address.</li>
        <li><strong>Call & Chat Data</strong>: We collect data like call duration and chat messages to facilitate communication between users.</li>
        <li><strong>Device Information</strong>: We collect technical details such as your IP address, browser type, and device information to optimize your experience.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li><strong>Provide Services</strong>: Your data is used to authenticate your account, enable video calls, and store messages.</li>
        <li><strong>Communication</strong>: We may use your email to send you important updates or notifications.</li>
        <li><strong>Improve Our Service</strong>: We analyze how you use our app to improve its performance and user experience.</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>
        We do not sell or share your personal data with third parties, except:
      </p>
      <ul>
        <li>To comply with legal obligations.</li>
        <li>When necessary to provide services through trusted partners (e.g., cloud storage).</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We use secure technologies like encryption to protect your personal data. While we work to ensure the security of your information, no system is completely secure.
      </p>

      <h2>5. Managing Your Data</h2>
      <ul>
        <li><strong>Access & Update</strong>: You can view or update your account information in your profile settings.</li>
        <li><strong>Delete Account</strong>: If you wish to delete your account and personal data, please contact us at <b>[apnavideo143@gmail.com]</b>.</li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We keep your personal information for as long as necessary to provide our services, comply with legal obligations, or resolve disputes.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at <b><Link to={"/contact-page"}> contact us</Link></b>.
      </p>
    </div>
  );
}
