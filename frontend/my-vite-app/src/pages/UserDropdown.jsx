// src/components/UserDropdown.js
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ username }) => {

    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const { user, setUser } = useUser();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, [setUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token && !storedUsername) {
      setUser(null);
      enqueueSnackbar("Successfully logged out.", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration:2000,
      });
      navigate("/");
    } else {
      // If either token or username wasn't removed, show an error
      enqueueSnackbar("Failed to log out. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center", },
        autoHideDuration:2000,
      });
    }
  };

  const avatarContent = username ? username.charAt(0).toUpperCase() : "";

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="large"
        edge="end"
        aria-controls="user-menu"
        aria-haspopup="true"
        sx={{ padding: "0px", margin: "0px", fontSize: "1px" }}
      >
        <Avatar sx={{ width: 25, height: 25 }}>
          {avatarContent || <AccountCircleIcon />}
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            width: "200px", // Set the desired width
          },
        }}
      >
        <MenuItem>
          {" "}
          <AccountCircleIcon sx={{mr:1}} />
          {username}
        </MenuItem>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserDropdown;
