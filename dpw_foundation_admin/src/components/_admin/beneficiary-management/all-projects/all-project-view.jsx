'use client';
import React, { Suspense } from 'react';
import LoadingFallback from 'src/components/loadingFallback';

const UpdateCampaign = React.lazy(() => import('src/components/_admin/campaign/updateCampaign'));

export default function AllProjectsView() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UpdateCampaign isEdit={false} isApprove={false} isView={true} beneficiaryProject={true} />
    </Suspense>
  );
}
