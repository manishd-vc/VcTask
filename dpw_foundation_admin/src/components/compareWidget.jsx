import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

// mui
import { IconButton, alpha, Stack, Typography } from '@mui/material';

// icons
import { GoGitCompare } from 'react-icons/go';

/**
 * WishlistWidget Component
 *
 * Displays a widget that shows the number of products in the compare list.
 * Clicking the widget navigates to the compare page.
 *
 * @returns {JSX.Element} - The rendered WishlistWidget component.
 */
export default function WishlistWidget() {
  // Access the compare products list from Redux store
  const { products: compareProducts } = useSelector(({ compare }) => compare);

  return (
    <Link href="/compare">
      {' '}
      {/* Link to compare page */}
      <Stack
        direction="row" // Align items in a row
        spacing={1} // Space between items
        alignItems="center" // Align items vertically in the center
        width="auto"
        sx={{
          cursor: 'pointer' // Change cursor to pointer on hover
        }}
      >
        {/* Compare Icon Button */}
        <IconButton
          aria-label="compare"
          color="primary"
          disableRipple
          sx={{
            borderColor: 'primary',
            borderWidth: 1,
            borderStyle: 'solid',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) // Semi-transparent background
          }}
        >
          <GoGitCompare />
        </IconButton>

        {/* Text displaying the number of items in the compare list */}
        <Stack>
          <Typography variant="subtitle2" color="text.primary" mb={-0.6}>
            Compare
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {compareProducts?.length || 0} {compareProducts?.length > 1 ? 'Items' : 'Item'}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
}
