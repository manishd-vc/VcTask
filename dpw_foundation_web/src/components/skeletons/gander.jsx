import React from 'react';
// mui components for layout and loading skeletons
import { Box, Stack, Typography, Skeleton } from '@mui/material';

// Gander component to display skeleton loaders for a list of gender-related options or items
export default function Gander() {
  return (
    // Main container with padding around content
    <Box p={2}>
      <Stack>
        {/* Skeleton for a text placeholder */}
        <Typography variant="body1" sx={{ width: 130 }}>
          <Skeleton variant="text" />
        </Typography>

        {/* Stack to arrange two rows of skeletons horizontally with a gap */}
        <Stack direction="row" gap={1} sx={{ mt: 0.8 }}>
          {/* First row with skeletons representing a circular avatar and text */}
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
          {/* Second row with similar skeletons */}
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
        </Stack>

        {/* Repeat the same structure for another set of skeletons */}
        <Stack direction="row" gap={1} mt={0.8}>
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
