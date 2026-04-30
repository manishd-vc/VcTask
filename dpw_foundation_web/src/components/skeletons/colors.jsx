import React from 'react';
// mui components for layout and loading skeletons
import { Box, Stack, Typography, Skeleton } from '@mui/material';

// Colors component to display skeleton loaders for a color palette
export default function Colors() {
  return (
    // Main container with padding around content
    <Box p={2}>
      <Stack>
        {/* Skeleton for a text placeholder with margin-bottom */}
        <Typography variant="body1" sx={{ mb: 1.2, width: 100 }}>
          <Skeleton variant="text" />
        </Typography>

        {/* Stack to arrange the color skeletons horizontally with a gap */}
        <Stack direction="row" gap={1} sx={{ mt: '18.1px' }}>
          <Stack direction="row" gap={1} alignItems="center" width="100%">
            {/* Map over an array to generate multiple skeletons for color palette */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map(() => (
              <Skeleton
                key={`data-key_${new Date().getTime()}`} // Unique key for each skeleton
                variant="rectangular" // Rectangular shape for color blocks
                sx={{ borderRadius: '4px', minWidth: 24 }} // Border radius and minimum width
                width={24} // Set the width of each skeleton
                height={24} // Set the height of each skeleton
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
