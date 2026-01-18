import React, { useState } from 'react';

const PaymentModal = ({ customer, onClose, onConfirm }) => {
  const [paymentAmount, setPaymentAmount] = useState(customer.balance || 0);
  const [paymentType, setPaymentType] = useState('full');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(paymentAmount, paymentType);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">💵 Collecter Paiement</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <p>
                  Collecter le paiement de <strong>{customer.name}</strong>
                </p>
                <p>Solde total: <span className="fw-bold">${customer.balance?.toFixed(2) || '0.00'}</span></p>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Type de paiement</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentType"
                    id="fullPayment"
                    value="full"
                    checked={paymentType === 'full'}
                    onChange={() => {
                      setPaymentType('full');
                      setPaymentAmount(customer.balance || 0);
                    }}
                  />
                  <label className="form-check-label" htmlFor="fullPayment">
                    Paiement complet (${customer.balance?.toFixed(2) || '0.00'})
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentType"
                    id="partialPayment"
                    value="partial"
                    checked={paymentType === 'partial'}
                    onChange={() => setPaymentType('partial')}
                  />
                  <label className="form-check-label" htmlFor="partialPayment">
                    Paiement partiel
                  </label>
                </div>
              </div>
              
              {paymentType === 'partial' && (
                <div className="mb-3">
                  <label className="form-label">Montant du paiement</label>
                  <input
                    type="number"
                    className="form-control"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    min="0"
                    max={customer.balance || 0}
                    step="0.01"
                    required
                  />
                  <div className="form-text">
                    Montant maximum: ${customer.balance?.toFixed(2) || '0.00'}
                  </div>
                </div>
              )}
              
              <div className="alert alert-info">
                {paymentType === 'full' 
                  ? "Cela fermera le compte du client pour ce mois."
                  : "Le compte restera actif avec le solde restant."}
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Confirmer Paiement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;