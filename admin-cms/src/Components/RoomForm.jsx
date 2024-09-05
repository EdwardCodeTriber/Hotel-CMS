import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { addRoom } from "../Redux/roomsSlice";
import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem } from "@mui/material";

const RoomForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState("");
  const [roomPicture, setRoomPicture] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = () => {
    const room = {
      roomName,
      roomPicture,
      description,
      price: parseFloat(price),
      rating: parseInt(rating),
    };
    dispatch(addRoom(room));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Room</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Room Name"
          fullWidth
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Room Picture URL"
          fullWidth
          value={roomPicture}
          onChange={(e) => setRoomPicture(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Price"
          fullWidth
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Rating"
          fullWidth
          select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[1, 2, 3, 4, 5].map((option) => (
            <MenuItem key={option} value={option}>
              {option} Star
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: 20 }}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
