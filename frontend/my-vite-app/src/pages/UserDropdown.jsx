// src/components/UserDropdown.js
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSnackbar } from "notistack";
import { useNavigate,Link } from "react-router-dom";

const UserDropdown = ({ username }) => {

    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const { user, setUser } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

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
    
    setUser(null);
    enqueueSnackbar("Successfully logged out.", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "center" },
      autoHideDuration: 2000,
    });
    navigate("/");
  };
  

  const outService=() =>{
    enqueueSnackbar("This feature is under development!",{variant:'info',anchorOrigin:{vertical:'top',horizontal:'center'},autoHideDuration:2000});
    handleClose();
  }

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
        <Avatar sx={{ width: 25, height: 25, border:'2px solid orange' }}>
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
            width: "200px", 
          },
        }}
      >
        <MenuItem>
          {" "}
          
          <AccountCircleIcon sx={{mr:1}} />
          <Link to={"/home"} style={{textDecoration:'none',color:'black'}}>{username}</Link>
          
        </MenuItem>
        <MenuItem onClick={outService}>Profile</MenuItem>
        <MenuItem onClick={outService}>Settings</MenuItem>
        <MenuItem onClick={handleClose}><Link to={"/contact-page"} style={{textDecoration:'none',color:'black'}}> Contact Us</Link></MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleClose}>
            <Link to={"/admin-dashboard"} style={{textDecoration:'none',color:'black'}}>Admin</Link>
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout} style={{color:'red'}}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserDropdown;
