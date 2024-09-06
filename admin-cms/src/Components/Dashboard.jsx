import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    // Track the logged-in user
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
      {/* AppBar with Logo and Profile Icon */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Logo
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
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
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

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>

      {/* Dialog Popup for Added Rooms */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Added Rooms</DialogTitle>
        <DialogContent>
          {/* Add content for added rooms here */}
          <Typography>Here you can display added rooms details.</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
