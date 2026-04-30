'use client'; // Marking the component as client-side only for Next.js

import { useRouter } from 'next-nprogress-bar'; // Custom router hook, likely wraps Next.js router for navigation and progress bar handling
import PropTypes from 'prop-types'; // PropTypes for type validation on props
import { useEffect, useState } from 'react'; // React hooks for managing side effects and component state
import { useSelector } from 'src/redux'; // Redux selector to access global state (user authentication status)

// components
import Loading from 'src/components/loading'; // Loading component to show while redirecting or waiting for status

export default function Guest({ children }) {
  const router = useRouter(); // Access the Next.js router object to programmatically navigate
  const { isAuthenticated } = useSelector(({ user }) => user); // Retrieve the `isAuthenticated` state from Redux store
  const [isAuth, setIsAuth] = useState(true); // Local state to track whether the user is authorized

  useEffect(() => {
    // If the user is not authenticated, redirect them to the login page
    if (!isAuthenticated) {
      setIsAuth(false); // Update state to stop rendering the children and show the loading state
      router.push('/auth/login'); // Redirect the user to the login page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  // If the user is not authenticated and is being redirected, display the loading state
  if (!isAuth) {
    return <Loading />; // Show loading indicator during redirection
  }

  return children; // If authenticated, render the children components passed to the Guest component
}

// Define prop types for the Guest component
Guest.propTypes = {
  children: PropTypes.node.isRequired // `children` prop is required and must be a valid React node
};
