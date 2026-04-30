'use client';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import { setExistingCampaignData, setVolunteerCampaignData } from 'src/redux/slices/volunteer';
import * as volunteerApi from 'src/services/volunteer';
import { checkPermissions } from 'src/utils/permissions';

const VolunteerCampaignsListing = React.lazy(() => import('./VolunteerCampaignsListing'));

export default function VolunteerCampaignsListingMain() {
  const dispatch = useDispatch();

  const router = useRouter();
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);

  const { mutate } = useMutation('createVolunteerCampaign', volunteerApi.createIntentVolunteerCampaign, {
    onSuccess: (response) => {
      router.push(`/admin/volunteer-campaigns/create/${response?.id}`);
      dispatch(resetStep());
      dispatch(setExistingCampaignData(null));
      dispatch(setVolunteerCampaignData(response));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
    }
  });

  const handleCreateVolunteerCampaign = () => {
    mutate({});
  };

  return (
    <>
      <HeaderBreadcrumbs
        heading="volunteer campaigns"
        action={
          checkPermissions(rolesAssign, ['volunteer_campaign_manage']) && {
            title: 'Create New Campaign',
            onClick: () => handleCreateVolunteerCampaign(),
            type: 'click'
          }
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <VolunteerCampaignsListing />
      </Suspense>
    </>
  );
}
