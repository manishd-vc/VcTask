import React from 'react';
import LoginSkeleton from 'src/components/_main/skeletons/auth/login';

/**
 * Loading Component for Login Page
 *
 * This component is displayed while the login page content is being loaded. It renders a skeleton loading
 * component which acts as a placeholder UI, providing feedback to the user while the actual page content is fetched.
 *
 * @returns {JSX.Element} The rendered Loading component displaying the LoginSkeleton
 */
export default function Loading() {
  return <LoginSkeleton />;
}
