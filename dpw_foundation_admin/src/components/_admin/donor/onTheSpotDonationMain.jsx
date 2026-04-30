'use client';

import React, { Suspense } from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';

const OnTheSpotDonationLazy = React.lazy(() => import('./onTheSpotDonation'));
export default function OnTheSpotDonationMain() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="On Site Donations"
        action={{
          href: `/admin/on-the-spot-donation/add`,
          title: 'Make Donation'
        }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <OnTheSpotDonationLazy donorType="admin" />
      </Suspense>
    </>
  );
}
