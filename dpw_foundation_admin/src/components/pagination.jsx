import { useRouter } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// MUI
import { useTheme } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import TableStyle from './table/table.styles';

/**
 * PaginationRounded Component
 * A pagination component for displaying data with configurable rows per page and page navigation.
 *
 * @param {object} data - The data object containing the total count of items for pagination.
 * @param {object} data.count - The total number of items available for pagination.
 *
 * @returns {JSX.Element} The PaginationRounded component that renders pagination controls with URL synchronization.
 */
PaginationRounded.propTypes = {
  data: PropTypes.shape({
    count: PropTypes.number,
    totalElements: PropTypes.number // The total number of items to paginate
  })
};

/**
 * PaginationRounded Function
 * Handles pagination logic, including the synchronization of page and rowsPerPage with the URL parameters.
 *
 * It updates the URL query parameters when the user navigates between pages or changes the rows per page.
 */
export default function PaginationRounded({ data }) {
  // Access the theme for styling
  const theme = useTheme();
  const styles = TableStyle(theme); // Get styles based on the theme

  // Use Next.js hooks to handle routing and URL query parameters
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Set default page to 1 (MUI uses 0-based index)
  const initialPage = parseInt(searchParams.get('page') || '1', 10) - 1;
  const initialRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10);

  // State variables for pagination
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  /**
   * updateQueryParams Function
   * Updates the URL query parameters with the new page and rowsPerPage values.
   *
   * @param {number} newPage - The new page index (0-based).
   * @param {number} newRowsPerPage - The new number of rows per page.
   */
  const updateQueryParams = (newPage, newRowsPerPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage + 1); // Adjust for 1-based indexing in the URL
    params.set('rowsPerPage', newRowsPerPage); // Update the rowsPerPage parameter

    // Push the updated query string to the router without scrolling to top
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /**
   * handlePageChange Function
   * Handles the page change event by updating the page state and URL query parameters.
   *
   * @param {object} event - The event object.
   * @param {number} newPage - The new page index (0-based).
   */
  const handlePageChange = (event, newPage) => {
    setPage(newPage); // Update the page state
    updateQueryParams(newPage, rowsPerPage); // Update URL with new page
  };

  /**
   * handleRowsPerPageChange Function
   * Handles the rows per page change event by updating the rowsPerPage state and URL query parameters.
   *
   * @param {object} event - The event object.
   */
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage); // Update rowsPerPage state
    setPage(0); // Reset to the first page when rows per page changes
    updateQueryParams(0, newRowsPerPage); // Update URL with new rowsPerPage and page
  };

  // Synchronize state with URL parameters when they change
  useEffect(() => {
    setPage(initialPage);
    setRowsPerPage(initialRowsPerPage);
  }, [initialPage, initialRowsPerPage]);

  return (
    /**
     * TablePagination Component
     * Renders the pagination controls for the data table, including the page and rows per page controls.
     */
    <TablePagination
      component="div"
      count={data?.totalElements || 0} // Total number of items, default to 0 if not available
      page={page} // Current page index (0-based)
      onPageChange={handlePageChange} // Handle page change
      rowsPerPage={rowsPerPage} // Current number of rows per page
      onRowsPerPageChange={handleRowsPerPageChange} // Handle change in rows per page
      labelRowsPerPage="Rows per page" // Label for the rows per page dropdown
      rowsPerPageOptions={[5, 10, 20, 50, 100]} // Available options for rows per page
      sx={styles.paginationStyle} // Apply custom styles to the pagination
    />
  );
}
