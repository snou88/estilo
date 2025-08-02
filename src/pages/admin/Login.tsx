import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { getPhpApiUrl } from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      // Optionnel : formData.append('remember', remember ? '1' : '0');
      const response = await fetch(getPhpApiUrl('admin/login.php'), {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const responseData = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_token', responseData.token);
        window.location.href = '/admin/dashboard';
      } else {
        setError(responseData.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fadein">
        <div className="flex flex-col items-center mb-6">
          <img src="/estilo.svg" alt="Estilo Admin" className="h-12 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Connexion Admin</h2>
          <p className="text-gray-500 text-sm">Accès réservé à l'administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-50"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-600 text-sm select-none">
              <input
                type="checkbox"
                className="form-checkbox rounded text-blue-600 mr-2"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                disabled={loading}
              />
              Se souvenir de moi
            </label>
            <a href="#" className="text-blue-600 text-sm hover:underline">Mot de passe oublié ?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black text-white font-semibold text-lg shadow hover:bg-black/80 transition disabled:opacity-60"
          >
            <LogIn size={20} /> {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center text-sm font-medium animate-shake">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
