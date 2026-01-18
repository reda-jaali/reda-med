import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer } from '../../store/slices/customersSlice';
import { validateCustomer } from '../../utils/validators';

const CustomerForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { items: customers } = useSelector((state) => state.customers);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateCustomer(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Check for duplicate name
    const duplicate = customers.find(
      customer => customer.name.toLowerCase() === formData.name.toLowerCase()
    );
    
    if (duplicate) {
      setErrors({ name: 'Ce nom de client existe déjà' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const customerData = {
        ...formData,
        balance: 0,
        isActive: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        transactions: []
      };
      
      await dispatch(createCustomer(customerData)).unwrap();
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        address: '',
        email: ''
      });
      setErrors({});
      
      if (onSuccess) onSuccess();
      
      alert('✅ Client ajouté avec succès !');
      
    } catch (error) {
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-person-plus me-2"></i>
          Nouveau Client
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nom complet <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: reda"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: 06666666"
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: client@example.com"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Adresse
            </label>
            <textarea
              id="address"
              name="address"
              className="form-control"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex: laayoune"
            />
          </div>
          
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Ajouter le client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;