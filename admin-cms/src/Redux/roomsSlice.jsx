import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../Firebase/firebase'


// Async thunk to fetch rooms from Firebase
export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
  const querySnapshot = await getDocs(collection(db, "rooms"));
  const rooms = [];
  querySnapshot.forEach((doc) => {
    rooms.push({ id: doc.id, ...doc.data() });
  });
  return rooms;
});

// Async thunk to add a new room to Firebase
export const addRoom = createAsyncThunk("rooms/addRoom", async (room) => {
  const docRef = await addDoc(collection(db, "rooms"), room);
  return { id: docRef.id, ...room };
});

// Async thunk to update a room in Firebase
export const updateRoom = createAsyncThunk("rooms/updateRoom", async ({ id, updatedRoom }) => {
  const roomRef = doc(db, "rooms", id);
  await updateDoc(roomRef, updatedRoom);
  return { id, ...updatedRoom };
});

// Async thunk to delete a room from Firebase
export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (id) => {
  await deleteDoc(doc(db, "rooms", id));
  return id;
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex((room) => room.id === action.payload.id);
        state.rooms[index] = action.payload;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
      });
  },
});

export default roomsSlice.reducer;
