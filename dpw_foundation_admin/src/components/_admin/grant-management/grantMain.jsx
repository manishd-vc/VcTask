'use client';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';
import { checkPermissions } from 'src/utils/permissions';

const MainListing = React.lazy(() => import('./mainListing'));

export default function GrantMain() {
  const rolesAssigned = useSelector((state) => state?.roles?.assignedRoles);
  const showCreateGrantBtn = checkPermissions(rolesAssigned, ['grant_manage']);
  return (
    <>
      <HeaderBreadcrumbs
        heading="Grant Requests"
        action={
          showCreateGrantBtn && {
            href: `/admin/grant-request/create`,
            title: 'Create Grant Request'
          }
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <MainListing />
      </Suspense>
    </>
  );
}
