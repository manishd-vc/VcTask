'use client';
import { Button, Grid, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { BackArrow, MoreVertIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import ApprovalForm from './approvalForm';
import MoreInfo from './moreInfo';
import RejectForm from './rejectForm';
import SendToForm from './sendToForm';

/**
 * ApprovalPanel handles the approval workflow for a campaign, allowing the admin to approve, reject,
 * request more information, or assign the campaign to another approver.
 *
 * @param {Object} data - The data related to the campaign being approved.
 */

ApprovalPanel.propTypes = {
  // 'data' is an object containing 'campaignNumericId' and 'id'
  data: PropTypes.shape({
    campaignNumericId: PropTypes.string.isRequired, // Example: 'campaignNumericId' should be a string
    id: PropTypes.string.isRequired // Example: 'id' should be a string
  }).isRequired // Ensures 'data' is required and must match the specified shape
};

export default function ApprovalPanel({ data }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // State to manage modal visibility
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openApproval, setOpenApproval] = useState(false);
  const [openSendTo, setOpenSendTo] = useState(false);
  const [approvalState, setApprovalState] = useState('');

  // Mutations for various approval actions
  const { mutate: mutateNeedMoreInfo, isLoading: moreInfoLoading } = useMutation(api.needInfoCampaignByAdmin, {
    onSuccess: async () => {
      dispatch(
        setToastMessage({
          message: `More Info requested for request ${data.campaignNumericId}`,
          title: 'More Information Requested',
          variant: 'warning'
        })
      );
      handleCloseMoreInfo();
      router.back();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: mutateReject, isLoading: rejectLoading } = useMutation(api.rejectCampaignByAdmin, {
    onSuccess: async (response) => {
      dispatch(
        setToastMessage({
          message: response?.message,
          title: 'Request Rejected',
          variant: 'error'
        })
      );
      handleCloseReject();
      router.back();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: mutateApprove, isLoading: approveLoading } = useMutation(api.approveCampaignByAdmin, {
    onSuccess: async () => {
      const message =
        approvalState === 'IACAD_REQUEST'
          ? 'Campaign is waiting for approval from IACAD'
          : `Campaign request “${data.campaignNumericId}” has been approved`;

      dispatch(
        setToastMessage({
          message,
          title: approvalState === 'IACAD_REQUEST' ? 'IACAD Approval Requested' : 'Request Approved',
          variant: approvalState === 'IACAD_REQUEST' ? 'warning' : 'success'
        })
      );
      handleCloseApproval();
      router.back();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: mutateSendTo, isLoading: sendToLoading } = useMutation(api.assignToCampaignByAdmin, {
    onSuccess: async () => {
      dispatch(
        setToastMessage({
          message: `Campaign request ID assigned to another approver - ‘${data.campaignNumericId}’`,
          title: 'Request Assigned To Another Approver',
          variant: 'warning'
        })
      );
      router.back();
      handleCloseApproval();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Helper functions for handling open/close of modal dialogs
  const handleClickOpenMoreInfo = () => setOpenMoreInfo(true);
  const handleCloseMoreInfo = () => setOpenMoreInfo(false);
  const handleClickOpenReject = () => setOpenReject(true);
  const handleCloseReject = () => setOpenReject(false);
  const handleClickOpenApproval = () => setOpenApproval(true);
  const handleCloseApproval = () => setOpenApproval(false);
  const handleClickOpenSendTo = () => setOpenSendTo(true);
  const handleCloseSendTo = () => setOpenSendTo(false);

  // Functions to handle actions in the approval flow
  const handleMoreInfo = (values) => {
    mutateNeedMoreInfo({
      slug: data.id,
      content: values.moreInfo,
      fileId: values.fileId
    });
  };

  const handleReject = (values) => {
    mutateReject({
      slug: data.id,
      content: values.reason
    });
  };

  const handleApproval = (values) => {
    setApprovalState(values.iacadApproval === 'no' ? 'APPROVED' : 'IACAD_REQUEST');
    mutateApprove({
      slug: data.id,
      status: values.iacadApproval === 'no' ? 'APPROVED' : 'IACAD_REQUEST',
      content: values.iacadApproval === 'no' ? values.justification : 'IACAD request'
    });
  };

  const handleSendTo = (values) => {
    mutateSendTo({
      slug: data.id,
      userId: values.userId,
      content: values.justification,
      approvalStatus: 'ASSIGN_TO'
    });
  };

  // State for dropdown menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Grid item xs={12} md={2}>
        <Button
          variant="text"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={12} md={10}>
        <Stack justifyContent={{ sm: 'flex-start', md: 'flex-end' }} flexDirection="row" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="warning"
            onClick={handleClickOpenMoreInfo}
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          >
            Need more info
          </Button>
          {data?.approvedOnce !== true && (
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpenReject}
              sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            >
              Reject
            </Button>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleClickOpenApproval}
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          >
            Approve
          </Button>
          <IconButton
            aria-label="more options"
            aria-controls={open ? 'menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>

        {/* Dropdown Menu */}
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'menu-button'
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '10px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              padding: '0px 0',
              width: '340px'
            },
            '& .MuiMenuItem-root': {
              fontSize: '18px',
              padding: '14px 20px'
            }
          }}
        >
          <MenuItem
            onClick={() => {
              if (data?.campaignType == 'CHARITY') {
                router.push(`/admin/charity-operations/projects/${data?.id}/edit`);
              } else {
                router.push(`/admin/charity-operations/campaigns/${data?.id}/edit`);
              }
            }}
          >
            Edit Request
          </MenuItem>
          <MenuItem onClick={handleClickOpenSendTo}>Send it for another approver</MenuItem>
        </Menu>
      </Grid>
      <RejectForm open={openReject} onClose={handleCloseReject} onSubmit={handleReject} isLoading={rejectLoading} />
      <MoreInfo
        open={openMoreInfo}
        onClose={handleCloseMoreInfo}
        onSubmit={handleMoreInfo}
        isLoading={moreInfoLoading}
        id={data?.id}
      />

      <SendToForm open={openSendTo} onClose={handleCloseSendTo} onSubmit={handleSendTo} isLoading={sendToLoading} />
      <ApprovalForm
        open={openApproval}
        onClose={handleCloseApproval}
        onSubmit={handleApproval}
        isLoading={approveLoading}
      />
    </>
  );
}
