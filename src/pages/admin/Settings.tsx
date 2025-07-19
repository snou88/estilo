import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import AdminFooter from '../../components/AdminFooter';
import { Save, Upload, Eye, EyeOff } from 'lucide-react';
import '../AdminLayout.css';

interface SiteSettings {
  site_name: string;
  site_description: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  currency: string;
  tax_rate: number;
  shipping_cost: number;
  free_shipping_threshold: number;
  maintenance_mode: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '',
    site_description: '',
    site_email: '',
    site_phone: '',
    site_address: '',
    currency: 'EUR',
    tax_rate: 20,
    shipping_cost: 5.99,
    free_shipping_threshold: 50,
    maintenance_mode: false,
    email_notifications: true,
    sms_notifications: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/backend/api/admin/settings.php');
      const data = await response.json();
      setSettings(data.settings || settings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/backend/api/admin/settings.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert('Paramètres sauvegardés avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('/backend/api/admin/change-password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
      
      if (response.ok) {
        alert('Mot de passe modifié avec succès !');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        alert('Erreur lors de la modification du mot de passe');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du mot de passe');
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'commerce', label: 'E-commerce' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Sécurité' }
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">
            <div style={{ textAlign: 'center', padding: '60px' }}>Chargement...</div>
          </main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Paramètres</h1>
            <button 
              className="admin-btn"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              <Save size={16} style={{ marginRight: '8px' }} />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          {/* Onglets */}
          <div className="admin-card">
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                    color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                    fontWeight: activeTab === tab.id ? '600' : '400'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'general' && (
              <div className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Nom du site</label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    className="admin-form-input"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    className="admin-form-textarea"
                    rows={3}
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Email de contact</label>
                  <input
                    type="email"
                    value={settings.site_email}
                    onChange={(e) => handleInputChange('site_email', e.target.value)}
                    className="admin-form-input"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Téléphone</label>
                  <input
                    type="tel"
                    value={settings.site_phone}
                    onChange={(e) => handleInputChange('site_phone', e.target.value)}
                    className="admin-form-input"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Adresse</label>
                  <textarea
                    value={settings.site_address}
                    onChange={(e) => handleInputChange('site_address', e.target.value)}
                    className="admin-form-textarea"
                    rows={3}
                  />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={settings.maintenance_mode}
                    onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                  />
                  <label htmlFor="maintenance" style={{ fontWeight: '600' }}>
                    Mode maintenance
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'commerce' && (
              <div className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Devise</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="admin-form-select"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre (£)</option>
                  </select>
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Taux de TVA (%)</label>
                  <input
                    type="number"
                    value={settings.tax_rate}
                    onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value))}
                    className="admin-form-input"
                    step="0.1"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Frais de livraison (€)</label>
                  <input
                    type="number"
                    value={settings.shipping_cost}
                    onChange={(e) => handleInputChange('shipping_cost', parseFloat(e.target.value))}
                    className="admin-form-input"
                    step="0.01"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Seuil livraison gratuite (€)</label>
                  <input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => handleInputChange('free_shipping_threshold', parseFloat(e.target.value))}
                    className="admin-form-input"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="admin-form">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    id="email_notifications"
                    checked={settings.email_notifications}
                    onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                  />
                  <label htmlFor="email_notifications" style={{ fontWeight: '600' }}>
                    Notifications par email
                  </label>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    id="sms_notifications"
                    checked={settings.sms_notifications}
                    onChange={(e) => handleInputChange('sms_notifications', e.target.checked)}
                  />
                  <label htmlFor="sms_notifications" style={{ fontWeight: '600' }}>
                    Notifications par SMS
                  </label>
                </div>
                
                <div style={{ 
                  background: '#f0f9ff', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>Types de notifications</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#0369a1' }}>
                    <li>Nouvelles commandes</li>
                    <li>Messages de contact</li>
                    <li>Alertes de stock faible</li>
                    <li>Rapports quotidiens</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="admin-form">
                <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: '600' }}>
                  Changer le mot de passe
                </h3>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Mot de passe actuel</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        current_password: e.target.value
                      }))}
                      className="admin-form-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Nouveau mot de passe</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      new_password: e.target.value
                    }))}
                    className="admin-form-input"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Confirmer le nouveau mot de passe</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirm_password: e.target.value
                    }))}
                    className="admin-form-input"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="admin-btn"
                  disabled={!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                >
                  Changer le mot de passe
                </button>
                
                <div style={{ 
                  background: '#fef3c7', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #fbbf24',
                  marginTop: '24px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>Conseils de sécurité</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
                    <li>Utilisez un mot de passe d'au moins 8 caractères</li>
                    <li>Mélangez lettres, chiffres et symboles</li>
                    <li>Ne réutilisez pas vos anciens mots de passe</li>
                    <li>Changez votre mot de passe régulièrement</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default Settings;
