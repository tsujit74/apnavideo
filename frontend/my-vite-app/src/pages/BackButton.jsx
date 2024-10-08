import React from 'react'
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import '../styles/ResetPassword.css'

export default function BackButton() {
    const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="backBtn" onClick={handleBack}>
        {<ArrowBackIcon />}
      </div>
    </div>
  )
}
