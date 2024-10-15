import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { TextField, Button, Typography, Box, List, ListItem } from '@mui/material';

const ManageAccommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [newAccommodation, setNewAccommodation] = useState("");

  useEffect(() => {
    const fetchAccommodations = async () => {
      const snapshot = await getDocs(collection(db, "accommodations"));
      setAccommodations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAccommodations();
  }, []);

  const handleAddAccommodation = async () => {
    await addDoc(collection(db, "accommodations"), { name: newAccommodation });
    setNewAccommodation("");
  };

  const handleDeleteAccommodation = async (id) => {
    await deleteDoc(doc(db, "accommodations", id));
  };

  return (
    <Box>
      <Typography variant="h4">Manage Accommodations</Typography>
      <TextField
        label="New Accommodation"
        value={newAccommodation}
        onChange={(e) => setNewAccommodation(e.target.value)}
      />
      <Button onClick={handleAddAccommodation}>Add</Button>
      <List>
        {accommodations.map(accommodation => (
          <ListItem key={accommodation.id}>
            {accommodation.name}
            <Button onClick={() => handleDeleteAccommodation(accommodation.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageAccommodations;
