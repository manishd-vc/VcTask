import { useRef, useEffect } from 'react';

/**
 * Custom hook to track whether a component is currently mounted.
 * Useful for avoiding state updates on unmounted components.
 *
 * @returns {Object} - A React ref object with the current mounted state:
 *                     - `true`: The component is mounted.
 *                     - `false`: The component is unmounted.
 */
export default function useIsMountedRef() {
  // Ref to store the mounted state of the component
  const isMounted = useRef(true);

  useEffect(
    () => {
      // Cleanup function to set the ref to false when the component unmounts
      return () => {
        isMounted.current = false;
      };
    },
    [] // Empty dependency array ensures this runs only on mount and unmount
  );

  return isMounted;
}
