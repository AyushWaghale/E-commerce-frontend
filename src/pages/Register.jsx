import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-black">Sales Forecasting Platform</h1>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left: Welcome Back */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-pink-500 text-white p-8">
          <h2 className="text-3xl font-extrabold mb-2">Welcome Back!</h2>
          <p className="mb-6 text-center">Login to access sales insights</p>
          <Link
            to="/login"
            className="border-2 border-white rounded-full px-8 py-3 font-bold text-lg hover:bg-white hover:text-orange-500 transition-all"
          >
            SIGN IN
          </Link>
        </div>
        {/* Right: Register */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-black mb-2 text-center">Create Account</h2>
          <p className="text-gray-600 text-center mb-6">Register to access forecasting insights</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              // required
            /> */}
            <input
              type="email"
              placeholder="Business Email"
              className="w-full px-4 py-3 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-md hover:from-orange-600 hover:to-pink-600 transition-all"
            >
              {loading ? 'Signing up...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 