/**
 * Constructs a full URL path by combining a root and a sublink.
 * @param {string} root - The root of the URL.
 * @param {string} sublink - The sublink to be appended to the root.
 * @returns {string} The full URL path.
 */
function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_PAGE = '/';

export const PATH_PAGE = {
  root: ROOTS_PAGE,
  auth: {
    /**
     * Full URL path for the login page.
     */
    login: path(ROOTS_PAGE, 'auth/login'),

    /**
     * Full URL path for the registration page.
     */
    register: path(ROOTS_PAGE, 'auth/register'),

    /**
     * Full URL path for the forget password page.
     */
    forgetPassword: path(ROOTS_PAGE, 'auth/forget-password'),

    /**
     * Full URL path for the forget password page.
     */
    activateAccount: path(ROOTS_PAGE, 'auth/activate-account'),

    /**
     * Full URL path for the forget password page.
     */
    makeDonation: path(ROOTS_PAGE, 'auth/make-donation'),

    /**
     * Full URL path for the reset password page.
     */
    resetPassword: path(ROOTS_PAGE, 'auth/reset-password')
  },
  general: {
    /**
     * Full URL path for the user profile page.
     */
    userProfile: path(ROOTS_PAGE, 'profile')
  }
};
