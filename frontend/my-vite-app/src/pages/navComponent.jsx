import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useSnackbar } from "notistack";
import UserDropdown from "./UserDropdown";

export default function NavComponent() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, [setUser]);

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
      });
      navigate("/");
    } else {
      enqueueSnackbar("Failed to log out. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };

  return (
    <div className="navBar">
      <nav>
        <div className="navLogo" onClick={() => navigate("/")}>
          <h2>Apna Video</h2>
        </div>
        <div className="navList">
          {user ? (
            <>
              <p style={{ fontWeight: "bold" }}>{user}</p>
              <UserDropdown username={user}/>
              <p onClick={handleLogout}>Logout</p>
            </>
          ) : (
            <>
              <p onClick={() => navigate("/g1u2e3s4t")}>Guest</p>
              <p onClick={() => navigate("/auth")}>Register</p>
              <div role="button" onClick={() => navigate("/auth")}>
                <p>Login</p>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
