'use client'; // Marks the file as a client-side component for Next.js

import { useRouter } from 'next-nprogress-bar'; // Custom hook for handling router events (likely a custom wrapper for Next.js router)
import PropTypes from 'prop-types'; // PropTypes for runtime type checking
import { useEffect, useState } from 'react'; // React hooks for component side effects and state management
import { useSelector } from 'src/redux'; // Redux selector to access global state

// components
import Loading from 'src/components/loading'; // Loading component to display during redirection
import { getToken } from 'src/hooks/cookies';

// Prop types validation for Guest component
Guest.propTypes = {
  children: PropTypes.node.isRequired // children: React nodes to be rendered inside the Guest component
};

export default function Guest({ children }) {
  const router = useRouter(); // Access the Next.js router object for navigation
  const { isAuthenticated } = useSelector(({ user }) => user); // Accessing authentication state from Redux
  const [isAuth, setIsAuth] = useState(true); // State to track if the user is authorized (to conditionally render content)

  useEffect(() => {
    // If the user is authenticated, redirect them to the homepage
    const checkData = async () => {
      const result = await getToken('refreshToken');
      if (isAuthenticated && result) {
        setIsAuth(false);
        router.push('/');
      }
    };
    checkData();
  }, [isAuthenticated, router]); // Depend on isAuthenticated and router to trigger the effect on changes

  // If the user is authenticated (and thus redirected), show a loading state while redirecting
  if (!isAuth) {
    return <Loading />; // Return the Loading component while the redirection is happening
  }

  return children; // If the user is not authenticated, render the children components passed to the Guest component
}
