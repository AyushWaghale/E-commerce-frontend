import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background/80 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          <span>Sales ForecastPro</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-text hover:text-primary transition">Home</Link>
          <Link to="/products" className="text-text hover:text-primary transition">Products</Link>
          <Link to="/docs" className="text-text hover:text-primary transition">Docs</Link>

          {user ? (
            <>
             
              <button
                onClick={logout}
                className="ml-4 bg-red-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="ml-4 bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary-dark transition">
              Login
            </Link>
          )}
        </nav>
        {/* Mobile menu button can be added here if needed */}
      </div>
    </header>
  );
};

export default Header;
