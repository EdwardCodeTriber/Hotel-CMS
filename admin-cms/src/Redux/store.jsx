import { configureStore } from "@reduxjs/toolkit";
import roomsReducer from "./roomsSlice";
import userReducer from "./authSlice";
const store = configureStore({
  reducer: {
    auth: userReducer,
    rooms: roomsReducer,
  },
});

export default store;