'use client';
import React, { Suspense } from 'react';

// mui
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import CustomTabs from 'src/components/tabs/tabs';
// components
// icon
// api
import { LinearProgress, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

// components
const FundraisingCampaign = React.lazy(() => import('./fundraisingCampaign'));
const CharitablePrograms = React.lazy(() => import('./charitablePrograms'));
const CampaignStatisticDashboard = React.lazy(() => import('./campaignStatisticDashboard'));

/**
 * Tabs data containing the different sections of the campaign page.
 * Each tab contains a label, a unique value, and the content displayed in the tab.
 */
const tabsData = [
  {
    label: 'Fundraising Campaigns',
    value: 'fundraising',
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <FundraisingCampaign />
      </Suspense>
    )
  },
  {
    label: 'Charitable Programs',
    value: 'charitable',
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <CharitablePrograms />
      </Suspense>
    )
  },
  {
    label: 'Campaign Statistics Dashboard',
    value: 'dashboard',
    content: (
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <CampaignStatisticDashboard />
      </Suspense>
    )
  }
];

/**
 * Campaign component handles the campaign management page.
 * - Displays a header with breadcrumbs.
 * - Allows the creation of new campaigns.
 * - Contains tabs to switch between different sections: fundraising campaigns, charitable programs, and campaign statistics.
 */
export default function Campaign() {
  const router = useRouter(); // Router for navigation
  const dispatch = useDispatch(); // Redux dispatch for state management
  const { mutate } = useMutation('createCampaign', api.createNewCampaign, {
    onSuccess: (response) => {
      // Redirect to the newly created campaign's edit page on success
      router.push(`/admin/campaign/add/${response?.data?.id}`);
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
    mutate({ name: 'abc' });
  };

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Fundraising and Campaign Management"
        action={{
          type: 'click',
          title: 'Create New Campaign',
          onClick: () => handleCreateCampaignDraft() // Action to create a new campaign
        }}
      />
      <CustomTabs tabs={tabsData} defaultValue="fundraising" /> {/* Custom tab component to switch between sections */}
    </>
  );
}
