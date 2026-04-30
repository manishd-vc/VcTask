import { FormHelperText, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * FieldWithSkeleton Component
 *
 * This component renders a loading skeleton while data is being fetched and displays
 * a form field with an error message if applicable. It helps provide a smooth user
 * experience when loading data for form fields.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Indicates if the content is loading and should show a skeleton.
 * @param {React.ReactNode} props.children - The form field or content to render when not loading.
 * @param {string} [props.error] - The error message to display, if any.
 *
 * @returns {JSX.Element} The rendered component with a skeleton or content based on loading state.
 */

const FieldWithSkeleton = React.memo(
  ({ isLoading, children, error }) => (
    <div>
      {/* Conditionally render Skeleton or children based on loading state */}
      {isLoading ? <Skeleton variant="rectangular" width="100%" height={56} /> : children}

      {/* Display error message if there's an error */}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  ),

  // Memoization comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.error === nextProps.error &&
      prevProps.children === nextProps.children
    );
  }
);

FieldWithSkeleton.propTypes = {
  // 'isLoading' is a boolean indicating whether to show the skeleton loader
  isLoading: PropTypes.bool.isRequired,

  // 'children' represents the rendered content inside the field
  children: PropTypes.node.isRequired,

  // 'error' is an optional boolean to indicate if there is an error
  error: PropTypes.bool
};

export default FieldWithSkeleton;
