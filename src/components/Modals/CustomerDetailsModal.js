import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CustomerDetailsModal = ({ customer, onClose }) => {
  if (!customer) return null;

  const calculateTotalSpent = () => {
    return customer.transactions?.reduce((total, transaction) => {
      return total + (transaction.total || transaction.price * transaction.quantity);
    }, 0) || 0;
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-badge me-2"></i>
              Détails du Client: {customer.name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row mb-4">
              {/* Informations personnelles */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="mb-0">Informations Personnelles</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Nom:</strong> {customer.name}</p>
                    <p><strong>Téléphone:</strong> {customer.phone || '-'}</p>
                    <p><strong>Email:</strong> {customer.email || '-'}</p>
                    <p><strong>Adresse:</strong> {customer.address || '-'}</p>
                    <p><strong>Date d'inscription:</strong> {formatDate(customer.createdAt)}</p>
                    <p>
                      <strong>Statut:</strong> 
                      <span className={`badge ${customer.isActive ? 'bg-success' : 'bg-secondary'} ms-2`}>
                        {customer.isActive ? 'Actif' : 'Fermé'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations financières */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="mb-0">Informations Financières</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h3 className={`text-center ${customer.balance > 0 ? 'text-danger' : 'text-success'}`}>
                        {formatCurrency(customer.balance || 0)}
                      </h3>
                      <p className="text-center text-muted">Solde actuel</p>
                    </div>
                    <hr />
                    <p><strong>Total dépensé:</strong> {formatCurrency(calculateTotalSpent())}</p>
                    <p><strong>Dernier achat:</strong> {customer.lastPurchase ? formatDate(customer.lastPurchase) : '-'}</p>
                    <p><strong>Dernier paiement:</strong> {customer.lastPayment ? formatDate(customer.lastPayment) : '-'}</p>
                    <p><strong>Date réouverture:</strong> {customer.reopenedDate ? formatDate(customer.reopenedDate) : '-'}</p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="mb-0">Statistiques</h6>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <div className="display-6">{customer.transactions?.length || 0}</div>
                      <p className="text-muted mb-0">Transactions</p>
                    </div>
                    <hr />
                    <p><strong>Montant moyen par transaction:</strong> 
                      {customer.transactions?.length > 0 
                        ? formatCurrency(calculateTotalSpent() / customer.transactions.length)
                        : '0 €'}
                    </p>
                    <p><strong>Fréquence d'achat:</strong> 
                      {customer.createdAt ? 
                        Math.round((customer.transactions?.length || 0) / 
                          (Math.max(1, (new Date() - new Date(customer.createdAt)) / (1000 * 60 * 60 * 24 * 30)))) + ' / mois'
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historique des transactions */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  Historique des Transactions
                </h6>
              </div>
              <div className="card-body">
                {customer.transactions?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Produit</th>
                          <th>Prix unitaire</th>
                          <th>Quantité</th>
                          <th>Total</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td>{formatDate(transaction.date)}</td>
                            <td>{transaction.productName}</td>
                            <td>{formatCurrency(transaction.price)}</td>
                            <td>{transaction.quantity}</td>
                            <td className="fw-bold">
                              {formatCurrency(transaction.total || transaction.price * transaction.quantity)}
                            </td>
                            <td className="text-muted">
                              <small>{transaction.description || '-'}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                          <td colSpan="2" className="fw-bold">
                            {formatCurrency(calculateTotalSpent())}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-receipt text-muted display-4"></i>
                    <p className="mt-3 text-muted">Aucune transaction enregistrée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historique des paiements */}
            {customer.paymentHistory?.length > 0 && (
              <div className="card mt-3">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-cash-coin me-2"></i>
                    Historique des Paiements
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Montant</th>
                          <th>Type</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.paymentHistory.map((payment, index) => (
                          <tr key={index}>
                            <td>{formatDate(payment.date)}</td>
                            <td className="fw-bold">{formatCurrency(payment.amount)}</td>
                            <td>
                              <span className={`badge ${payment.type === 'full' ? 'bg-success' : 'bg-warning'}`}>
                                {payment.type === 'full' ? 'Complet' : 'Partiel'}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success">Payé</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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