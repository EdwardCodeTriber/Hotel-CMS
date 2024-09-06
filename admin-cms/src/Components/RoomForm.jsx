import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl
} from "@mui/material";
import { db } from "./Firebase/firebase"; 
import { collection, addDoc } from "firebase/firestore";

const RoomForm = ({ open, onClose }) => {
  const [roomType, setRoomType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "rooms"), {
        roomType,
        capacity,
        price,
        availability,
        description,
      });
      alert("Room added successfully");
      onClose();
    } catch (error) {
      console.error("Error adding room: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a New Room</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Room Type"
            variant="outlined"
            fullWidth
            margin="normal"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          />
          <TextField
            label="Capacity"
            variant="outlined"
            fullWidth
            margin="normal"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            margin="normal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Availability</InputLabel>
            <Select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
