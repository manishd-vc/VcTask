'use client';

import React from 'react';
import { useRouter } from 'next-nprogress-bar';

// MUI components for styling
import { Box, Button, Typography } from '@mui/material';

// Importing NotFoundIllustration for 404 page
import { NotFoundIllustration } from 'src/illustrations';

/**
 * NotFound Component
 *
 * This component renders a 404 error page with an illustration, error message,
 * and buttons to navigate back to the previous page or go to the home page.
 *
 * It uses MUI components for styling and layout, and Next.js' `useRouter` hook
 * for navigation.
 */
export default function NotFound() {
  const router = useRouter(); // Accessing the router object for navigation

  return (
    <Box
      spacing={3} // Provides spacing between elements
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}
    >
      {/* Rendering the 404 illustration */}
      <NotFoundIllustration />

      {/* Displaying the 404 error message */}
      <Typography variant="h4" color="text.primary">
        404, Page not found
      </Typography>

      {/* Providing a brief explanation of the error */}
      <Typography variant="body1" color="initial">
        Something went wrong. It’s look that your requested page could not be found. It’s look like the link is broken
        or the page is removed.
      </Typography>

      {/* Buttons for navigating back or to home */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.back()} // Goes back to the previous page
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push('/')} // Navigates to the home page
          size="large"
        >
          Go To Home
        </Button>
      </Box>
    </Box>
  );
}
