import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import httpStatus from "http-status";
import "../App.css";
import NavComponent from "./navComponent";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (formState === 0) {
        // Login action
        let result = await handleLogin(username, password);
        setUsername(result);
        localStorage.setItem("username", username);
        setUser(username);
        enqueueSnackbar(`${username} Login Sucess Fully`, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        setMessage("Login successful");
        setOpen(true);
        setError("");
        // Navigate to homepage after successful login
        console.log(result, " authentication");
        navigate("/home");
      }
      if (formState === 1) {
        // Register action
        let result = await handleRegister(name, username, password);
        if (name === "" || username === "" || password === "") {
          enqueueSnackbar("All field Required", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" },
            autoHideDuration: 2000,
          });
          setError("All Field Required");
          return;
        }
        console.log(result);
        setUsername("");
        enqueueSnackbar(`${name} Registration Sucessfully`, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 2000,
        });
        setMessage("Registration successful");
        setOpen(true);
        setError("");
        setFormState(0);
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      let errorMsg = err.response?.data?.message || "An error occurred";
      setError(errorMsg);
      enqueueSnackbar(errorMsg, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: "#3f51b5", // Example primary color
      },
      secondary: {
        main: "#f50057", // Example secondary color
      },
      background: {
        default: "#fff", // Custom background color
      },
    },
  });

  return (
    <>
      <div className="authentication">
        {loading && (
          <div
            style={{ position: "absolute", top: "50%", left: "50%", zIndex: 9 }}
          >
            <CircularProgress />
          </div>
        )}

        <ThemeProvider theme={defaultTheme}>
          <Grid
            container
            component="main"
            sx={{
              justifyContent: "center",
              alignItems: "flex-start",
              bgcolor: "#fff",
              mt: 1,
            }}
          >
            <CssBaseline />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              square
              sx={{ boxShadow: "none", mt: 2, bgcolor: "#fff" }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>

                <div>
                  <Button
                    variant={formState === 0 ? "contained" : ""}
                    onClick={() => setFormState(0)}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={formState === 1 ? "contained" : ""}
                    onClick={() => setFormState(1)}
                  >
                    Sign Up
                  </Button>
                </div>

                <Box component="form" noValidate sx={{ mt: 1 }}>
                  {formState === 1 && (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      value={name}
                      autoFocus
                      helperText={error}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    autoFocus
                    helperText={error}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    value={password}
                    type="password"
                    autoFocus
                    helperText={error}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                  />

                  <p style={{ color: "red" }}>{error}</p>

                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleAuth}
                  >
                    {formState === 0 ? "Login" : "Register"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Snackbar open={open} autoHideDuration={2000} message={message} />
        </ThemeProvider>
      </div>
    </>
  );
}
