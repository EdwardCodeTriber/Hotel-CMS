import React from 'react';
import { Typography, List, ListItem, Button } from '@mui/material';

const UserList = ({ users, onDelete }) => (
  <List>
    {users.map((user) => (
      <ListItem key={user.id}>
        <Typography>{`User: ${user.name} - Email: ${user.email}`}</Typography>
        <Button color="error" onClick={() => onDelete(user.id)}>Delete</Button>
      </ListItem>
    ))}
  </List>
);

export default UserList;
