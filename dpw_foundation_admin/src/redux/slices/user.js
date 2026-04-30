import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user slice.
// It includes properties for authentication, user details, count, initialization status, and followed shops.
const initialState = {
  isAuthenticated: false, // Tracks whether the user is authenticated or not
  user: null, // Holds the user object once authenticated
  count: 0, // A generic counter, can be used for any logic requiring a counter
  isInitialized: false, // Indicates if the user state has been initialized
  followingShops: [] // List of shops that the user is following
};

// Slice definition for user-related state management
const slice = createSlice({
  name: 'user', // Name of the slice
  initialState, // Initial state for the slice

  reducers: {
    /**
     * Sets the user as logged in and updates the user details.
     * @param {Object} state - Current state of the user slice
     * @param {Object} action - The action containing the user data
     */
    setLogin(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    /**
     * Logs the user out by clearing the user details and setting authentication to false.
     * @param {Object} state - Current state of the user slice
     */
    setLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },

    /**
     * Increases the count value by 1.
     * @param {Object} state - Current state of the user slice
     */
    setCount(state) {
      state.count = state.count + 1;
    },

    /**
     * Marks the user state as initialized.
     * @param {Object} state - Current state of the user slice
     */
    setInitialize(state) {
      state.isInitialized = true;
    },

    /**
     * Updates the status of the user.
     * @param {Object} state - Current state of the user slice
     * @param {Object} action - The action containing the new status
     */
    updateStatus(state, action) {
      state.user.status = action.payload;
    },

    /**
     * Marks the user as verified.
     * @param {Object} state - Current state of the user slice
     */
    verifyUser(state) {
      state.user.isVerified = true;
    },

    /**
     * Updates the role of the user to 'vendor'.
     * @param {Object} state - Current state of the user slice
     */
    updateUserRole(state) {
      state.user.role = 'vendor';
    },

    /**
     * Updates the list of followed shops for the user.
     * Adds or removes a shop from the list of followed shops.
     * @param {Object} state - Current state of the user slice
     * @param {Object} action - The action containing the shop to be followed/unfollowed
     */
    updateFollowShop(state, action) {
      const filtered = state.followingShops.filter((v) => v === action.payload);
      if (filtered.length) {
        // Remove the shop if it is already in the followed shops list
        const removedShop = state.followingShops.filter((v) => v !== action.payload);
        state.followingShops = removedShop;
      } else {
        // Add the shop to the followed shops list if it is not already there
        state.followingShops = [...state.followingShops, action.payload];
      }
    }
  }
});

// Reducer export - responsible for updating the state based on the actions
export default slice.reducer;

// Action exports - These are the functions that can be dispatched to modify the state
export const {
  setLogin,
  setLogout,
  setCount,
  setInitialize,
  updateStatus,
  verifyUser,
  updateUserRole,
  updateFollowShop
} = slice.actions;
