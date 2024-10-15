import React from 'react';
import { Typography, List, ListItem, Button } from '@mui/material';

const BookingList = ({ bookings, onDelete }) => (
  <List>
    {bookings.map((booking) => (
      <ListItem key={booking.id}>
        <Typography>{`User: ${booking.userId} - Room: ${booking.roomType} - Status: ${booking.status}`}</Typography>
        <Button color="error" onClick={() => onDelete(booking.id)}>Delete</Button>
      </ListItem>
    ))}
  </List>
);

export default BookingList;
