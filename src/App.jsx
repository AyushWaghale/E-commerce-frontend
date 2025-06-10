import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductEdit from './pages/ProductEdit';
import ProductSalesData from './pages/ProductSalesData';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Documentation from './pages/Documentation';
import Dashboard from './pages/Dashboard';
import PredictionPage from './pages/PredictionPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/docs" element={<Documentation />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id/edit"
                element={
                  <ProtectedRoute>
                    <ProductEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id/sales-data"
                element={
                  <ProtectedRoute>
                    <ProductSalesData />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/prediction" element={<PredictionPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
