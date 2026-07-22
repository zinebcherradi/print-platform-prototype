// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importation des composants selon leur emplacement réel
import Login from './components/login/login'; // Dossier login/
import ProtectedRoute from './components/ProtectedRoute'; // Directement dans components/
import PrintPage from './pages/PrintPage'; // Dossier pages/ (à créer si pas encore fait)

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Page d'impression protégée */}
        <Route 
          path="/print" 
          element={
            <ProtectedRoute>
              <PrintPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirection par défaut vers login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;