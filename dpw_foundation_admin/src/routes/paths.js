/**
 * Constructs a full path by combining the root and sublink.
 *
 * @param {string} root - The root part of the URL.
 * @param {string} sublink - The subpath to be appended to the root.
 * @returns {string} - The combined full path.
 */
function path(root, sublink) {
  return `${root}${sublink}`;
}

// The root URL for the application
const ROOTS_PAGE = '/';

// Path constants for different pages in the application
export const PATH_PAGE = {
  root: ROOTS_PAGE, // Root path of the application
  auth: {
    /**
     * Path for the login page
     */
    login: path(ROOTS_PAGE, 'auth/login'),

    /**
     * Path for the registration page
     */
    register: path(ROOTS_PAGE, 'auth/register'),

    /**
     * Path for the forgot password page
     */
    forgetPassword: path(ROOTS_PAGE, 'auth/forget-password'),

    /**
     * Path for the reset password page
     */
    resetPassword: path(ROOTS_PAGE, 'auth/reset-password')
  },
  general: {
    /**
     * Path for the user profile page
     */
    userProfile: path(ROOTS_PAGE, 'profile')
  }
};
