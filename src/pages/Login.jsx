import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/products');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-text">Sales Forecasting Platform</h1>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left: Login */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-text mb-2 text-center">Sign in</h2>
          <p className="text-text-muted text-center mb-6">Login to manage forecasts</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Business Email"
              className="w-full px-4 py-3 rounded bg-background border border-background-card focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded bg-background border border-background-card focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Forgot your password?</span>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-md hover:from-primary-dark hover:to-accent transition-all"
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>
        {/* Right: New User */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary to-accent text-white p-8">
          <h2 className="text-3xl font-extrabold mb-2">New User?</h2>
          <p className="mb-6 text-center">Create an account to start forecasting</p>
          <Link
            to="/register"
            className="border-2 border-white rounded-full px-8 py-3 font-bold text-lg hover:bg-white hover:text-primary transition-all"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 