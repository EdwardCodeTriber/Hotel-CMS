import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase"; 
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms from Firestore
  const fetchRooms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle delete room
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "rooms", id));
      alert("Room deleted successfully");
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error) {
      console.error("Error deleting room: ", error);
    }
  };

  if (loading) {
    return <Typography>Loading rooms...</Typography>;
  }

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {rooms.map((room) => (
        <Grid item xs={12} sm={6} md={4} key={room.id}>
          <Card>
            {room.imageUrl && (
              <CardMedia
                component="img"
                height="140"
                image={room.imageUrl}
                alt={room.roomType}
              />
            )}
            <CardContent>
              <Typography variant="h5">{room.roomType}</Typography>
              <Typography variant="body2" color="textSecondary">
                Capacity: {room.capacity}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Price: ${room.price}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Availability: {room.availability}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {room.description}
              </Typography>

              {/* Delete Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(room.id)}
                style={{ marginTop: 10 }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RoomList;
