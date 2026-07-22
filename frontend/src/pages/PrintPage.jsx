// frontend/src/pages/PrintPage.jsx
import React, { useState } from 'react';
import api from '../services/api';
import './PrintPage.css';

const PRICING = { bw: { label: 'Noir & Blanc', price: 0.10 }, color: { label: 'Couleur', price: 0.25 } };

const PrintPage = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [colorMode, setColorMode] = useState('bw');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false); // Tâche #14: Feedback visuel

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile); setError(''); setPageCount(0); setOrderSuccess(false);
    } else { setError('⚠️ Veuillez sélectionner un fichier PDF valide.'); setFile(null); }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData(); formData.append('file', file);
      const res = await api.post('/upload-pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPageCount(res.data.num_pages);
    } catch (err) { setError(err.response?.data?.detail || 'Erreur analyse'); } 
    finally { setLoading(false); }
  };

  // Tâche #12: Envoyer la commande au backend
  const handleOrder = async () => {
    if (!file || pageCount === 0) return;
    setLoading(true); setError('');
    
    try {
      await api.post('/order', {
        filename: file.name,
        num_pages: pageCount,
        color_mode: colorMode,
        total_price: parseFloat((pageCount * PRICING[colorMode].price).toFixed(2))
      });
      setOrderSuccess(true); // Afficher message succès
      setTimeout(() => { setFile(null); setPageCount(0); setOrderSuccess(false); }, 4000); // Reset auto
    } catch (err) { 
      setError(err.response?.data?.detail || 'Erreur lors de la commande. Vérifiez votre connexion.'); 
    } finally { setLoading(false); }
  };

  const totalPrice = (pageCount * PRICING[colorMode].price).toFixed(2);
  const handleLogout = () => { localStorage.removeItem('access_token'); window.location.href = '/login'; };

  return (
    <div className="print-container">
      <header className="print-header">
        <h1>Plateforme d'Impression</h1>
        <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
      </header>

      <div className="print-workspace">
        {/* Section Upload */}
        <section className="card upload-section">
          <h2>1. Votre Document</h2>
          <div className="file-input-wrapper">
            <input type="file" accept=".pdf" onChange={handleFileChange} id="pdf-upload" disabled={loading || orderSuccess} />
            <label htmlFor="pdf-upload" className="file-label">
              {file ? `📄 ${file.name}` : "Choisir un fichier PDF"}
            </label>
          </div>
          {file && !pageCount && !orderSuccess && (
            <button onClick={handleUpload} className="btn-primary" disabled={loading}>
              {loading ? 'Analyse...' : 'Détecter les pages'}
            </button>
          )}
          {error && <p className="error-msg">{error}</p>}
        </section>

        {/* Section Options & Commande */}
        {pageCount > 0 && !orderSuccess && (
          <section className="card options-section">
            <h2>2. Options d'impression</h2>
            <div className="radio-group">
              <label className={`radio-card ${colorMode === 'bw' ? 'active' : ''}`} onClick={() => setColorMode('bw')}>
                <input type="radio" name="mode" value="bw" checked={colorMode === 'bw'} readOnly />
                <div className="radio-content"><span className="radio-title">Noir & Blanc</span><span className="radio-price">0.10 DH/page</span></div>
              </label>
              <label className={`radio-card ${colorMode === 'color' ? 'active' : ''}`} onClick={() => setColorMode('color')}>
                <input type="radio" name="mode" value="color" checked={colorMode === 'color'} readOnly />
                <div className="radio-content"><span className="radio-title">Couleur</span><span className="radio-price">0.25 DH/page</span></div>
              </label>
            </div>

            <div className="price-summary">
              <div className="summary-row"><span>Pages :</span><strong>{pageCount}</strong></div>
              <div className="summary-row"><span>Mode :</span><strong>{PRICING[colorMode].label}</strong></div>
              <div className="summary-total"><span>Total estimé :</span><strong className="total-amount">{totalPrice} DH</strong></div>
            </div>

            <button className="btn-order" onClick={handleOrder} disabled={loading}>
              {loading ? 'Traitement...' : '✅ Passer commande'}
            </button>
          </section>
        )}

        {/* Message de Succès (Tâche #14) */}
        {orderSuccess && (
          <div className="card success-card">
            <h2>🎉 Commande confirmée !</h2>
            <p>Votre document <strong>{file?.name}</strong> ({pageCount} pages en {PRICING[colorMode].label}) a été enregistré.</p>
            <p className="success-sub">Total facturé : <strong>{totalPrice} DH</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintPage;