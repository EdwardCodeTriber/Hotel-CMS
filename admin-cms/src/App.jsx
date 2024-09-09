import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import LogIn from "./Components/LogIn";
import RoomForm from "./Components/RoomForm";
import RoomList from "./Components/RoomList";
import BookingsList from "./Components/BookingsList";
// import LoginAdmin from "./Components/LoginAdmin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/RoomForm" element={<RoomForm/>}/>
          <Route path="/RoomList" element={<RoomList/>}/>
          <Route path="/BookinsList" element={<BookingsList/>}/>
        </Routes>
      </BrowserRouter>
      {/* <Dashboard/> */}
      {/* <LoginAdmin/> */}
    </>
  );
}

export default App;
