import React, { useState } from 'react';
import PropTypes from 'prop-types';

// mui
import { Stack, Button, Zoom, Skeleton } from '@mui/material';

// icons
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';

/**
 * SizePreview Component
 * A custom component to display a list of size options with pagination and selection functionality.
 * It supports displaying size buttons with a loading skeleton, and controls for navigating through the available sizes.
 *
 * @param {object} props - The component props.
 * @param {Array} props.sizes - The list of available sizes to display.
 * @param {number} props.size - The index of the currently selected size.
 * @param {Function} props.setSize - A function to update the selected size.
 * @param {boolean} props.isDetail - A flag to determine if the component is in a detail view or not.
 * @param {boolean} props.loading - A flag to indicate if the component is loading, showing skeleton loaders in place of actual content.
 *
 * @returns {JSX.Element} A component that displays size options with pagination, size selection, and loading skeletons.
 */
SizePreview.propTypes = {
  sizes: PropTypes.array.isRequired, // The list of sizes to display
  size: PropTypes.number.isRequired, // The currently selected size index
  setSize: PropTypes.func.isRequired, // Function to update the selected size
  isDetail: PropTypes.bool.isRequired, // Flag to determine if detail view is enabled
  loading: PropTypes.bool.isRequired // Flag to indicate if the component is in a loading state
};

/**
 * SizePreview component for rendering available sizes and pagination controls.
 * Handles pagination logic to display sizes in chunks, with support for a loading state.
 */
export default function SizePreview({ sizes, size, setSize, isDetail, loading }) {
  // State to manage the current page of size options (pagination)
  const [sizeCount, setSizeCount] = useState(0);

  return (
    <Stack
      direction="row"
      alignItems={'center'}
      sx={{
        button: {
          mr: 0.5 // Margin for button to separate arrows and sizes
        }
      }}
    >
      {/* Check if not in detail mode and if there are more than 6 sizes to paginate */}
      {!isDetail && sizes?.length > 6 && (
        <Zoom in={sizeCount > 0}>
          {' '}
          {/* Show the "Previous" button when on a subsequent page */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              if (sizeCount > 0) {
                setSizeCount(sizeCount - 1); // Decrease the page number
              }
            }}
            sx={{
              minHeight: 24,
              minWidth: 25,
              height: '24px !important',
              p: 0.2,
              color: 'text.primary !important',
              display: sizeCount === 0 && 'none', // Hide if on the first page
              borderWidth: 0
            }}
            disabled={sizeCount === 0} // Disable the button if on the first page
          >
            <MdKeyboardDoubleArrowLeft size={20} /> {/* Icon for the "Previous" button */}
          </Button>
        </Zoom>
      )}

      {/* Display size options, either as Skeleton loaders or actual size buttons */}
      {loading
        ? Array.from(new Array(4)) // Show 4 skeleton loaders when loading
        : sizes?.slice(sizeCount * 6, 6 * (sizeCount + 1)).map((v, i) => (
            <React.Fragment key={`data-index_${new Date().getTime()}`}>
              {' '}
              {/* Use the index as a stable key */}
              {loading ? (
                <Skeleton variant="rounded" width={25} height={24} sx={{ mr: 0.5 }} />
              ) : (
                <Button
                  size="small"
                  variant={size === i ? 'contained' : 'outlined'}
                  color={size === i ? 'primary' : 'inherit'}
                  onClick={() => setSize(i)} // Set the selected size when clicked
                  sx={{
                    minHeight: 24,
                    minWidth: 25,
                    height: '24px !important',
                    px: 0.6,
                    py: 0.2,
                    textTransform: 'uppercase',
                    fontSize: size === i ? 14 : 12,
                    borderWidth: 0
                  }}
                >
                  {v} {/* Display the size value */}
                </Button>
              )}
            </React.Fragment>
          ))}

      {/* Pagination: Show "Next" button if there are more sizes to display */}
      {!isDetail && sizes?.length > 6 && (
        <Zoom in={6 * (sizeCount + 1) < sizes?.length}>
          {' '}
          {/* Show the "Next" button if there are more sizes */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              if (6 * (sizeCount + 1) < sizes?.length) {
                setSizeCount(sizeCount + 1); // Increase the page number
              }
            }}
            sx={{
              minHeight: 24,
              minWidth: 25,
              borderWidth: 0,
              height: '24px !important',
              color: 'text.primary !important',
              p: 0.2
            }}
          >
            <MdKeyboardDoubleArrowRight size={20} /> {/* Icon for the "Next" button */}
          </Button>
        </Zoom>
      )}
    </Stack>
  );
}
