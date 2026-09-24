import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand">
          <span className="brand-mark"><GraduationCap size={18} /></span>
          Study Mate
        </div>
        <form className="card" onSubmit={handleSubmit}>
          <h2>Create an account</h2>
          <div className="row">
            <div className="field-icon">
              <User size={14} />
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div className="field-icon">
              <Mail size={14} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="row">
            <div className="field-icon">
              <Lock size={14} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          {error && <p className="error-text"><AlertCircle size={14} /> {error}</p>}
          <button className="btn" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Creating…' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--sub)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
