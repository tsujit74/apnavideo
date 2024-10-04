import React from 'react';
import '../styles/TermsOfService.css'; // Import the CSS file
import { useSnackbar } from 'notistack';

export default function TermsOfService() {
  const {enqueueSnackbar} = useSnackbar();
  return (
    <div className="terms-of-service-container">
      <h1>Terms of Service</h1>

      <p>Welcome to Apna Video! By using our services, you agree to abide by the following terms and conditions. Please read them carefully.</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using our platform, you accept and agree to be bound by these terms. If you do not agree to these terms, you should not use our services.</p>

      <h2>2. User Responsibilities</h2>
      <p>As a user, you are responsible for your actions while using our platform. This includes complying with all applicable laws and regulations.</p>

      <ul>
        <li>Do not engage in any illegal activities.</li>
        <li>Do not harass or abuse other users.</li>
        <li>Do not attempt to hack or disrupt the service.</li>
      </ul>

      <h2>3. Account Security</h2>
      <p>It is your responsibility to maintain the confidentiality of your account information. Notify us immediately of any unauthorized use of your account.</p>

      <h2>4. Termination</h2>
      <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in activities that harm the platform or other users.</p>

      <h2>5. Changes to the Terms</h2>
      <p>We may update these terms from time to time. Continued use of our services after any such changes constitutes your acceptance of the new terms.</p>

      <p>If you have any questions about these terms, feel free to <a href="#" onClick={()=>{
enqueueSnackbar("Out of Service",{variant:"info",anchorOrigin:{vertical:'top',horizontal:'center'}});
      }}>contact us</a>.</p>
    </div>
  );
}
