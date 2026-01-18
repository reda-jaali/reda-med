import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/slices/customersSlice';

const TransactionForm = () => {
  const dispatch = useDispatch();
  const { items: customers } = useSelector((state) => state.customers);
  
  const [formData, setFormData] = useState({
    customerId: '',
    productName: '',
    price: '',
    quantity: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data:', formData);
    
    if (!formData.customerId) {
      alert('Veuillez sélectionner un client');
      return;
    }
    
    if (!formData.productName.trim()) {
      alert('Veuillez entrer un nom de produit');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      alert('Veuillez entrer une quantité valide');
      return;
    }
    
    try {
      const transaction = {
        productName: formData.productName,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };
      
      console.log('Dispatching transaction:', { customerId: formData.customerId, transaction });
      
      await dispatch(addTransaction({ 
        customerId: formData.customerId, 
        transaction 
      })).unwrap();
      
      // Reset form
      setFormData({
        customerId: '',
        productName: '',
        price: '',
        quantity: 1
      });
      
      alert('✅ Transaction ajoutée avec succès !');
      
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(`❌ Erreur: ${error.message || error}`);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3">🛒 Ajouter une Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Sélectionner un Client *</label>
          <select
            className="form-select"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Choisir un client...</option>
            {customers
              .filter(customer => customer.isActive !== false)
              .map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - Solde: ${customer.balance?.toFixed(2) || '0.00'}
                </option>
              ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Nom du Produit *</label>
          <input
            type="text"
            className="form-control"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            placeholder="Ex: Pain"
          />
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Prix unitaire *</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Ex: 5.50"
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Quantité *</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              step="1"
              placeholder="Ex: 2"
            />
          </div>
        </div>
        
        <button type="submit" className="btn btn-success">
          ➕ Ajouter la Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;