import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError, clearSuccess } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, registrationSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/login', { 
          state: { registeredEmail: registeredEmail }
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, error, navigate, dispatch, registeredEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(clearError());
      
      // Tous les nouveaux utilisateurs seront "employe" par défaut
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'employe' // Rôle fixe pour tous les nouveaux utilisateurs
      };
      
      setRegisteredEmail(formData.email);
      await dispatch(register(userData));
    }
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
                  <h2 className="text-primary fw-bold">Créer un compte</h2>
                  <p className="text-muted">Rejoignez notre système de gestion</p>
                </div>
                
                {/* Message d'erreur */}
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
                
                {/* Message de succès d'inscription */}
                {registrationSuccess && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>
                      <strong>Inscription réussie !</strong>
                      <p className="mb-0 mt-1">
                        Votre compte <strong>{registeredEmail}</strong> a été créé avec succès.
                        <br />
                        <small>Redirection vers la page de connexion dans 3 secondes...</small>
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Formulaire d'inscription (masqué si inscription réussie) */}
                {!registrationSuccess ? (
                  <form onSubmit={handleSubmit}>
                    {/* Nom complet */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">
                        <i className="bi bi-person me-2"></i>Nom complet
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                        disabled={loading}
                        autoComplete="name"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2"></i>Adresse email
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="exemple@epicerie.com"
                        disabled={loading}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                    
                    {/* SUPPRIMÉ : Sélecteur de rôle */}
                    
                    {/* Mot de passe */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <i className="bi bi-lock me-2"></i>Mot de passe
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Au moins 6 caractères"
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                    
                    {/* Confirmation mot de passe */}
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold">
                        <i className="bi bi-lock-fill me-2"></i>Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Répétez votre mot de passe"
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                    
                    {/* Bouton d'inscription */}
                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Création du compte...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Créer mon compte
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // Message après inscription réussie
                  <div className="text-center py-4">
                    <div className="mb-3">
                      <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h4 className="text-success">Compte créé avec succès !</h4>
                    <p className="text-muted">
                      Votre compte <strong>{registeredEmail}</strong> a été sauvegardé dans la base de données.
                    </p>
                    <div className="mt-4">
                      <Link to="/login" className="btn btn-primary btn-lg">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Aller à la page de connexion
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Lien vers la connexion (visible seulement avant l'inscription) */}
                {!registrationSuccess && (
                  <div className="mt-4 text-center">
                    <p className="mb-0">
                      <small className="text-muted">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                          Se connecter
                        </Link>
                      </small>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
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

export default Register;