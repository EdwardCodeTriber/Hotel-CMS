import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase"; 
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions, 
} from "@mui/material";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

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

  // Handle availability toggle
  const toggleAvailability = async (id, currentStatus) => {
    try {
      const roomRef = doc(db, "rooms", id);
      await updateDoc(roomRef, { availability: currentStatus === "Available" ? "Unavailable" : "Available" });
      fetchRooms(); 
    } catch (error) {
      console.error("Error updating availability: ", error);
    }
  };

  // Handle delete room
  const deleteRoom = async (id) => {
    try {
      const roomRef = doc(db, "rooms", id);
      await deleteDoc(roomRef);
      fetchRooms(); 
    } catch (error) {
      console.error("Error deleting room: ", error);
    }
  };

  // Handle open edit dialog
  const openEditRoomDialog = (room) => {
    setSelectedRoom(room);
    setOpenEditDialog(true);
  };

  // Handle close edit dialog
  const closeEditRoomDialog = () => {
    setOpenEditDialog(false);
    setSelectedRoom(null);
  };

  // Handle room edit submit
  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      const roomRef = doc(db, "rooms", selectedRoom.id);
      await updateDoc(roomRef, {
        roomType: selectedRoom.roomType,
        price: selectedRoom.price,
        capacity: selectedRoom.capacity,
        description: selectedRoom.description,
      });
      fetchRooms(); 
      closeEditRoomDialog();
    } catch (error) {
      console.error("Error updating room: ", error);
    }
  };

  if (loading) {
    return <Typography>Loading rooms...</Typography>;
  }

  return (
    <div>
      {/* Display rooms in a grid */}
      <Grid container spacing={3} style={{ padding: "20px" }}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              {room.imageBase64 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={room.imageBase64}
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

                {/* Toggle availability */}
                <div style={{ marginTop: 10 }}>
                  <Switch
                    checked={room.availability === "Available"}
                    onChange={() => toggleAvailability(room.id, room.availability)}
                    color="primary"
                  />
                  <Typography variant="body2">
                    {room.availability === "Available" ? "Available" : "Unavailable"}
                  </Typography>
                </div>

                {/* Edit Button */}
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 10, marginRight: 10 }}
                  onClick={() => openEditRoomDialog(room)}
                >
                  Edit
                </Button>

                {/* Delete Button */}
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => deleteRoom(room.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Room Dialog */}
      <Dialog open={openEditDialog} onClose={closeEditRoomDialog}>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          {selectedRoom && (
            <form onSubmit={handleEditRoom}>
              <TextField
                label="Room Type"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedRoom.roomType}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, roomType: e.target.value })}
                required
              />
              <TextField
                label="Capacity"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedRoom.capacity}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, capacity: e.target.value })}
                required
              />
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedRoom.price}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, price: e.target.value })}
                required
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={selectedRoom.description}
                onChange={(e) => setSelectedRoom({ ...selectedRoom, description: e.target.value })}
                required
              />
              <DialogActions>
                {/* Cancel Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={closeEditRoomDialog}
                >
                  Cancel
                </Button>

                {/* Save Changes Button */}
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomList;
