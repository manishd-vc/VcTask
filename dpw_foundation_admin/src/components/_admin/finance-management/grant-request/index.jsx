import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

export const GrantRequestListing = React.lazy(() => import('./grant-list'));

export default function FinanceGrantRequest() {
  return (
    <>
      <HeaderBreadcrumbs heading="Grant Requests" />
      <Suspense fallback={<LoadingFallback />}>
        <GrantRequestListing />
      </Suspense>
    </>
  );
}
