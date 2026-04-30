'use client';
import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

const InKindContributionListing = React.lazy(() => import('./inKindContributionList'));

export default function FinanceInKindContributionRequests() {
  return (
    <>
      <HeaderBreadcrumbs heading="In Kind Contribution Requests" />
      <Suspense fallback={<LoadingFallback />}>
        <InKindContributionListing />
      </Suspense>
    </>
  );
}
