import React from 'react';
// mui components for layout and loading skeletons
import { Box, Stack, Typography, Skeleton } from '@mui/material';

// Sizes component that displays skeleton loaders as placeholders for content
export default function Sizes() {
  return (
    // Main container with padding
    <Box p={2}>
      <Stack>
        {/* Skeleton for the text placeholder */}
        <Typography variant="body1" sx={{ width: 130 }}>
          <Skeleton variant="text" />
        </Typography>

        {/* Stack to arrange two sets of skeletons horizontally */}
        <Stack direction="row" gap={1} sx={{ mt: 3 }}>
          {/* First row of skeletons with circular placeholders for avatars and text */}
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
          {/* Second row of skeletons */}
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
        </Stack>

        {/* Repeat similar structure for additional rows of skeletons */}
        <Stack direction="row" gap={1} mt={1}>
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            <Skeleton variant="circular" width={40} height={40} /> {/* Circular avatar skeleton */}
            <Skeleton height={12} width={'50%'} /> {/* Text skeleton */}
          </Stack>
        </Stack>

        {/* Another set of skeletons */}
        <Stack direction="row" gap={1} mt={1}>
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
