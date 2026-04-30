'use client';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';
import { checkPermissions } from 'src/utils/permissions';

const AllVolunteerListingComponent = React.lazy(() => import('./AllVolunteerListing'));

export default function AllVolunteerListingMain() {
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  return (
    <>
      <HeaderBreadcrumbs
        heading="All Volunteers"
        action={
          checkPermissions(rolesAssign, ['volunteer_campaign_manage']) && {
            title: 'Create & Enroll Volunteer',
            type: 'link',
            href: '/admin/all-volunteers/create'
          }
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <AllVolunteerListingComponent />
      </Suspense>
    </>
  );
}
