'use client';
import React, { Suspense } from 'react';

// mui
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
// icon
// api
import { useDispatch, useSelector } from 'react-redux';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { checkPermissions } from 'src/utils/permissions';

// components
const FundraisingCampaign = React.lazy(() => import('../campaign/fundraisingCampaign'));
/**
 * Campaign component handles the campaign management page.
 * - Displays a header with breadcrumbs.
 * - Allows the creation of new campaigns.
 * - Contains tabs to switch between different sections: fundraising campaigns, charitable programs, and campaign statistics.
 */
export default function Campaigns() {
  const router = useRouter(); // Router for navigation
  const dispatch = useDispatch(); // Redux dispatch for state management
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles); // Retrieve user roles from the Redux store

  const { mutate } = useMutation('createCampaign', api.createNewCampaign, {
    onSuccess: (response) => {
      // Redirect to the newly created campaign's edit page on success
      router.push(`/admin/charity-operations/campaigns/add/${response?.data?.id}`);
    },
    onError: (error) => {
      // Show an error toast message on failure
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  /**
   * Handles the creation of a new campaign draft.
   * Triggers the mutation to create a new campaign.
   */
  const handleCreateCampaignDraft = () => {
    mutate({ name: 'abc', campaignType: 'FUNDCAMP' });
  };

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Fundraising Campaign Management"
        action={
          checkPermissions(rolesAssign, ['fund_manage_add']) && {
            type: 'click',
            title: 'Create New Campaign',
            onClick: () => handleCreateCampaignDraft() // Action to create a new campaign
          }
        }
      />
      <Suspense fallback={<LoadingFallback />}>
        <FundraisingCampaign />
      </Suspense>
    </>
  );
}
