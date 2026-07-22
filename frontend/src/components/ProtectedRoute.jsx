// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  
  // Si pas de token, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si token présent, afficher la page demandée
  return children;
};

export default ProtectedRoute;