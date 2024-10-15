import React, { useEffect, useState } from "react";
import { db, storage } from "../Firebase/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AccommodationForm from "./AccommodationForm";

const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch accommodations from Firestore
  const fetchAccommodations = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "accommodations"));
      const accommodationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccommodations(accommodationsData);
    } catch (error) {
      showSnackbar("Failed to load accommodations.", "error");
    }
    setIsLoading(false);
  };

  // Toggle availability
  const toggleAvailability = async (accommodation) => {
    try {
      const docRef = doc(db, "accommodations", accommodation.id);
      await updateDoc(docRef, { available: !accommodation.available });
      fetchAccommodations();
      showSnackbar("Availability updated.", "success");
    } catch (error) {
      showSnackbar("Failed to update availability.", "error");
    }
  };

  // Open edit dialog with selected accommodation
  const openEditDialog = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setIsEditDialogOpen(true);
  };

  // Close edit dialog
  const closeEditDialog = () => {
    setSelectedAccommodation(null);
    setIsEditDialogOpen(false);
    setNewPhotoFile(null);
  };

  // Show Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Save updated accommodation details
  const saveAccommodation = async () => {
    setIsSaving(true);
    const docRef = doc(db, "accommodations", selectedAccommodation.id);
    try {
      // If there's a new photo file, upload it first
      if (newPhotoFile) {
        const photoRef = ref(storage, `accommodations/${selectedAccommodation.id}`);
        await uploadBytes(photoRef, newPhotoFile);
        const newPhotoURL = await getDownloadURL(photoRef);
        selectedAccommodation.photos[0] = newPhotoURL;
      }
      // Update Firestore document
      await updateDoc(docRef, selectedAccommodation);
      showSnackbar("Accommodation updated successfully.", "success");
      closeEditDialog();
      fetchAccommodations();
    } catch (error) {
      showSnackbar("Failed to update accommodation.", "error");
    }
    setIsSaving(false);
  };

  // Delete accommodation
  const deleteAccommodation = async (id) => {
    try {
      await deleteDoc(doc(db, "accommodations", id));
      fetchAccommodations();
      showSnackbar("Accommodation deleted successfully.", "success");
    } catch (error) {
      showSnackbar("Failed to delete accommodation.", "error");
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Accommodation List
      </Typography>

      {/* Loader for fetching accommodations */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        accommodations.map((accommodation) => (
          <Card key={accommodation.id} sx={{ display: "flex", mb: 2 }}>
            {accommodation.photos && accommodation.photos.length > 0 && (
              <CardMedia
                component="img"
                sx={{ width: 450 }}
                image={accommodation.photos[0]}
                alt={accommodation.name}
              />
            )}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{accommodation.name}</Typography>
              <Typography>Price per Night: R {accommodation.price}</Typography>
              <Typography>Address: {accommodation.address}</Typography>
              <Typography>Rating: {accommodation.rating} Star</Typography>
              <Typography>Location: {accommodation.location}</Typography>
              <Typography>
                Amenities:{" "}
                {Array.isArray(accommodation.amenities)
                  ? accommodation.amenities.join(", ")
                  : "No amenities listed"}
              </Typography>
              <Typography>Policies: {accommodation.policies}</Typography>

              {/* Availability Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={accommodation.available ?? false}
                    onChange={() => toggleAvailability(accommodation)}
                  />
                }
                label="Available"
              />
            </CardContent>

            {/* Edit and Delete Buttons */}
            <IconButton onClick={() => openEditDialog(accommodation)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteAccommodation(accommodation.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Card>
        ))
      )}

      

      {/* Edit Accommodation Dialog */}
      {selectedAccommodation && (
        <Dialog
          open={isEditDialogOpen}
          onClose={closeEditDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Accommodation</DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Hotel Name"
              value={selectedAccommodation.name}
              onChange={(e) =>
                setSelectedAccommodation({
                  ...selectedAccommodation,
                  name: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price per Night"
              value={selectedAccommodation.price}
              onChange={(e) =>
                setSelectedAccommodation({
                  ...selectedAccommodation,
                  price: e.target.value,
                })
              }
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              value={selectedAccommodation.address}
              onChange={(e) =>
                setSelectedAccommodation({
                  ...selectedAccommodation,
                  address: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={selectedAccommodation.location}
              onChange={(e) =>
                setSelectedAccommodation({
                  ...selectedAccommodation,
                  location: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />

            {/* Amenities Checkboxes */}
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Amenities</Typography>
              {["Wi-Fi", "Pool", "Parking", "Gym", "Restaurant", "Room Service"].map((amenity) => (
                <FormControlLabel
                  key={amenity}
                  control={
                    <Checkbox
                      checked={selectedAccommodation.amenities.includes(amenity)}
                      onChange={(e) => {
                        const updatedAmenities = e.target.checked
                          ? [...selectedAccommodation.amenities, amenity]
                          : selectedAccommodation.amenities.filter(
                              (item) => item !== amenity
                            );
                        setSelectedAccommodation({
                          ...selectedAccommodation,
                          amenities: updatedAmenities,
                        });
                      }}
                    />
                  }
                  label={amenity}
                />
              ))}
            </FormControl>
            <TextField
              label="Policies"
              value={selectedAccommodation.policies}
              onChange={(e) =>
                setSelectedAccommodation({
                  ...selectedAccommodation,
                  policies: e.target.value,
                })
              }
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />

            {/* Photo Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhotoFile(e.target.files[0])}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={closeEditDialog} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={saveAccommodation}
              variant="contained"
              color="primary"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Backdrop Loader for Saving */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSaving}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <AccommodationForm/>
    </Box>
  );
};

export default AccommodationList;
