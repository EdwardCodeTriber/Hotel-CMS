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
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import picture from "../assets/outdoor.jpg";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase"; // Ensure this imports your Firestore setup
import RoomForm from "./RoomForm"; 
import AccommodationList from "./AccommodationList";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccommodations, setTotalAccommodations] = useState(0);
  const [totalBooked, setTotalBooked] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch total counts
  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      // Fetch total users
      const userSnapshot = await getDocs(collection(db, "Users")); 
      setTotalUsers(userSnapshot.size);

      // Fetch total accommodations
      const accommodationSnapshot = await getDocs(collection(db, "accommodations"));
      setTotalAccommodations(accommodationSnapshot.size);

      // Fetch total booked accommodations
      const bookedSnapshot = await getDocs(collection(db, "bookings")); 
      setTotalBooked(bookedSnapshot.size);
    } catch (error) {
      console.error("Error fetching counts: ", error);
    }
    setIsLoading(false);
  };

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

  const bookings = () => {
    navigate("/BookingsList");
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div>
      <Box
        sx={{
          backgroundImage: `url(${picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}
      >
        <AppBar position="static" sx={{ background: "grey" }}>
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
              <Button color="inherit" onClick={bookings}>Bookings</Button>
              <IconButton edge="end" color="inherit">
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
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

        {/* Count Containers */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Total Users</Typography>
                  <Typography variant="h6">{totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Total Accommodations</Typography>
                  <Typography variant="h6">{totalAccommodations}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Total Booked Accommodations</Typography>
                  <Typography variant="h6">{totalBooked}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Accommodation List Display */}
        <AccommodationList />

        {/* RoomForm Component */}
        <RoomForm open={open} onClose={handleClose} />
      </Box>
    </div>
  );
};

export default Dashboard;
