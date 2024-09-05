import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import LogIn from './Components/Login'



function App() {

  return (
    <>
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<LogIn/>} />
      <Route path="/Dashboard" element={<Dashboard/>}/>
     </Routes>
    </BrowserRouter>
     {/* <Dashboard/> */}
    </>
  )
}

export default App
