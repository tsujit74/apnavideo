import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "../styles/ProfilePage.css";
import withAuth from "../utils/withAuth";
import BackButton from "./BackButton";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const getLoggedInUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  };

  const fetchUserEmail = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://apnavideobackend.onrender.com/api/v1/users/getUserEmail/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.email;
    } catch (error) {
      console.error("Error fetching user email:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = getLoggedInUser();
      if (user) {
        const email = await fetchUserEmail(user.id);
        if (email) {
          setUserDetails({ ...user, email });
        }
      }
    };
    fetchData();
  }, []);
  

  if (!userDetails) {
    return <div className="notUser">Loading user details...</div>;
  }
  return (
    <div className="profile-container">
      <BackButton/>
      <div className="profile-section">
        <div className="headDetails">
          <h2>Your Details</h2>
          <h3>{userDetails.name}</h3>
        </div>
        <p>
          <strong>Name:</strong> {userDetails.name}
        </p>
        <p>
          <strong>Username:</strong> {userDetails.username}
        </p>
        <p>
          <strong>Email:</strong> {userDetails.email}
        </p>
        <p>
          <strong>ID:</strong> {userDetails.id}
        </p>
      </div>
      <div className="profile-action">
        <Link className="link" to={"/forget-password"}>
          <Button variant="contained" sx={{ mb: 2 }}>
            Change Password
          </Button>
        </Link>
        <Link className="link" to={"/home"}>
          <Button variant="contained" sx={{ mb: 2 }}>
            Meeting
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
