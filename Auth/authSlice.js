import { createSlice } from '@reduxjs/toolkit';

// Helper function to get the token from localStorage
const loadTokenFromLocalStorage = () => {
  try {
    const serializedToken = localStorage.getItem('token');
    return serializedToken ? JSON.parse(serializedToken) : null;
  } catch (err) {
    console.error('Error loading token from local storage', err);
    return null;
  }
};

// Helper function to save the token to localStorage
const saveTokenToLocalStorage = (token) => {
  try {
    const serializedToken = JSON.stringify(token);
    localStorage.setItem('token', serializedToken);
  } catch (err) {
    console.error('Error saving token to local storage', err);
  }
};

// Helper function to remove the token from localStorage
const clearTokenFromLocalStorage = () => {
  try {
    localStorage.removeItem('token');
  } catch (err) {
    console.error('Error clearing token from local storage', err);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: loadTokenFromLocalStorage(), // Load token from localStorage during initialization
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveTokenToLocalStorage(action.payload); // Save the token to localStorage
    },
    clearToken: (state) => {
      state.token = null;
      clearTokenFromLocalStorage(); // Clear the token from localStorage
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
