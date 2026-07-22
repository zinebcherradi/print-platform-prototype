// frontend/src/components/login/Login.jsx
import React, { useState } from 'react';
import api from '../../services/api';
import './login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  // ✅ NOUVEAUX ÉTATS POUR L'INSCRIPTION
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

      // ✅ PRÉPARATION DES DONNÉES SELON LE MODE
      const payload = isLogin
        ? { email, password }
        : {
          full_name: fullName,
          email,
          password,
          confirm_password: confirmPassword
        };

      const response = await api.post(endpoint, payload);

      if (isLogin) {
        localStorage.setItem('access_token', response.data.access_token);
        window.location.href = '/print';
      } else {
        alert('Inscription réussie ! Connectez-vous maintenant.');
        setIsLogin(true);
        // Reset des champs d'inscription après succès
        setFullName('');
        setConfirmPassword('');
      }
    } catch (err) {
      // Gestion intelligente des erreurs Pydantic (tableau ou string)
      const detail = err.response?.data?.detail;
      const errorMsg = Array.isArray(detail)
        ? detail.map(e => e.msg).join(', ')
        : (detail || 'Une erreur est survenue');

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Se connecter' : "Créer un compte"}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">

          {/* ✅ CHAMP NOM COMPLET (UNIQUEMENT INSCRIPTION) */}
          {!isLogin && (
            <div className="input-group">
              <label>Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="input-field"
                disabled={loading}
                placeholder="Ex: Zineb Cherradi"
              />
            </div>
          )}

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

          {/* ✅ CHAMP CONFIRMER MOT DE PASSE (UNIQUEMENT INSCRIPTION) */}
          {!isLogin && (
            <div className="input-group">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                className="input-field"
                disabled={loading}
              />
            </div>
          )}

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