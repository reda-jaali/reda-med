import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, processPayment, reopenAccount } from '../../store/slices/customersSlice';

const CustomerAccountView = ({ customer, onClose }) => {
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [transactionForm, setTransactionForm] = useState({
    productName: '',
    price: '',
    quantity: 1
  });
  const [paymentAmount, setPaymentAmount] = useState('');

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

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    if (!transactionForm.productName || !transactionForm.price || !transactionForm.quantity) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const transactionData = {
        productName: transactionForm.productName,
        price: parseFloat(transactionForm.price),
        quantity: parseInt(transactionForm.quantity)
      };

      await dispatch(addTransaction({
        customerId: customer.id,
        transaction: transactionData
      })).unwrap();

      // Reset form
      setTransactionForm({
        productName: '',
        price: '',
        quantity: 1
      });

      alert('✅ Transaction ajoutée avec succès !');
      setActiveTab('transactions');
    } catch (error) {
      alert(`❌ Erreur: ${error}`);
    }
  };

  const handleProcessPayment = async (amount) => {
    if (!amount || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (amount > customer.balance) {
      alert('Le montant ne peut pas dépasser le solde');
      return;
    }

    if (window.confirm(`Confirmer le paiement de ${formatCurrency(amount)} pour ${customer.name} ?`)) {
      try {
        await dispatch(processPayment(customer.id)).unwrap();
        setPaymentAmount('');
        alert('✅ Paiement traité avec succès !');
        onClose(); // Fermer la vue après paiement
      } catch (error) {
        alert(`❌ Erreur: ${error}`);
      }
    }
  };

  const handleReopenAccount = async () => {
    if (window.confirm(`Réouvrir le compte de ${customer.name} ?`)) {
      try {
        await dispatch(reopenAccount(customer.id)).unwrap();
        alert('✅ Compte réouvert avec succès !');
        onClose(); // Fermer la vue
      } catch (error) {
        alert(`❌ Erreur: ${error}`);
      }
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <span className="me-2">👤</span>
              <strong>{customer.name}</strong>
              <span className={`badge ${customer.isActive ? 'bg-success' : 'bg-secondary'} ms-2`}>
                {customer.isActive ? 'Actif' : 'Fermé'}
              </span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* En-tête avec informations principales */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 border-end">
                        <h6 className="text-muted">Solde Actuel</h6>
                        <h3 className={`fw-bold ${customer.balance > 0 ? 'text-danger' : 'text-success'}`}>
                          {formatCurrency(customer.balance || 0)}
                        </h3>
                      </div>
                      <div className="col-md-4 border-end">
                        <h6 className="text-muted">Total Dépensé </h6>
                        <h3 className="fw-bold text-primary">
                          {formatCurrency(calculateTotalSpent())}
                        </h3>
                      </div>
                      <div className="col-md-4">
                        <h6 className="text-muted">Transactions</h6>
                        <h3 className="fw-bold">
                          {customer.purchases?.length || 0}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      {customer.isActive && customer.balance > 0 && (
                        <button
                          className="btn btn-warning"
                          onClick={() => setActiveTab('payment')}
                        >
                          💰 Collecter Paiement
                        </button>
                      )}
                      
                      {customer.isActive && (
                        <button
                          className="btn btn-success"
                          onClick={() => setActiveTab('add-transaction')}
                        >
                          ➕ Ajouter Transaction
                        </button>
                      )}
                      
                      {!customer.isActive && (
                        <button
                          className="btn btn-primary"
                          onClick={handleReopenAccount}
                        >
                          🔄 Réouvrir Compte
                        </button>
                      )}
                      
                      <button
                        className="btn btn-info"
                        onClick={() => setActiveTab('info')}
                      >
                        ℹ️ Informations
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets de navigation */}
            <nav className="nav nav-tabs mb-4">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📊 Aperçu
              </button>
              <button
                className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                🛒 Transactions ({customer.purchases?.length || 0})
              </button>
              <button
                className={`nav-link ${activeTab === 'add-transaction' ? 'active' : ''}`}
                onClick={() => setActiveTab('add-transaction')}
              >
                ➕ Ajouter Transaction
              </button>
              <button
                className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
              >
                💰 Paiement
              </button>
              <button
                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                ℹ️ Informations
              </button>
            </nav>

            {/* Contenu des onglets */}
            <div className="tab-content">
              {/* Onglet Aperçu */}
              {activeTab === 'overview' && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">📈 Statistiques</h6>
                      </div>
                      <div className="card-body">
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <strong>Dernière transaction:</strong> 
                            <span className="float-end">
                              {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : 'Aucune'}
                            </span>
                          </li>
                          <li className="mb-2">
                            <strong>Dernier paiement:</strong>
                            <span className="float-end">
                              {customer.lastPaymentDate ? formatDate(customer.lastPaymentDate) : 'Aucun'}
                            </span>
                          </li>
                          <li className="mb-2">
                            <strong>Date d'inscription:</strong>
                            <span className="float-end">{formatDate(customer.createdAt)}</span>
                          </li>
                          <li>
                            <strong>État du compte:</strong>
                            <span className="float-end">
                              <span className={`badge ${customer.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {customer.isActive ? 'Actif' : 'Fermé'}
                              </span>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">🏆 Dernières Transactions</h6>
                      </div>
                      <div className="card-body">
                        {customer.purchases && customer.purchases.length > 0 ? (
                          <div className="list-group">
                            {customer.purchases.slice(-3).reverse().map((purchase, index) => (
                              <div key={index} className="list-group-item border-0">
                                <div className="d-flex w-100 justify-content-between">
                                  <h6 className="mb-1">{purchase.productName}</h6>
                                  <small>{formatDate(purchase.date)}</small>
                                </div>
                                <p className="mb-1">
                                  {purchase.quantity} × {formatCurrency(purchase.price)} = 
                                  <strong> {formatCurrency(purchase.price * purchase.quantity)}</strong>
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <p className="text-muted">Aucune transaction</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Transactions */}
              {activeTab === 'transactions' && (
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">📋 Historique des Transactions</h6>
                  </div>
                  <div className="card-body">
                    {customer.purchases && customer.purchases.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Produit</th>
                              <th>Prix unitaire</th>
                              <th>Quantité</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.purchases.map((purchase, index) => (
                              <tr key={index}>
                                <td>{formatDate(purchase.date)}</td>
                                <td>
                                  <strong>{purchase.productName}</strong>
                                </td>
                                <td>{formatCurrency(purchase.price)}</td>
                                <td>
                                  <span className="badge bg-secondary">{purchase.quantity}</span>
                                </td>
                                <td className="fw-bold">
                                  {formatCurrency(purchase.price * purchase.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-light">
                            <tr>
                              <td colSpan="4" className="text-end">
                                <strong>Total dépensé:</strong>
                              </td>
                              <td className="fw-bold">
                                {formatCurrency(calculateTotalSpent())}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div className="mb-3">
                          <span className="display-1">🛒</span>
                        </div>
                        <h5>Aucune transaction</h5>
                        <p className="text-muted">
                          Ce client n'a pas encore fait d'achat
                        </p>
                        <button
                          className="btn btn-success"
                          onClick={() => setActiveTab('add-transaction')}
                        >
                          ➕ Ajouter une transaction
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Onglet Ajouter Transaction */}
              {activeTab === 'add-transaction' && (
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">➕ Nouvelle Transaction</h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleAddTransaction}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nom du produit *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={transactionForm.productName}
                            onChange={(e) => setTransactionForm({
                              ...transactionForm,
                              productName: e.target.value
                            })}
                            required
                            placeholder="Ex: Pain complet"
                          />
                        </div>
                        
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Prix unitaire *</label>
                          <div className="input-group">
                            <span className="input-group-text">€</span>
                            <input
                              type="number"
                              className="form-control"
                              value={transactionForm.price}
                              onChange={(e) => setTransactionForm({
                                ...transactionForm,
                                price: e.target.value
                              })}
                              required
                              min="0.01"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        
                        <div className="col-md-3 mb-3">
                          <label className="form-label">Quantité *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={transactionForm.quantity}
                            onChange={(e) => setTransactionForm({
                              ...transactionForm,
                              quantity: e.target.value
                            })}
                            required
                            min="1"
                            step="1"
                            placeholder="1"
                          />
                        </div>
                      </div>
                      
                      <div className="alert alert-info">
                        <div className="d-flex justify-content-between">
                          <span>Nouveau solde après transaction:</span>
                          <strong className="fs-5">
                            {formatCurrency(
                              (customer.balance || 0) + 
                              (parseFloat(transactionForm.price) || 0) * (parseInt(transactionForm.quantity) || 0)
                            )}
                          </strong>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setActiveTab('overview')}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success"
                        >
                          ➕ Ajouter la transaction
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Onglet Paiement */}
              {activeTab === 'payment' && (
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">💰 Collecter le Paiement</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-body">
                            <h5 className="card-title">Solde à régler</h5>
                            <h1 className="display-4 text-danger">
                              {formatCurrency(customer.balance || 0)}
                            </h1>
                            <p className="text-muted">
                              {customer.purchases?.length || 0} transactions impayées
                            </p>
                          </div>
                        </div>
                        
                        <div className="card">
                          <div className="card-body">
                            <h6>Paiement partiel</h6>
                            <div className="input-group mb-3">
                              <span className="input-group-text">DH</span>
                              <input
                                type="number"
                                className="form-control"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                min="0"
                                max={customer.balance || 0}
                                step="0.01"
                                placeholder="Montant à payer"
                              />
                              <button
                                className="btn btn-warning"
                                onClick={() => handleProcessPayment(parseFloat(paymentAmount))}
                                disabled={!paymentAmount || paymentAmount <= 0}
                              >
                                Payer
                              </button>
                            </div>
                            <small className="text-muted">
                              Entrez un montant inférieur au solde pour un paiement partiel
                            </small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">Paiement complet</h5>
                            <p className="card-text">
                              Le paiement complet fermera automatiquement le compte de ce client.
                            </p>
                            
                            <div className="alert alert-warning">
                              <strong>⚠️ Attention</strong>
                              <p className="mb-0 mt-2">
                                Après le paiement complet, le compte sera marqué comme "Fermé".
                                Vous pourrez le réouvrir ultérieurement si le client revient.
                              </p>
                            </div>
                            
                            <div className="d-grid">
                              <button
                                className="btn btn-success btn-lg"
                                onClick={() => handleProcessPayment(customer.balance || 0)}
                              >
                                💰 Payer {formatCurrency(customer.balance || 0)} (Complet)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Informations */}
              {activeTab === 'info' && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">👤 Informations Personnelles</h6>
                      </div>
                      <div className="card-body">
                        <dl className="row">
                          <dt className="col-sm-4">Nom complet</dt>
                          <dd className="col-sm-8"><strong>{customer.name}</strong></dd>
                          
                          <dt className="col-sm-4">Téléphone</dt>
                          <dd className="col-sm-8">{customer.phone || '-'}</dd>
                          
                          <dt className="col-sm-4">Email</dt>
                          <dd className="col-sm-8">{customer.email || '-'}</dd>
                          
                          <dt className="col-sm-4">Adresse</dt>
                          <dd className="col-sm-8">{customer.address || '-'}</dd>
                          
                          <dt className="col-sm-4">Date d'inscription</dt>
                          <dd className="col-sm-8">{formatDate(customer.createdAt)}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">📊 Résumé du Compte</h6>
                      </div>
                      <div className="card-body">
                        <div className="list-group">
                          <div className="list-group-item border-0">
                            <div className="d-flex w-100 justify-content-between">
                              <span>Solde actuel</span>
                              <strong className={customer.balance > 0 ? 'text-danger' : 'text-success'}>
                                {formatCurrency(customer.balance || 0)}
                              </strong>
                            </div>
                          </div>
                          
                          <div className="list-group-item border-0">
                            <div className="d-flex w-100 justify-content-between">
                              <span>Total dépensé</span>
                              <strong>{formatCurrency(calculateTotalSpent())}</strong>
                            </div>
                          </div>
                          
                          <div className="list-group-item border-0">
                            <div className="d-flex w-100 justify-content-between">
                              <span>Nombre de transactions</span>
                              <strong>{customer.purchases?.length || 0}</strong>
                            </div>
                          </div>
                          
                          <div className="list-group-item border-0">
                            <div className="d-flex w-100 justify-content-between">
                              <span>Dernière activité</span>
                              <span>
                                {customer.lastPurchaseDate 
                                  ? formatDate(customer.lastPurchaseDate)
                                  : 'Aucune'
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="list-group-item border-0">
                            <div className="d-flex w-100 justify-content-between">
                              <span>Statut du compte</span>
                              <span className={`badge ${customer.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {customer.isActive ? 'Actif' : 'Fermé'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <div>
                <span className="text-muted">
                  Client ID: {customer.id} | 
                  Créé le: {formatDate(customer.createdAt)}
                </span>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => setActiveTab('overview')}
                >
                  Retour à l'aperçu
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccountView;