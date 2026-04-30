'use client';
import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

const AllPartners = React.lazy(() => import('./allPartners'));

export default function AllPartnersMain() {
  return (
    <>
      <HeaderBreadcrumbs heading="All Partners" />
      <Suspense fallback={<LoadingFallback />}>
        <AllPartners />
      </Suspense>
    </>
  );
}
