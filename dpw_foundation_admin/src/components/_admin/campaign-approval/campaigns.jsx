'use client'; // Indicates this file is a client-side component in Next.js

import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// mui imports
// components imports
import LoadingFallback from 'src/components/loadingFallback';

// Lazy loading components for tabs
const FundraisingCampaign = React.lazy(() => import('./fundraisingCampaign'));
// CampaignApproval component prop types validation
CampaignApproval.propTypes = {};

/**
 * Renders the CampaignApproval component with tabs for Fundraising Campaigns and Charitable Programs.
 * It uses the CustomTabs component and provides the tabsData as input.
 *
 * @returns {JSX.Element} The CampaignApproval component, including CustomTabs.
 */
export default function CampaignApproval({ isSupervisor }) {
  return (
    <>
      <HeaderBreadcrumbs admin heading={isSupervisor ? 'Campaign Supervision' : 'Fundraising Campaign Management'} />
      <Suspense fallback={<LoadingFallback />}>
        <FundraisingCampaign isSupervisor={isSupervisor} /> {/* Custom tab component to switch between sections */}
      </Suspense>
    </>
  );
}
