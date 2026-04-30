import React from 'react';
// mui
import { Stack, Skeleton } from '@mui/material';

/**
 * CampaignSkeleton Component
 *
 * Displays a skeleton loader for the Campaign component while data is being loaded.
 * This provides a visual placeholder for improved user experience during loading states.
 *
 * @returns {JSX.Element} - The rendered CampaignSkeleton component.
 */
export default function CampaignSkeleton() {
  return (
    <Stack gap={2} spacing={3}>
      {' '}
      {/* Stack container for consistent spacing between elements */}
      {/* Placeholder skeleton for campaign content */}
      <Skeleton variant="rectangular" width="100%" height={50} />
    </Stack>
  );
}
