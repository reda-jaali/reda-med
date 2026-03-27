import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, clearSuccess } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, success, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    if (error || success) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, error, success, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    await dispatch(login({ email, password }));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span className="display-4 text-primary">🛒</span>
                  </div>
                  <h2 className="text-primary fw-bold">Gestion d'Épicerie</h2>
                  <p className="text-muted">Connectez-vous à votre espace</p>
                </div>
                
                {/* Messages d'erreur/succès */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => dispatch(clearError())}
                    ></button>
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Connexion réussie ! Redirection en cours...
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => dispatch(clearSuccess())}
                    ></button>
                  </div>
                )}
                
                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>Adresse email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="exemple@epicerie.com"
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>Mot de passe
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Votre mot de passe"
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                    <div className="form-text">
                      <Link to="/forgot-password" className="text-decoration-none">
                        <small>Mot de passe oublié ?</small>
                      </Link>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 py-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Se connecter
                      </>
                    )}
                  </button>
                </form>
                
                {/* SUPPRIMÉ : Section des comptes de démonstration */}
                
                {/* Lien vers l'inscription */}
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    <small className="text-muted">
                      Pas encore de compte ?{' '}
                      <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                        Créer un compte
                      </Link>
                    </small>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer de la page login */}
            <div className="text-center mt-4">
              <small className="text-muted">
                &copy; {new Date().getFullYear()} Système de Gestion d'Épicerie
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;