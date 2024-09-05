import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, TextField, Fab, Dialog, DialogTitle, DialogContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* AppBar with Logo and Profile Icon */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Logo
          </Typography>
          <IconButton edge="end" color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <TextField
          variant="outlined"
          placeholder="Placeholder"
          InputProps={{
            startAdornment: (
              <SearchIcon style={{ marginRight: 8 }} />
            ),
          }}
        />
      </div>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>

      {/* Dialog Popup for Added Rooms */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Added Rooms</DialogTitle>
        <DialogContent>
          {/* Add content for added rooms here */}
          <Typography>Here you can display added rooms details.</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
