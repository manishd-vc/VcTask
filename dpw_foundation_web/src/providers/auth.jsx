import { useEffect } from 'react';

// redux
import { useDispatch, useSelector } from '../redux';
import { setLogout } from '../redux/slices/user';

// cookies
import { deleteCookies } from 'src/hooks/cookies';

export default function AuthProvider({ children }) {
  const dispatch = useDispatch(); // Redux dispatch function
  const { isAuthenticated } = useSelector(({ user }) => user); // Get authentication status from Redux store

  /**
   * Effect to handle user logout when not authenticated.
   * Deletes refreshToken and userToken cookies and dispatches logout action.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      deleteCookies('token');
      deleteCookies('userToken');
      deleteCookies('refreshToken');
      dispatch(setLogout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Effect runs when authentication status changes

  return children; // Render children components
}
