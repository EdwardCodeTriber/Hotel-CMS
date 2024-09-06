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
  CircularProgress,
} from "@mui/material";
import { db, storage } from "../Firebase/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const RoomForm = ({ open, onClose }) => {
  const [roomType, setRoomType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = "";
      if (image) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `rooms/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Wait for the image to upload
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            () => {
              // Get the download URL of the uploaded image
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imageUrl = downloadURL;
                resolve();
              });
            }
          );
        });
      }

      // Save room details along with image to Firestore
      await addDoc(collection(db, "rooms"), {
        roomType,
        capacity,
        price,
        availability,
        description,
        imageUrl, 
      });

      alert("Room added successfully");
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

          {/* Display a progress indicator when uploading */}
          {uploading && <CircularProgress style={{ marginTop: 16, justifyContent:"center" }} />}

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
