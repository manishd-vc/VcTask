'use client'; // Indicates that this component should only run on the client-side

import { useRouter } from 'next-nprogress-bar'; // Custom router hook, likely wraps Next.js router to handle navigation and progress bar
import PropTypes from 'prop-types'; // PropTypes for type validation of props
import { useEffect, useState } from 'react'; // React hooks for managing side effects and component state
import { toast } from 'react-hot-toast'; // To show toast notifications

// redux
import { useSelector } from 'src/redux'; // Access the global Redux state

// components
import Loading from 'src/components/loading'; // Loading component to show while redirecting or checking permissions

export default function Guest({ children }) {
  const router = useRouter(); // Access the Next.js router object for navigation
  const [isAdmin, setIsAdmin] = useState(true); // Local state to track if the user has admin privileges
  const { isAuthenticated, user } = useSelector(({ user }) => user); // Access the `isAuthenticated` and `user` state from Redux

  useEffect(() => {
    // If the user is not authenticated or not an admin/super admin, redirect to login page
    if (!isAuthenticated || !(user.role === 'super admin' || user.role === 'admin')) {
      setIsAdmin(false); // Update state to stop rendering the children and show the loading state
      toast.error("You're not allowed to access dashboard"); // Show an error toast message
      router.push('/auth/login'); // Redirect the user to the login page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect only runs once after the initial render

  // If the user is not an admin, show the loading state while redirecting
  if (!isAdmin) {
    return <Loading />; // Show loading indicator during redirection
  }

  // If the user is authenticated and has the correct role, render the children
  return children;
}

Guest.propTypes = {
  children: PropTypes.node.isRequired // `children` prop is required and must be a valid React node
};
