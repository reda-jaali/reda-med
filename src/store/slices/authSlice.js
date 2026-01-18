import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Tentative de connexion avec:', email);
      
      // Récupérer tous les utilisateurs
      const response = await api.get('/users');
      const users = response.data;
      
      // Chercher l'utilisateur par email et mot de passe
      const user = users.find(u => 
        u.email === email && u.password === password
      );
      
      if (!user) {
        return rejectWithValue('Email ou mot de passe incorrect');
      }
      
      // Créer un token (simulé pour json-server)
      const token = `jwt-token-${user.id}-${Date.now()}`;
      
      // Stocker dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));
      
      console.log('Connexion réussie pour:', user.email);
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Erreur de connexion au serveur'
      );
    }
  }
);
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Tentative d\'inscription:', userData);
      
      // Vérifier d'abord si l'email existe déjà
      const usersResponse = await api.get('/users');
      const existingUser = usersResponse.data.find(u => u.email === userData.email);
      
      if (existingUser) {
        return rejectWithValue('Cet email est déjà utilisé');
      }
      
      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'employe', // Rôle fixe
        createdAt: new Date().toISOString()
      };
      
      // POST vers json-server pour créer l'utilisateur dans db.json
      console.log('Envoi de l\'utilisateur à json-server...');
      const response = await api.post('/users', newUser);
      
      console.log('Utilisateur créé dans db.json:', response.data);
      
      return {
        message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        userEmail: userData.email
      };
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        'Erreur lors de l\'inscription'
      );
    }
  }
);
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success: false,
    registrationSuccess: false // Nouveau champ pour gérer l'inscription
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.registrationSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Register - IMPORTANT: ne pas connecter automatiquement
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.registrationSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false; // Ne pas connecter
        state.user = null; // Ne pas définir d'utilisateur
        state.token = null; // Ne pas définir de token
        state.success = true;
        state.registrationSuccess = true; // Marquer l'inscription comme réussie
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.registrationSuccess = false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.success = false;
      })
      
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      });
  }
});

export const { clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;