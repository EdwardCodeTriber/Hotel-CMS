import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Switch,
  Box,
} from "@mui/material";
import { db } from "../Firebase/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
// import { sendEmailNotification } from "../utils/notifications";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending bookings from Firestore
  const fetchPendingBookings = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      // Query to get only pending bookings
      const q = query(bookingsRef, where("status", "==", "Pending"));
      const querySnapshot = await getDocs(q);
      const bookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // Approve the booking
  const approveBooking = async (id, userEmail) => {
    try {
      const bookingRef = doc(db, "bookings", id);
      await updateDoc(bookingRef, { status: "Approved" });
      // Optionally send notification to the user about approval
    //   sendEmailNotification(userEmail, "Your booking has been approved.");
      // Refresh the booking list
      fetchPendingBookings();
    } catch (error) {
      console.error("Error approving booking: ", error);
    }
  };

  // Cancel the booking
  const cancelBooking = async (id, userEmail) => {
    try {
      const bookingRef = doc(db, "bookings", id);
      
      await deleteDoc(bookingRef);
      // Optionally send notification to the user about the cancellation
    //   sendEmailNotification(userEmail, "Your booking has been canceled.");
      // Refresh the booking list
      fetchPendingBookings();
    } catch (error) {
      console.error("Error canceling booking: ", error);
    }
  };

  if (loading) {
    return <Typography>Loading pending bookings...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Room: {booking.roomType}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Booked by: {booking.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Checking Date: {booking.checkInDate}
                  Check out Date: {booking.checkOutDate}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {booking.status}
                </Typography>

                {/* Approve Booking Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => approveBooking(booking.id, booking.email)}
                  style={{ marginRight: 10 }}
                >
                  Approve
                </Button>

                {/* Cancel Booking Button */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => cancelBooking(booking.id, booking.email)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookingsList;
