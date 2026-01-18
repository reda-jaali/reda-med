import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchCustomers } from './store/slices/customersSlice';
import { checkAuth } from './store/slices/authSlice';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
    
    // Ne charger les données que si l'utilisateur est authentifié
    if (isAuthenticated) {
      dispatch(fetchCustomers());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />
          
          {/* Routes protégées */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <div className="min-vh-100 d-flex flex-column">
                <Header />
                <main className="flex-grow-1 py-4">
                  <div className="container">
                    <Dashboard />
                  </div>
                </main>
                <footer className="bg-light border-top py-3 mt-auto">
                  <div className="container">
                    <div className="text-center text-muted">
                      <small>
                        &copy; {new Date().getFullYear()} Système de Gestion d'Épicerie v2.0
                      </small>
                    </div>
                  </div>
                </footer>
              </div>
            </PrivateRoute>
          } />
          
          {/* Route racine */}
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
          } />
          
          {/* Route 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;