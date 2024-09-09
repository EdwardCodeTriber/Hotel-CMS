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
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from Firestore
  const fetchBookings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bookings"));
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
    fetchBookings();
  }, []);

  // Approve or disapprove a booking
  const toggleApproval = async (id, currentStatus) => {
    try {
      const bookingRef = doc(db, "bookings", id);
      await updateDoc(bookingRef, {
        status: currentStatus === "Pending" ? "Approved" : "Pending",
      });
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status: ", error);
    }
  };

  if (loading) {
    return <Typography>Loading bookings...</Typography>;
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
                  Booking Date: {booking.timestamp}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {booking.status}
                </Typography>

                {/* Toggle booking approval */}
                <div style={{ marginTop: 10 }}>
                  <Switch
                    checked={booking.status === "Approved"}
                    onChange={() => toggleApproval(booking.id, booking.status)}
                    color="primary"
                  />
                  <Typography variant="body2">
                    {booking.status === "Approved" ? "Approved" : "Pending"}
                  </Typography>
                </div>

                {/* Approve / Disapprove Buttons */}
                <div style={{ marginTop: 10 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleApproval(booking.id, booking.status)}
                    style={{ marginRight: 10 }}
                  >
                    {booking.status === "Approved" ? "Disapprove" : "Approve"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookingsList;
