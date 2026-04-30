import React from 'react';
// mui components for layout and loading skeletons
import { Card, Skeleton } from '@mui/material';

// Breadcrumbs component to display skeleton loaders in a card
export default function Breadcrumbs() {
  return (
    // Card component to hold the skeletons, with some styling
    <Card
      sx={{
        mt: 5, // margin-top of 5 spacing units
        height: 128, // height of the card
        display: 'flex', // flexbox display to align items
        justifyContent: 'center', // horizontally center content
        flexDirection: 'column', // stack children vertically
        gap: 2, // spacing between elements inside the card
        paddingX: 2 // horizontal padding of 2 units
      }}
    >
      {/* First Skeleton representing the main breadcrumb placeholder */}
      <Skeleton variant="rounded" width={200} height={35} />

      {/* Second Skeleton representing a smaller breadcrumb placeholder */}
      <Skeleton variant="rounded" width={150} height={20} />
    </Card>
  );
}
