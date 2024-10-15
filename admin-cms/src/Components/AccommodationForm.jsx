import React, { useState } from "react";
import { db, storage } from "../Firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
  FormControl,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AccommodationForm = ({ onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [rating, setRating] = useState(1);
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [policies, setPolicies] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Upload photos and get their URLs
      const photoUrls = await Promise.all(
        photos.map(async (photo) => {
          const photoRef = ref(storage, `accommodations/${photo.name}`);
          await uploadBytes(photoRef, photo);
          return await getDownloadURL(photoRef);
        })
      );
  
      const newAccommodation = {
        name,
        price: parseFloat(price),
        address,
        rating,
        location,
        amenities,
        policies,
        photos: photoUrls.length > 0 ? photoUrls : null,
      };
  
      // Save data to Firestore
      const docRef = await addDoc(collection(db, "accommodations"), newAccommodation);
    //   console.log("Document written with ID: ", docRef.id);
  
      // Clear the form after saving
      resetForm();
      
      // Trigger onSave callback if it exists and is a function
      if (typeof onSave === 'function') {
        onSave(docRef.id, newAccommodation);
      } else {
        console.warn("onSave prop is not a function or not provided");
      }
  
      // Show success message
      setSnackbarMessage("Accommodation added successfully!");
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error("Error adding accommodation: ", error);
      
      // More detailed error logging
      if (error.code) {
        console.error("Error code:", error.code);
      }
      
      let errorMessage = "Failed to add accommodation. Please try again.";
      if (error.message) {
        errorMessage += ` Error: ${error.message}`;
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setAddress("");
    setRating(1);
    setLocation("");
    setAmenities([]);
    setPolicies("");
    setPhotos([]);
    setIsOpen(false);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const amenitiesOptions = [
    "Wi-Fi",
    "Pool",
    "Parking",
    "Gym",
    "Restaurant",
    "Room Service",
  ];

  return (
    <Box>
      {/* Sticky Floating Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor:"green"
        }}
      >
        <AddIcon />
      </Fab>

      {/* Accommodation Form Popup */}
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Accommodation</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
            }}
          >
            <TextField
              label="Hotel Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Price per Night"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              fullWidth
              required
            />

            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              required
            />

            <InputLabel>Star Rating</InputLabel>
            <Select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Location of the Accommodation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              required
            />

            <FormControl component="fieldset" sx={{ my: 2 }}>
              <Typography variant="subtitle1">Amenities</Typography>
              {amenitiesOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={amenities.includes(option)}
                      onChange={(e) => {
                        const newAmenities = e.target.checked
                          ? [...amenities, option]
                          : amenities.filter((item) => item !== option);
                        setAmenities(newAmenities);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormControl>

            <TextField
              label="Policies"
              value={policies}
              onChange={(e) => setPolicies(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />

            <Button variant="contained" component="label" fullWidth>
              Upload Photos
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => setPhotos([...e.target.files])}
              />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
            Save Accommodation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AccommodationForm;
