import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Typography, Button, List, ListItem, Box } from '@mui/material';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, 'bookings'));
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (id) => {
    await deleteDoc(doc(db, 'bookings', id));
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4">Manage Bookings</Typography>
      <List>
        {bookings.map((booking) => (
          <ListItem key={booking.id}>
            <Typography>{`Booking for: ${booking.userId} - Status: ${booking.status}`}</Typography>
            <Button color="error" onClick={() => handleDeleteBooking(booking.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageBookings;
