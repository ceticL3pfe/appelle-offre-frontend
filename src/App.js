import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Main from './components/Main';
import Admin from './components/Admin';
import CdcList from './components/Cdc'
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from './features/users/userSlice';

function App() {
  // Assume userRoles is an array containing the roles of the authenticated user

  // Define a custom route component that checks user roles and permissions
  const ProtectedRoute = ({ element, requiredRoles }) => {
    const user = useSelector(selectUser)
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
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<ProtectedRoute element={<Main />} requiredRoles={["agentTc", "admin", "directeur", "commission", "controlleurDeGestion"]} />} />
          <Route path="/cdc" element={<ProtectedRoute element={<CdcList />} requiredRoles={["agentTc", "admin", "directeur", "commission", "controlleurDeGestion"]} />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRoles={["admin"]} />} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;