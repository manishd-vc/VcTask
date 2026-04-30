'use client';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';
import { checkPermissions } from 'src/utils/permissions';

const AllBeneficiaryComponent = React.lazy(() => import('./AllBeneficiary'));

export default function AllBeneficiaryMain() {
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  return (
    <>
      <HeaderBreadcrumbs
        heading="All Beneficiaries"
        action={
          checkPermissions(rolesAssign, ['contribution_manage']) && {
            title: 'Create Beneficiary',
            type: 'link',
            href: '/admin/all-beneficiaries/create'
          }
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <AllBeneficiaryComponent />
      </Suspense>
    </>
  );
}
