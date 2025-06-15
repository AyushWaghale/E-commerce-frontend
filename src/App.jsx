import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ProductEdit = lazy(() => import('./pages/ProductEdit'));
const ProductSalesData = lazy(() => import('./pages/ProductSalesData'));
const Landing = lazy(() => import('./pages/Landing'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PredictionPage = lazy(() => import('./pages/PredictionPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected Route component with loading state
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Suspense fallback={<LoadingSpinner />}>
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
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/prediction"
                    element={
                      <ProtectedRoute>
                        <PredictionPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Catch all route for 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
