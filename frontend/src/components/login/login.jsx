
import React, { useState } from 'react';
import api from '../../services/api';
import './login.css';

const PrinterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (mode) => { setIsLogin(mode); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { email, password }
        : { full_name: fullName, email, password, confirm_password: confirmPassword };

      const response = await api.post(endpoint, payload);

      if (isLogin) {
        localStorage.setItem('access_token', response.data.access_token);
        window.location.href = '/print';
      } else {
        alert('Inscription réussie ! Connectez-vous maintenant.');
        switchMode(true);
        setFullName('');
        setConfirmPassword('');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = Array.isArray(detail) ? detail.map(e => e.msg).join(', ') : (detail || 'Une erreur est survenue');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div>
        <div className="brand-mark">
          <span className="brand-icon"><PrinterIcon /></span>
          <span className="brand-wordmark">Impression Express</span>
        </div>

        <div className="login-card">
          <h2>{isLogin ? 'Connexion' : 'Créer un compte'}</h2>
          <p className="login-subtitle">
            {isLogin ? 'Accédez à votre espace d\'impression' : 'Quelques informations pour commencer'}
          </p>

          <div className="mode-switch">
            <button type="button" className={isLogin ? 'active' : ''} onClick={() => switchMode(true)}>Connexion</button>
            <button type="button" className={!isLogin ? 'active' : ''} onClick={() => switchMode(false)}>Inscription</button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="input-group">
                <label>Nom complet</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin} className="input-field" disabled={loading} placeholder="Ex: Zineb Cherradi" />
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" disabled={loading} placeholder="vous@exemple.com" />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" disabled={loading} placeholder="••••••••" />
            </div>

            {!isLogin && (
              <div className="input-group">
                <label>Confirmer le mot de passe</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!isLogin} className="input-field" disabled={loading} placeholder="••••••••" />
              </div>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;