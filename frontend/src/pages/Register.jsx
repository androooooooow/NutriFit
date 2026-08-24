import React, { useState } from 'react';
import InputField from '../../components/InputField';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/users';

export default function Register({ onAuth, onNavigate }) {
  const [formData, setFormData] = useState({
    fullname: '', email: '', password: '', confirmPassword: '',
    age: '', height: '', weight: '', gender: 'male', fitnessGoal: 'lose weight'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell register-shell">
      <section className="auth-brand">
        <div className="brand-mark">NF</div>
        <h2>NutriFit AI</h2>
        <p>Set up your profile once so your dashboard can show goals and body metrics clearly.</p>
      </section>

      <section className="auth-panel wide-panel">
        <p className="eyebrow">Start strong</p>
        <h1>Create Your Account</h1>
        
        <form onSubmit={handleRegister}>
          <InputField placeholder="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} />
          <InputField type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
          <InputField type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          <InputField type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

          <div className="metrics-row">
            <InputField type="number" placeholder="Age" name="age" value={formData.age} onChange={handleChange} min="0" />
            <InputField type="number" placeholder="Height (cm)" name="height" value={formData.height} onChange={handleChange} min="0" />
            <InputField type="number" placeholder="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} min="0" />
          </div>

          <div className="gender-selection">
            <label>Gender</label>
            <div className="gender-buttons">
              {['male', 'female', 'other'].map((g) => (
                <button type="button" key={g} className={formData.gender === g ? 'active' : ''} onClick={() => setFormData({ ...formData, gender: g })}>
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="goal-selection">
            <label>Fitness Goal</label>
            <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
              {['lose weight', 'gain muscle', 'maintain weight', 'improve endurance', 'increase flexibility'].map((goal) => (
                <option key={goal} value={goal}>{goal.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account? <button type="button" onClick={() => onNavigate('login')}>Login</button>
        </p>
      </section>
    </main>
  );
}
