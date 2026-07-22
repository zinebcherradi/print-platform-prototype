// frontend/src/components/login/Login.jsx
import React, { useState } from 'react';
import api from '../../services/api'; // Chemin corrigé selon ton arborescence
import './login.css'; // Respect de la casse exacte du fichier CSS

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await api.post(endpoint, { email, password });

      if (isLogin) {
        // Tâche #4 : Stockage du token et redirection
        localStorage.setItem('access_token', response.data.access_token);
        
        // Redirection immédiate vers la page protégée
        window.location.href = '/print'; 
      } else {
        alert('Inscription réussie ! Connectez-vous maintenant.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Se connecter' : "S'inscrire"}</h2>
        
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="input-field"
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="input-field"
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Chargement...' : (isLogin ? 'Connexion' : "S'inscrire")}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="toggle-link"
          >
            {isLogin ? " S'inscrire" : " Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;