import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

const AllEnrollmentsListing = React.lazy(() => import('./AllEnrollmentsListing'));

export default function AllEnrollmentsListingMain() {
  return (
    <>
      <HeaderBreadcrumbs heading="All Enrollments" />
      <Suspense fallback={<LoadingFallback />}>
        <AllEnrollmentsListing />
      </Suspense>
    </>
  );
}
