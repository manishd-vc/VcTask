import { createSlice } from '@reduxjs/toolkit';

// Initial state for the roles slice.
// It manages access control and assigned roles for users.
const initialState = {
  accessControl: [], // List of access control items
  assignedRoles: [] // List of roles assigned to the user
};

// slice definition for managing roles-related state
const slice = createSlice({
  name: 'roles', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    /**
     * Sets the access control data in the state.
     * @param {Object} state - Current state of the roles slice
     * @param {Object} action - Action object containing the access control data
     * @param {Array} action.payload - Array of access control items
     */
    setAccessControl(state, action) {
      state.accessControl = action.payload;
    },

    /**
     * Sets the assigned roles data in the state.
     * @param {Object} state - Current state of the roles slice
     * @param {Object} action - Action object containing the assigned roles data
     * @param {Array} action.payload - Array of roles assigned to the user
     */
    setAssignedRoles(state, action) {
      state.assignedRoles = action.payload;
    }
  }
});

// Reducer export - Responsible for updating the state based on the actions
export default slice.reducer;

// Action exports - These are the functions that can be dispatched to modify the state
export const { setAccessControl, setAssignedRoles } = slice.actions;
