import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../store/slices/customersSlice';
import CustomerForm from '../components/Customers/CustomerForm';

import CustomerList from '../components/Customers/CustomerList';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: customers, status } = useSelector((state) => state.customers);
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Calcul des statistiques
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.isActive !== false).length,
    totalBalance: customers.reduce((sum, customer) => sum + (customer.balance || 0), 0),
    pendingPayments: customers.filter(c => c.isActive && c.balance > 0).length,
    totalPurchases: customers.reduce((sum, customer) => sum + (customer.purchases?.length || 0), 0),
    closedAccounts: customers.filter(c => c.isActive === false).length
  };

  if (status === 'loading') {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des données clients...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2">🏪 Gestion d'Épicerie</h1>
          <p className="text-muted mb-0">
            Gérez vos clients, transactions et paiements en un seul endroit
          </p>
        </div>
        
      </div>

      {/* Cartes de statistiques */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-primary border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Clients Totaux</h6>
                  <h2 className="mb-0">{stats.totalCustomers}</h2>
                  <small className="text-muted">
                    {stats.activeCustomers} actifs • {stats.closedAccounts} fermés
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <span className="text-primary fs-4">👥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-success border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Solde Total</h6>
                  <h2 className="mb-0">{stats.totalBalance.toFixed(2)}DH</h2>
                  <small className="text-muted">
                    {stats.pendingPayments} paiements en attente
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <span className="text-success fs-4">💰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-info border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Transactions</h6>
                  <h2 className="mb-0">{stats.totalPurchases}</h2>
                  <small className="text-muted">
                    Achats totaux
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <span className="text-info fs-4">🛒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-warning border-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Fin du Mois</h6>
                  <h5 className="mb-0">{new Date().toLocaleDateString('fr-FR', { month: 'long' })}</h5>
                  <small className="text-muted">
                    Collectez les paiements
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <span className="text-warning fs-4">📅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="row">
        {/* Colonne gauche - Formulaires */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '20px' }}>
            <div className="accordion mb-4" id="accordionForms">
              <div className="accordion-item">
                
                <div id="collapseOne" className="accordion-collapse collapse show">
                  <div className="accordion-body p-0">
                    <CustomerForm />
                  </div>
                </div>
              </div>
              
              
            </div>
            
            {/* Aide rapide */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">💡 Comment utiliser</h6>
              </div>
              <div className="card-body">
                <ol className="list-unstyled mb-0">
                  <li className="mb-2">1. <strong>Cliquez sur un client</strong> pour gérer son compte</li>
                  <li className="mb-2">2. <strong>Ajoutez des transactions</strong> dans l'onglet dédié</li>
                  <li className="mb-2">3. <strong>Collectez les paiements</strong> quand le client paye</li>
                  <li>4. <strong>Réouvrez les comptes</strong> si le client revient</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite - Liste des clients */}
        <div className="col-lg-8">
          <CustomerList customers={customers} />
        </div>
      </div>

      {/* Pied de page */}
      <footer className="mt-5 pt-4 border-top">
        <div className="row">
          <div className="col-md-6">
            <h6>🏪 Système de Gestion d'Épicerie</h6>
            <p className="text-muted small">
            Version 1.0 • Développé avec Reda et Rachid
            </p>
          </div>
          <div className="col-md-6 text-end">
            <p className="small text-muted">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;