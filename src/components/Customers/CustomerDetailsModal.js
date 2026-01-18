import React from 'react';

const CustomerDetailsModal = ({ customer, onClose }) => {
  if (!customer) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const calculateTotalSpent = () => {
    if (!customer.purchases || customer.purchases.length === 0) return 0;
    return customer.purchases.reduce((total, purchase) => {
      return total + (purchase.price * purchase.quantity);
    }, 0);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📋 Détails du Client</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header bg-primary text-white">
                    <h6>👤 Informations Client</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Nom:</strong> {customer.name}</p>
                    <p><strong>Téléphone:</strong> {customer.phone || 'Non fourni'}</p>
                    <p><strong>Adresse:</strong> {customer.address || 'Non fournie'}</p>
                    <p><strong>Solde actuel:</strong> 
                      <span className={`badge ${customer.balance > 0 ? 'bg-danger' : 'bg-success'} ms-2`}>
                        {formatCurrency(customer.balance || 0)}
                      </span>
                    </p>
                    <p><strong>Statut:</strong> 
                      <span className={`badge ${customer.isActive !== false ? 'bg-success' : 'bg-secondary'} ms-2`}>
                        {customer.isActive !== false ? 'Actif' : 'Fermé'}
                      </span>
                    </p>
                    <p><strong>Date création:</strong> {formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header bg-success text-white">
                    <h6>📊 Statistiques</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Total dépensé:</strong> {formatCurrency(calculateTotalSpent())}</p>
                    <p><strong>Nombre d'achats:</strong> {customer.purchases?.length || 0}</p>
                    <p><strong>Dernier achat:</strong> {formatDate(customer.lastPurchaseDate)}</p>
                    <p><strong>Dernier paiement:</strong> {formatDate(customer.lastPaymentDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-info text-white">
                <h6>🛒 Historique des Achats</h6>
              </div>
              <div className="card-body">
                {customer.purchases && customer.purchases.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Prix unitaire</th>
                          <th>Quantité</th>
                          <th>Sous-total</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.purchases.map((purchase, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge bg-primary me-2">{index + 1}</span>
                              {purchase.productName}
                            </td>
                            <td>{formatCurrency(purchase.price)}</td>
                            <td>
                              <span className="badge bg-secondary">{purchase.quantity}</span>
                            </td>
                            <td className="fw-bold">
                              {formatCurrency(purchase.price * purchase.quantity)}
                            </td>
                            <td className="small">
                              {formatDate(purchase.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="table-dark">
                          <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                          <td colSpan="2" className="fw-bold">
                            {formatCurrency(calculateTotalSpent())}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    Aucun produit acheté pour le moment.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;