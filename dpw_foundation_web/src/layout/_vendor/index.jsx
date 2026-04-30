'use client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useDispatch } from 'src/redux';
import { toggleSidebar } from 'src/redux/slices/settings';

// mui
import Box from '@mui/material/Box';

// components
import { Stack } from '@mui/material';
import { useQuery } from 'react-query';
import Scrollbar from 'src/components/Scrollbar';
import { setMasterData } from 'src/redux/slices/common';
import { setProfileData } from 'src/redux/slices/profile';
import * as api from 'src/services';
import DashboardSidebar from './sidebar';
import DashboardAppbar from './topbar';

export default function MiniDrawer({ children }) {
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();
  const handleDrawerOpen = () => {
    setOpen(true);
    dispatch(toggleSidebar(true));
  };

  const handleDrawerClose = () => {
    setOpen(false);
    dispatch(toggleSidebar(false));
  };

  useQuery(
    ['masterDataFetch'],
    () =>
      api.masterDataFetch({
        masterLabelList: [
          'dpw_foundation_donor_gender',
          'dpw_foundation_donor_employed',
          'dpw_foundation_donor_occupation',
          'dpw_foundation_donor_marital_status',
          'dpw_foundation_donor_home_status',
          'dpw_foundation_configuration',
          'dpw_foundation_donor_employer',
          'dpw_foundation_currency',
          'dpw_foundation_user_contribution',
          'dpw_foundation_user_prefer_comm',
          'dpw_foundation_user_volunteering',
          'dpw_foundation_user_identity',
          'dpw_foundation_user_marital_status',
          'dpw_foundation_user_gender',
          'dpw_foundation_user_salutation',
          'dpw_foundation_donor_status',
          'dpw_foundation_donation_payment_method',
          'dpw_foundation_donation_donation_method',
          'dpw_foundation_donation_type',
          'dpw_foundation_donation_instrument',
          'dpw_foundation_filter_donor_status',
          'dpw_foundation_country',
          'dpwf_grant_assistance_required',
          'dpwf_grant_request_source',
          'dpwf_grant_demography',
          'dpwf_grant_status',
          'dpwf_grant_req_feedback_status_add',
          'dpwf_partnership_status',
          'dpwf_partnership_request_source',
          'dpwf_partnership_assistance_required',
          'dpwf_partner_agreement_type',
          'dpwf_partner_req_feedback_status_add',
          'dpw_foundation_campaign_status',
          'dpwf_language',
          'dpwf_log_activity_status',
          'dpwf_enrollment_status',
          'dpwf_contribution_req_nature',
          'dpwf_contribution_frequency',
          'dpwf_contribution_assistance_requested',
          'dpwf_contribution_required_unit',
          'dpwf_contribution_category',
          'dpwf_inkind_contribution_status',
          'dpwf_contribution_project_status',
          'dpw_foundation_campaign_register_as',
          'dpwf_contribution_req_source'
        ]
      }),
    {
      onSuccess: (response) => {
        dispatch(setMasterData(response));
      }
    }
  );

  useQuery(['user-profile'], () => api.getProfile(), {
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(setProfileData(response?.data || {}));
      }
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  return (
    <Box sx={{ display: 'flex', height: 1, maxWidth: '100%', overflow: 'hidden' }}>
      <DashboardSidebar handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} open={open} />
      <Box sx={{ flex: '1 1 0%', height: 1, width: 1, overflow: 'hidden', display: 'flex' }} flexDirection="column">
        <DashboardAppbar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
        <Stack component="main" sx={{ flex: 1, overflow: 'auto' }}>
          <Scrollbar
            sx={{
              height: 1
            }}
          >
            <Box
              sx={{
                py: { xs: 3 },
                px: { xs: 2, sm: 2, md: 3, lg: 4 }
              }}
            >
              {children}
            </Box>
          </Scrollbar>
        </Stack>
      </Box>
    </Box>
  );
}
MiniDrawer.propTypes = {
  children: PropTypes.node.isRequired
};
