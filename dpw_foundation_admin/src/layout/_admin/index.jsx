'use client';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useDispatch } from 'src/redux';
import { toggleSidebar } from 'src/redux/slices/settings';

// MUI components
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';

// React Query
import { useQuery } from 'react-query';

// Components
import Scrollbar from 'src/components/Scrollbar';
import { setMasterData } from 'src/redux/slices/common';
import * as api from 'src/services';
import DashboardSidebar from './sidebar';
import DashboardAppbar from './topbar';

/**
 * MiniDrawer component renders the main layout structure including the sidebar,
 * appbar, and the content area with a scrollbar. The sidebar can be toggled open and closed.
 * It also fetches master data and stores it in the Redux store.
 *
 * @param {Object} props - The props passed to the component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the main area.
 *
 * @returns {React.ReactNode} The layout JSX element with sidebar, appbar, and content.
 */
export default function MiniDrawer({ children }) {
  const [open, setOpen] = React.useState(true); // State to control if the sidebar is open
  const dispatch = useDispatch();
  // Fetch master data from the API and store it in the Redux store
  useQuery(
    ['masterDataFetch'],
    () =>
      api.masterDataFetch({
        masterLabelList: [
          'dpw_foundation_campaign_category',
          'dpw_foundation_campaign_coverage',
          'dpw_foundation_campaign_type',
          'dpw_foundation_common_yes_no',
          'dpw_foundation_campaign_inkind_unit',
          'dpw_foundation_campaign_risk',
          'dpw_foundation_campaign_inkind_type',
          'dpw_foundation_currency',
          'dpw_foundation_country',
          'dpw_foundation_project_fund_source',
          'dpw_foundation_campaign_benificiary_type',
          'dpw_foundation_configuration',
          'dpw_foundation_question_type',
          'dpw_foundation_campaign_status',
          'dpw_foundation_donor_type',
          'dpw_foundation_user_identity',
          'dpw_foundation_user_salutation',
          'dpw_foundation_user_marital_status',
          'dpw_foundation_donor_marital_status',
          'dpw_foundation_donor_gender',
          'dpw_foundation_user_gender',
          'dpw_foundation_user_prefer_comm',
          'dpw_foundation_module_label',
          'dpw_foundation_campaign_item_location',
          'dpw_foundation_campaign_distribution_status',
          'dpw_foundation_campaign_approval_tree',
          'dpw_foundation_campaign_filter_status',
          'dpw_foundation_capproval_tree_role',
          'dpw_foundation_donor_status',
          'dpw_foundation_filter_donor_status',
          'dpw_foundation_campaign_category',
          'dpw_foundation_campaign_register_as',
          'dpw_foundation_donation_type',
          'dpw_foundation_donation_donation_method',
          'dpw_foundation_donation_payment_method',
          'dpw_foundation_donor_status',
          'dpwf_grant_assistance_required',
          'dpwf_grant_request_source',
          'dpwf_grant_demography',
          'dpwf_grant_req_approval_stages_add',
          'dpwf_grant_doc_approval_stages_add',
          'dpwf_grant_status',
          'dpwf_grant_req_approval_stages_view',
          'dpwf_grant_req_feedback_status_add',
          'dpwf_grant_doc_approval_stages_view',
          'dpwf_partner_sector',
          'dpwf_partner_agreement_type',
          'dpwf_partner_year_of_exp',
          'dpwf_partner_request_source',
          'dpwf_partner_req_approval_stages_add',
          'dpwf_partner_req_approval_stages_view',
          'dpwf_partner_doc_approval_stages_view',
          'dpwf_partner_doc_approval_stages_add',
          'dpwf_partnership_status',
          'dpwf_partner_req_feedback_status_add',
          'dpwf_partner_question_type',
          'dpwf_partner_verification_status',
          'dpwf_volunteer_event_type',
          'dpwf_volunteer_region',
          'dpwf_volunteer_gender',
          'dpwf_volunteer_severity',
          'dpwf_volunteer_likelyhood',
          'dpwf_volunteer_risk_level',
          'dpwf_volunteer_unit',
          'dpwf_volunteer_age',
          'dpwf_language',
          'dpwf_volunteer_status',
          'dpwf_volunteer_req_feedback_status_add',
          'dpwf_volunteer_req_approval_stages_view',
          'dpwf_volunteer_req_approval_stages_add',
          'dpwf_volunteer_question_type',
          'dpwf_enrollment_status',
          'dpw_foundation_user_volunteering',
          'dpwf_user_status',
          'dpwf_volunteer_req_task_status',
          'dpwf_log_activity_status',
          'dpwf_inkind_contribution_status',
          'dpwf_contribution_req_nature',
          'dpwf_contribution_req_source',
          'dpwf_contribution_assistance_requested',
          'dpwf_contribution_frequency',
          'dpwf_contribution_req_approval_stages_add',
          'dpwf_contribution_req_approval_stages_view',
          'dpwf_contribution_required_unit',
          'dpwf_contribution_category',
          'dpwf_contribution_type_of_document',
          'dpwf_contribution_question_type',
          'dpwf_contribution_project_status',
          'dpwf_contribution_item_issued_status',
          'dpw_foundation_campaign_sector',
          'dpw_foundation_campaign_fund_source'
        ]
      }),
    {
      onSuccess: (response) => {
        dispatch(setMasterData(response)); // Store the fetched data in Redux state
      }
    }
  );

  /**
   * Handles opening the sidebar and dispatching the action to update its state.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
    dispatch(toggleSidebar(true)); // Update the Redux store to reflect the sidebar state
  };

  /**
   * Handles closing the sidebar and dispatching the action to update its state.
   */
  const handleDrawerClose = () => {
    setOpen(false);
    dispatch(toggleSidebar(false)); // Update the Redux store to reflect the sidebar state
  };

  return (
    <Box sx={{ display: 'flex', height: 1, maxWidth: '100%', overflow: 'hidden' }}>
      {/* Sidebar Component */}
      <DashboardSidebar handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} open={open} />

      {/* Main content area */}
      <Box sx={{ flex: '1 1 0%', height: 1, width: 1, overflow: 'hidden', display: 'flex' }} flexDirection="column">
        {/* App bar component */}
        <DashboardAppbar
          drawerState={open ? 'open' : 'closed'}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
        />

        {/* Main content wrapped with Scrollbar */}
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

/**
 * PropTypes validation for MiniDrawer component.
 * Ensures that the `children` prop is a valid React node.
 */
MiniDrawer.propTypes = {
  children: PropTypes.node.isRequired
};
