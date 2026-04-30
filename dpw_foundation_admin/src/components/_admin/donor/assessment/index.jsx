'use client';

import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

// MUI components

// Custom components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

// Lazy-loaded components
const DonationPledges = React.lazy(() => import('./donationPledges'));
/**
 * DonorMain Component
 *
 * A main container for donor-related management, offering tabs for donation pledges,
 * donors, email groups, and SMS groups. Implements lazy loading for performance optimization.
 *
 * @param {object} props - Component props
 * @param {string} props.donorType - The type of donors to display
 * @returns {JSX.Element} - Rendered DonorMain component
 */
export default function AssessmentMain({ donorType }) {
  return (
    <>
      {/* Breadcrumb Header */}
      <HeaderBreadcrumbs admin heading="Assessment Operations" />

      {/* Tabs Component */}
      <Suspense fallback={<LoadingFallback />}>
        <DonationPledges donorType={donorType} />
      </Suspense>
    </>
  );
}

AssessmentMain.propTypes = {
  donorType: PropTypes.string
};
