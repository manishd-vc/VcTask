'use client'; // Indicates this file is a client-side component in Next.js

import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// mui imports
// components imports
import LoadingFallback from 'src/components/loadingFallback';

// Lazy loading components for tabs
const CharitablePrograms = React.lazy(() => import('./charitablePrograms'));

// CampaignApproval component prop types validation
ProjectsApproval.propTypes = {};

/**
 * Renders the ProjectsApproval component with tabs for Fundraising Campaigns and Charitable Programs.
 * It uses the CustomTabs component and provides the tabsData as input.
 *
 * @returns {JSX.Element} The ProjectsApproval component, including CustomTabs.
 */
export default function ProjectsApproval({ isSupervisor }) {
  return (
    <>
      <HeaderBreadcrumbs admin heading={isSupervisor ? 'Project Supervision' : 'Charitable Project Management'} />
      <Suspense fallback={<LoadingFallback />}>
        <CharitablePrograms isSupervisor={isSupervisor} /> {/* Custom tab component to switch between sections */}
      </Suspense>
    </>
  );
}
