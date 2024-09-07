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
  FormControl,
} from "@mui/material";
import { db } from "../Firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const RoomForm = ({ open, onClose }) => {
  const [roomType, setRoomType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState(null); 
  const [uploading, setUploading] = useState(false);

  // Handle image selection and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Save room details along with base64 image to Firestore
      await addDoc(collection(db, "rooms"), {
        roomType,
        capacity,
        price,
        availability,
        description,
        imageBase64, 
      });

      alert("Room added successfully");
      setRoomType("");
      setCapacity("");
      setPrice("");
      setAvailability("");
      setDescription("");
      setImageBase64(null); 
      onClose();
    } catch (error) {
      console.error("Error adding room: ", error);
    } finally {
      setUploading(false);
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
          <Button variant="contained" component="label" fullWidth>
            Upload Room Picture
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          {/* Show preview of the selected image */}
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Room Preview"
              style={{ width: "100%", marginTop: 16 }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: 16 }}
            disabled={uploading}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
