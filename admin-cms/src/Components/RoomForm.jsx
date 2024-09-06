import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, Rating, Box } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Firebase/firebase";

const RoomForm = ({ open, handleClose }) => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [roomImage, setRoomImage] = useState(null);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `rooms/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!roomName || !description || !price || !starRating || !roomImage) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const imageUrl = await handleImageUpload(roomImage);

      await addDoc(collection(db, "rooms"), {
        roomName,
        description,
        price: Number(price),
        starRating,
        imageUrl,
      });

      alert("Room added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding room: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a New Room</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
          <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth type="number" />
          <input type="file" accept="image/*" onChange={(e) => setRoomImage(e.target.files[0])} />
          <Rating
            value={starRating}
            onChange={(event, newValue) => setStarRating(newValue)}
            precision={1}
            max={5}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
