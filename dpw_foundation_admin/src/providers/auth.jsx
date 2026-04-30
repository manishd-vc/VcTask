import { useEffect } from 'react';

// redux
import { useDispatch, useSelector } from '../redux';
import { setLogout } from '../redux/slices/user';

// cookies
import { deleteCookies } from 'src/hooks/cookies';

/**
 * AuthProvider component that ensures the user is logged out if authentication status changes.
 * It clears the authentication token from cookies and updates the Redux store.
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components that will be rendered within the provider.
 * @returns {React.ReactNode} - The child components passed to the provider.
 */
export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  // Get the authentication status from Redux store
  const { isAuthenticated } = useSelector(({ user }) => user);

  useEffect(() => {
    // If the user is not authenticated, log them out
    if (!isAuthenticated) {
      deleteCookies('token'); // Remove the token cookie
      dispatch(setLogout()); // Dispatch logout action in Redux
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return children; // Render the child components
}
