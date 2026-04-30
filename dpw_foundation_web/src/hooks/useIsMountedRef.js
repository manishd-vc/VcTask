import { useRef, useEffect } from 'react';

/**
 * Custom hook to track whether the component is mounted or not.
 * This hook prevents state updates on unmounted components to avoid memory leaks or errors.
 *
 * @returns {object} - The ref object `isMounted`, which indicates the component's mounted status.
 */
export default function useIsMountedRef() {
  const isMounted = useRef(true); // Initialize a ref to track the component's mounted status.

  useEffect(() => {
    // Cleanup function to set the ref value to `false` when the component is unmounted.
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array ensures the cleanup runs only on unmount.

  return isMounted; // Return the ref object holding the mounted status.
}
