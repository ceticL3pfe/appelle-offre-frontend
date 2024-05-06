import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Directeur from './components/Directeur';
import Admin from './components/Admin';
import CdcList from './components/Cdc'
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from './features/users/userSlice';
import AgentTc from './components/AgentTc';
import Commission from './components/Commission';
import Cdg from './components/Cdg';
import NavBar from './components/NavBar';
import { Box } from '@mui/material';
import Archive from './components/Archive';

function App() {
  // Assume userRoles is an array containing the roles of the authenticated user

  // Define a custom route component that checks user roles and permissions
  const ProtectedRoute = ({ element, requiredRoles }) => {
    const user = useSelector(selectUser) // hnaya sa depend ntaya kifach rak tkhabi les donnees ta3 logedin user haka rani dayarha b Redux
    console.log(user)
    if (!user) {

      console.log("Login first")
      return <Navigate to="/" />;
    }
    const userRoles = [user?.role]
    console.log(userRoles)
    // Check if the user has all of the required roles
    const hasRequiredRoles = requiredRoles.some(role => userRoles.includes(role));
    // If user has required roles, render the element, otherwise redirect to "/"
    return hasRequiredRoles ? element : <Navigate to="../" />;
  };





  return (
    <Box className="App" sx={{
      overflowY: 'hidden',
      overflowX: 'hidden',
}}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />

          <Route path="/directeur" element={<ProtectedRoute element={<><NavBar/><Directeur /></>} requiredRoles={[ "admin", "directeur"]} />} />
        
          <Route path="/agentTc" element={<ProtectedRoute element={<><NavBar /><AgentTc /></>} requiredRoles={["agentTc", "admin"]} />} />
          <Route path="/commission" element={<ProtectedRoute element={<><NavBar /><Commission /></>} requiredRoles={["commission", "admin"]} />} />
          <Route path="/cg" element={<ProtectedRoute element={<><NavBar /><Cdg /></>} requiredRoles={["controlleurDeGestion", "admin"]} />} />
          <Route path="/archive" element={<ProtectedRoute element={<><NavBar /><Archive /></>} requiredRoles={["controlleurDeGestion", "admin","agentTc","directeur","commission"]} />} />
         
         
       

          <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRoles={["admin"]} />} />


        </Routes>
      </Router>
    </Box>
  );
}

export default App;