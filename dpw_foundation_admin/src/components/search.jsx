'use client';
// react
import { useRouter } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// mui ui
import { InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SearchIcon } from './icons';

/**
 * Search Component
 * A custom search component that updates the search query in the URL and synchronizes with query parameters.
 * Includes a debounced search functionality, where the search term is added to the URL after a delay, and is cleared on tab change.
 *
 * @returns {JSX.Element} A search input field with dynamic URL query string updates.
 */
const SearchStyle = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    padding: '0 0.9375rem 0 1.5rem', // Adding padding for the input field
    zIndex: 1,
    '.MuiInputBase-input': {
      fontWeight: 300,
      '&::placeholder': { color: theme.palette.text.secondarydark } // Placeholder styling
    },
    '& fieldset': {
      borderRadius: '50em', // Rounded corners for the input field
      background: `
      linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
      linear-gradient(to right, ${theme.palette.common.black}, ${theme.palette.common.white}) border-box
    `,
      borderWidth: '0.0625rem',
      borderStyle: 'solid',
      borderColor: 'transparent',
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '4rem' // Custom height for the input field
    }
  }
}));

/**
 * Search component for handling user search queries and reflecting them in the URL as query parameters.
 * It syncs the search value with the URL and updates the search query dynamically.
 *
 * - Uses debouncing to avoid immediate URL updates.
 * - Resets search when the tab changes.
 */
export default function Search() {
  const router = useRouter(); // Next.js router for URL manipulation
  const pathname = usePathname(); // Get current path of the page
  const searchParams = useSearchParams(); // Access the search params from the URL

  // Retrieve initial search and tab from URL query params
  const usedSearch = searchParams.get('search');
  const tab = searchParams.get('tab');

  // State for managing the search input and initial state flag
  const [initial, setInitial] = useState(false);
  const [search, setSearch] = useState(usedSearch || '');

  // Ref to keep track of the last selected tab
  const lastTab = useRef(tab);

  /**
   * Handles the change in the search input field.
   * Updates the search state with the input value.
   *
   * @param {Object} e - Event object
   */
  const onChange = (e) => {
    const val = e.target.value;
    setSearch(val); // Set the new search value
  };

  /**
   * Creates a query string with updated search parameter.
   * Removes or updates the search query in the URL based on input value.
   *
   * @param {string} name - The name of the query parameter.
   * @param {string} value - The value of the query parameter.
   *
   * @returns {string} - The updated query string.
   */
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value); // Set the search parameter if there's a value
      } else {
        params.delete(name); // Remove the search parameter if it's empty
      }
      params.delete('page'); // Reset page parameter when search changes

      return params.toString();
    },
    [searchParams] // Recreate the query string whenever searchParams change
  );

  // Effect to clear search input and update the URL when the tab changes
  useEffect(() => {
    if (tab !== lastTab.current) {
      setSearch(''); // Clear the search input when the tab changes
      lastTab.current = tab; // Update the lastTab reference
      const cleanPathname = window.location.pathname.replace(/^\/dpwfadm/, '');
      if (tab) {
        router.push(`${cleanPathname}?tab=${tab}`, undefined, { shallow: true });
      } else {
        router.push(cleanPathname, undefined, { shallow: true });
      }
    }
  }, [tab, router]); // Dependency array ensures effect runs when `tab` or `router` changes

  // Effect to handle the debounced update of search query in the URL
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        setInitial(true); // Set initial state flag when search is not empty
        // Update the URL with the search query after debouncing
        router.push(`${pathname}?${createQueryString('search', search)}`, undefined, { shallow: true });
      } else if (initial) {
        // Remove search from the URL if input is empty
        router.push(`${pathname}?${createQueryString('search', '')}`, undefined, { shallow: true });
      }
    }, 1000); // Debounce delay of 1 second

    return () => clearTimeout(delayDebounceFn); // Cleanup on effect cleanup
  }, [search, createQueryString, pathname, initial, router]); // Dependencies for the effect

  return (
    <SearchStyle
      fullWidth
      value={search}
      onChange={onChange} // Attach the onChange handler to update search state
      variant="outlined"
      placeholder="Search here"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon /> {/* Add search icon inside the input field */}
          </InputAdornment>
        )
      }}
    />
  );
}
