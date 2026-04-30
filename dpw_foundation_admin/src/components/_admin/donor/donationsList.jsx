'use client';

import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

// MUI components
import { LinearProgress, Stack } from '@mui/material';

// Custom components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Lazy-loaded components
const Donations = React.lazy(() => import('./donations'));

/**
 * DonationList Component
 *
 * A main container for donor-related management, offering tabs for donation pledges,
 * donors, email groups, and SMS groups. Implements lazy loading for performance optimization.
 *
 * @param {object} props - Component props
 * @param {string} props.donorType - The type of donors to display
 * @returns {JSX.Element} - Rendered DonorMain component
 */
export default function DonationList({ donorType }) {
  return (
    <>
      <HeaderBreadcrumbs admin heading="Donations" />
      {/* Tabs Component */}
      <Suspense fallback={<LoadingFallback />}>
        <Donations donorType={donorType} />
      </Suspense>
    </>
  );
}

/**
 * LoadingFallback Component
 *
 * A reusable component for rendering a loading indicator within a tab.
 *
 * @returns {JSX.Element} - Rendered fallback component
 */
const LoadingFallback = () => (
  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
    <LinearProgress />
  </Stack>
);

DonationList.propTypes = {
  donorType: PropTypes.string
};
