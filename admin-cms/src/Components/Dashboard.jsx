import React, { useState, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Fab,
  Button,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RoomForm from "./RoomForm"; 
import RoomList from './RoomList'

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <Box sx={{
          backgroundImage: `url(${picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}>
      <AppBar position="static" sx={{background:"grey"}}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Avatar alt="Logo" src="/Logo.png" sx={{ width: 50, height: 50 }} />
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            {user && (
              <Typography variant="body1" style={{ marginRight: 16 }}>
                {user.email}
              </Typography>
            )}
            <IconButton edge="end" color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <TextField
          variant="outlined"
          placeholder="Search"
          InputProps={{
            startAdornment: <SearchIcon style={{ marginRight: 8 }} />,
          }}
        />
      </div>
      {/* Room List Display */}
      <RoomList/>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>

      {/* RoomForm Component */}
      <RoomForm open={open} onClose={handleClose} />
      </Box>
    </div>
  );
};

export default Dashboard;
