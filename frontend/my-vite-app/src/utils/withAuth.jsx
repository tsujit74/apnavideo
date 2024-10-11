import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent, isAdminRequired = false) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();

    const isAuthenticated = () => !!localStorage.getItem("token");

    
    const isAdmin = () => {
      const user = JSON.parse(localStorage.getItem("user")); 
      return user && user.isAdmin === true; 
    };

    useEffect(() => {
      if (!isAuthenticated()) {
        navigate("/auth"); 
      } else if (isAdminRequired && !isAdmin()) {
        navigate("/home");
      }
    }, [navigate, isAdminRequired]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
