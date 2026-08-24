import React, { useState } from 'react';
import InputField from '../../components/InputField';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/users';

export default function Login({ onAuth, onNavigate }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="brand-mark">NF</div>
        <h1>NutriFit AI</h1>
        <p>Track your body metrics, keep your fitness goal visible, and start building a cleaner routine.</p>
      </section>

      <section className="auth-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>Login</h2>
        <p className="muted">Login to access your NutriFit account.</p>
        
        <form onSubmit={handleLogin}>
          <InputField label="Email Address" type="email" name="email" placeholder="Enter your email:" value={formData.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" placeholder="Enter your Password:" value={formData.password} onChange={handleChange} />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="switch-auth">
          New to NutriFit? <button type="button" onClick={() => onNavigate('register')}>Create account</button>
        </p>
      </section>
    </main>
  );
}
