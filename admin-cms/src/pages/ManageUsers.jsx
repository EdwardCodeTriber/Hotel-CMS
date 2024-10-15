import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Typography, Button, List, ListItem, Box } from '@mui/material';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4">Manage Users</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <Typography>{`User: ${user.name} - Email: ${user.email}`}</Typography>
            <Button color="error" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageUsers;
