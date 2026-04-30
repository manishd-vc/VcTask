'use client'; // Marks the file as a client-side component for Next.js

import { useRouter } from 'next-nprogress-bar'; // Custom hook for handling router events (likely a custom wrapper for Next.js router)
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; // Toast notifications
import { useSelector } from 'src/redux'; // Redux selector to access global state

// components
import Loading from 'src/components/loading'; // Loading component for displaying a loading state

export default function Guest({ children }) {
  const router = useRouter(); // Access the Next.js router object for navigation
  const [isVendor, setIsVendor] = useState(true); // State to track if the user is a vendor (for authorization)
  const { isAuthenticated } = useSelector(({ user }) => user); // Accessing authentication state from Redux

  useEffect(() => {
    // Check if the user is authenticated. If not, redirect to the homepage and show an error message
    if (!isAuthenticated) {
      setIsVendor(false); // Set vendor state to false if the user is not authenticated
      toast.error("You're not allowed to access dashboard"); // Show error toast message
      router.push('/'); // Redirect to homepage
    }
  }, [isAuthenticated, router]); // Depend on isAuthenticated and router to trigger effect

  // If the user is not a vendor (i.e., not authenticated), render a loading spinner
  if (!isVendor) {
    return <Loading />; // Return the Loading component until the user is redirected
  }

  return children; // If authenticated, render the children components passed to the Guest component
}

// Prop types validation for Guest component
Guest.propTypes = {
  children: PropTypes.node.isRequired // children: React nodes to be rendered inside the Guest component
};
