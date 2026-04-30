'use client';

import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { gtmEvents } from 'src/lib/gtmEvents';
// MUI components

// Custom components
import { useRouter } from 'next-nprogress-bar';
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
export default function DonorMain({ donorType }) {
  const router = useRouter();

  // GTM event + redirect on button click
  const handleCreatePledge = () => {
    // Fire GTM CTA click event
    gtmEvents.pledgeClick({
      linkName: 'Create New Pledge',
      valueSelected: 'Pledge a Donation',
      sectionName: 'Create New Pledge'
    });
    router.push(`/admin/donor-admin/create-pledge`);
  };
  return (
    <>
      {donorType == 'hod' ? (
        <HeaderBreadcrumbs admin heading="HOD Approval" />
      ) : (
        <HeaderBreadcrumbs
          admin
          heading="Donation Pledges"
          action={{
            type: 'click',
            onClick: handleCreatePledge,
            title: 'Create New Pledge'
          }}
        />
      )}
      {/* Tabs Component */}
      <Suspense fallback={<LoadingFallback />}>
        <DonationPledges donorType={donorType} />
      </Suspense>
    </>
  );
}

DonorMain.propTypes = {
  donorType: PropTypes.string
};
