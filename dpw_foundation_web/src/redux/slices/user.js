import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  isAuthenticated: false, // Tracks authentication status
  user: null, // Stores user information
  count: 0, // Stores count value
  isInitialized: false, // Tracks if the user is initialized
  followingShops: [] // Stores list of shops the user is following
};

// slice
const slice = createSlice({
  name: 'user', // Slice name
  initialState, // Initial state of the user slice

  reducers: {
    /**
     * Sets the user as logged in and stores user data.
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing user data
     */
    setLogin(state, action) {
      state.user = action.payload; // Set user data
      state.isAuthenticated = true; // Mark user as authenticated
    },

    updateFirstLogin(state, action) {
      state.user.firstLogin = action.payload; // Update user's first login status
    },
    /**
     * Logs the user out by resetting state values.
     * @param {Object} state - Current state
     */
    setLogout(state) {
      state.user = null; // Reset user data
      state.isAuthenticated = false; // Mark user as logged out
    },

    /**
     * Increments the count value by 1.
     * @param {Object} state - Current state
     */
    setCount(state) {
      state.count = state.count + 1; // Increment count
    },

    /**
     * Sets the user as initialized.
     * @param {Object} state - Current state
     */
    setInitialize(state) {
      state.isInitialized = true; // Mark user as initialized
    },

    /**
     * Updates the user's status.
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing the new status
     */
    updateStatus(state, action) {
      state.user.status = action.payload; // Update user status
    },

    /**
     * Verifies the user by setting the 'isVerified' flag to true.
     * @param {Object} state - Current state
     */
    verifyUser(state) {
      state.user.isVerified = true; // Set user's verified status
    },

    /**
     * Updates the user's role to 'vendor'.
     * @param {Object} state - Current state
     */
    updateUserRole(state) {
      state.user.role = 'vendor'; // Set user role to 'vendor'
    },

    /**
     * Toggles the shop in the user's following list.
     * If the shop is already followed, removes it; if not, adds it.
     * @param {Object} state - Current state
     * @param {Object} action - Action object containing shop identifier
     */
    updateFollowShop(state, action) {
      const filtered = state.followingShops.filter((v) => v === action.payload);
      if (filtered.length) {
        const removedShop = state.followingShops.filter((v) => v !== action.payload);
        state.followingShops = removedShop; // Remove shop from following list
      } else {
        state.followingShops = [...state.followingShops, action.payload]; // Add shop to following list
      }
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setLogin,
  setLogout,
  setCount,
  setInitialize,
  updateStatus,
  verifyUser,
  updateFirstLogin,
  updateUserRole,
  updateFollowShop
} = slice.actions;
