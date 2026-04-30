'use client';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';
import { checkPermissions } from 'src/utils/permissions';

const PartnerList = React.lazy(() => import('./partnerList'));

export default function PartnerManagement() {
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const showCreatePartnerBtn = checkPermissions(rolesAssign, ['partner_manage']);

  return (
    <>
      <HeaderBreadcrumbs
        heading="partnership Requests"
        action={
          showCreatePartnerBtn && {
            href: `/admin/partnership-request/create`,
            title: 'Create New Partnership'
          }
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <PartnerList />
      </Suspense>
    </>
  );
}
