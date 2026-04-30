'use client';
import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

export const AllProjectsListing = React.lazy(() => import('./AllProjectsListing'));

export default function AllProjectsMain() {
  return (
    <>
      <HeaderBreadcrumbs heading="All Projects" />
      <Suspense fallback={<LoadingFallback />}>
        <AllProjectsListing />
      </Suspense>
    </>
  );
}
