/**
 * Checks if the user has at least one of the required permissions.
 * @param {string[]} assignedFunctions - List of permissions assigned to the user.
 * @param {string[]} requiredPermissions - List of permissions required for a specific action.
 * @returns {boolean} True if the user has any of the required permissions, otherwise false.
 */
export const checkPermissions = (assignedFunctions, requiredPermissions) => {
  return requiredPermissions.some((permission) => assignedFunctions.includes(permission));
};
