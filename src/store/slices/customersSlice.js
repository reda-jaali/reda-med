import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// === ÉTAT INITIAL ===
const initialState = {
  items: [],
  filteredItems: [],
  filters: {
    status: 'all',
    search: ''
  },
  status: 'idle',
  error: null,
  selectedCustomer: null
};

// === ACTIONS ===
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      // Vérifier les doublons
      const allCustomers = await axios.get(`${API_URL}/customers`);
      const exists = allCustomers.data.find(
        c => c.name.toLowerCase() === customerData.name.toLowerCase()
      );
      
      if (exists) {
        return rejectWithValue('Ce client existe déjà');
      }
      
      const newCustomer = {
        ...customerData,
        id: Date.now(),
        balance: 0,
        isActive: true,
        purchases: [],
        createdAt: new Date().toISOString()
      };
      
      const response = await axios.post(`${API_URL}/customers`, newCustomer);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'customers/addTransaction',
  async ({ customerId, transaction }, { rejectWithValue }) => {
    try {
      console.log('Ajout transaction:', { customerId, transaction });
      
      // Récupérer le client
      const customerRes = await axios.get(`${API_URL}/customers/${customerId}`);
      const customer = customerRes.data;
      
      // Calculer le total
      const totalPrice = transaction.price * transaction.quantity;
      
      // Créer la transaction
      const newTransaction = {
        ...transaction,
        id: Date.now(),
        date: new Date().toISOString()
      };
      
      // Mettre à jour le client
      const updatedCustomer = {
        ...customer,
        balance: (customer.balance || 0) + totalPrice,
        purchases: [...(customer.purchases || []), newTransaction],
        lastPurchaseDate: new Date().toISOString()
      };
      
      // Sauvegarder
      const response = await axios.patch(
        `${API_URL}/customers/${customerId}`,
        updatedCustomer
      );
      
      return response.data;
    } catch (error) {
      console.error('Erreur transaction:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const processPayment = createAsyncThunk(
  'customers/processPayment',
  async (customerId, { rejectWithValue }) => {
    try {
      // Récupérer le client
      const customerRes = await axios.get(`${API_URL}/customers/${customerId}`);
      const customer = customerRes.data;
      
      // Mettre à jour pour paiement complet
      const updatedCustomer = {
        ...customer,
        balance: 0,
        isActive: false,
        lastPaymentDate: new Date().toISOString(),
        status: 'closed'
      };
      
      const response = await axios.patch(
        `${API_URL}/customers/${customerId}`,
        updatedCustomer
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reopenAccount = createAsyncThunk(
  'customers/reopenAccount',
  async (customerId, { rejectWithValue }) => {
    try {
      const customerRes = await axios.get(`${API_URL}/customers/${customerId}`);
      const customer = customerRes.data;
      
      const updatedCustomer = {
        ...customer,
        isActive: true,
        status: 'active',
        reopenedDate: new Date().toISOString()
      };
      
      const response = await axios.patch(
        `${API_URL}/customers/${customerId}`,
        updatedCustomer
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      // Vérifier si le client a un solde
      const customerRes = await axios.get(`${API_URL}/customers/${customerId}`);
      const customer = customerRes.data;
      
      if (customer.balance > 0) {
        return rejectWithValue('Impossible de supprimer un client avec un solde impayé');
      }
      
      await axios.delete(`${API_URL}/customers/${customerId}`);
      return customerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// === SLICE ===
const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCustomers
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // createCustomer
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // addTransaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // processPayment
      .addCase(processPayment.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // reopenAccount
      .addCase(reopenAccount.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(reopenAccount.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // deleteCustomer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Exporter les actions synchrones
export const { setSearchFilter, setStatusFilter, clearError } = customersSlice.actions;

// Exporter le reducer par défaut
export default customersSlice.reducer;