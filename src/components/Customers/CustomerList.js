import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import { processPayment, reopenAccount, deleteCustomer } from '../../store/slices/customersSlice';
import CustomerAccountView from './CustomerAccountView';

const CustomerList = ({ customers = [] }) => {
  const dispatch = useDispatch();
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAccountView, setShowAccountView] = useState(false);

  // ✅ ADD THESE THREE MISSING FUNCTIONS
  const handlePayment = (customer) => {
    if (window.confirm(`Collecter paiement de $${customer.balance?.toFixed(2)} pour ${customer.name}?`)) {
      dispatch(processPayment(customer.id));
    }
  };

  const handleReopenAccount = (customer) => {
    if (window.confirm(`Réouvrir le compte de ${customer.name}?`)) {
      dispatch(reopenAccount(customer.id));
    }
  };

  const handleDeleteAccount = (customer) => {
    if (window.confirm(`Supprimer définitivement le compte de ${customer.name}?`)) {
      dispatch(deleteCustomer(customer.id));
    }
  };

  const showCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowAccountView(true);
  };

  return (
    <div className="card p-5">
      <h3 className="mb-5">📋 Gestion des Comptes Clients</h3>
      
      <div className="d-flex justify-content-between align-items-center mb-5">
        
        <div className="small text-muted">
          {customers.length} client{customers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="alert alert-info">
          📝 Aucun client enregistré. Commencez par ajouter votre premier client.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>👤 Nom</th>
                <th>💰 Solde</th>
                <th>🔖 Statut</th>
                <th>🛒 Produits</th>
                <th>📅 Dernière activité</th>
                <th>⚡ Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className={customer.balance > 0 ? 'table-warning' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => showCustomerDetails(customer)}
                >
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <span className="text-primary">👤</span>
                      </div>
                      <div>
                        <strong>{customer.name}</strong>
                        {customer.phone && (
                          <div className="small text-muted">📞 {customer.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${customer.balance > 0 ? 'bg-danger' : 'bg-success'}`}>
                      ${customer.balance?.toFixed(2) || '0.00'}
                    </span>
                    {customer.balance > 0 && (
                      <div className="small text-danger mt-1">
                        ⚠️ En attente
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${customer.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {customer.isActive ? 'Actif' : 'Fermé'}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {customer.purchases?.length || 0} achat{customer.purchases?.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    {customer.lastPurchaseDate 
                      ? new Date(customer.lastPurchaseDate).toLocaleDateString('fr-FR')
                      : 'Jamais'
                    }
                  </td>
                  <td>
                    <div 
                      className="btn-group btn-group-sm" 
                      role="group" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn btn-outline-info"
                        onClick={() => showCustomerDetails(customer)}
                        title="Gérer le compte"
                      >
                        📋 Gérer
                      </button>
                      
                      {customer.isActive && customer.balance > 0 && (
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handlePayment(customer)}
                          title="Collecter paiement"
                        >
                          💰
                        </button>
                      )}
                      
                      {!customer.isActive && (
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleReopenAccount(customer)}
                          title="Réouvrir"
                        >
                          🔄
                        </button>
                      )}
                      
                      {customer.balance === 0 && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteAccount(customer)}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAccountView && selectedCustomer && (
        <CustomerAccountView
          customer={selectedCustomer}
          onClose={() => {
            setShowAccountView(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerList;