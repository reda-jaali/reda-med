import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold">
          🛒 Gestion d'Épicerie
        </span>
        
        <div className="d-flex align-items-center">
          {user && (
            <div className="me-3 text-white">
              <small>Bienvenue, </small>
              <strong>{user.name || user.email}</strong>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-light btn-sm"
            title="Déconnexion"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;