'use client';
import { Chip, Dialog, IconButton, Menu, MenuItem, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import VolunteerPostAnalysisQuestions from 'src/components/_admin/volunteer-management/complete-request/VolunteerPostAnalysisQuestions';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import VolunteerCampaignCancelDialog from 'src/components/dialog/VolunteerCampaignCancelDialog';
import GeneralDialog from 'src/components/dialog/approval';
import { CancelIcon, DeleteIconRed, EditIcon, MoreVertIcon, QuestionIcon, ViewIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import { volunteerCampaingStatusColorSchema } from 'src/utils/util';
import { canCancelVolunteerCampaign } from 'src/utils/volunteerCampaignUtils';

export default function VolunteerCampaignsRow({ row, isLoading, refetch }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { masterData } = useSelector((state) => state?.common);
  const user = useSelector((state) => state?.user?.user);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [postAnalysisDialogOpen, setPostAnalysisDialogOpen] = useState(false);

  const openSubmenu = Boolean(anchorEl);
  const ariaControls = openSubmenu ? 'account-menu' : undefined;
  const ariaExpanded = openSubmenu ? 'true' : undefined;

  const locationLabel = country?.find((item) => item?.code === row?.location)?.label || row?.location;
  const canDelete = row?.status === 'DRAFT' && checkPermissions(rolesAssign, ['volunteer_campaign_manage']);

  const showEditIcon =
    (row?.assignTo === user?.userId && row?.status === 'FEEDBACK_REQUESTED') || row?.status === 'DRAFT';

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };
  const handleEditClick = () => {
    router.push(`/admin/volunteer-campaigns/${row?.id}`);
  };

  const handleOpenSubmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSubmenu = () => {
    setAnchorEl(null);
  };

  const handleOpenPostAnalysis = () => {
    setPostAnalysisDialogOpen(true);
    handleCloseSubmenu();
  };

  const handleClosePostAnalysis = () => {
    setPostAnalysisDialogOpen(false);
  };

  // Fetch questions data for the dialog
  const { data: questionsData, isLoading: questionsLoading } = useQuery(
    ['getVolunteerCampaignQuestions', row?.id, postAnalysisDialogOpen],
    () => api.getCampaignQuestions(row?.id, 'VOLUNTEER_CAMPAIGN'),
    {
      refetchOnWindowFocus: false,
      enabled: !!row?.id && postAnalysisDialogOpen
    }
  );

  const cancelMutation = useMutation(volunteerApi.cancelVolunteerCampaign, {
    onSuccess: () => {
      dispatch(
        setToastMessage({
          message: 'Volunteer campaign cancelled successfully',
          variant: 'success'
        })
      );
      setCancelDialogOpen(false);
      queryClient.invalidateQueries('volunteerCampaigns');
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error.response?.data?.message || 'Failed to cancel campaign',
          variant: 'error'
        })
      );
    }
  });

  const handleCancelCampaign = (payload) => {
    cancelMutation.mutate({
      entityId: row.id,
      payload
    });
  };

  const showCancelButton =
    canCancelVolunteerCampaign(row?.status) && checkPermissions(rolesAssign, ['volunteer_campaign_manage']);

  const showPostAnalysisButton =
    row?.status !== 'COMPLETED' &&
    row?.status !== 'REJECTED' &&
    checkPermissions(rolesAssign, ['volunteer_campaign_manage']);

  return (
    <>
      <>
        <TableRow hover>
          <TableCell>{row?.volunteerCampaignUniqueId}</TableCell>
          <TableCell>{row?.campaignName}</TableCell>
          <TableCell sx={{ textTransform: 'capitalize' }}>{row?.eventType || '-'}</TableCell>
          <TableCell>{locationLabel || '-'}</TableCell>
          <TableCell>{row?.startDate ? fDateWithLocale(row.startDate) : '-'}</TableCell>
          <TableCell>{row?.endDate ? fDateWithLocale(row.endDate) : '-'}</TableCell>
          <TableCell>{row?.noOfVolunteersRequired || 0}</TableCell>
          <TableCell>{row?.noOfVolunteerEnrolled || '-'}</TableCell>
          <TableCell>
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              <Chip
                color={volunteerCampaingStatusColorSchema[row?.status] || 'default'}
                label={getLabelByCode(masterData, 'dpwf_volunteer_status', row?.status) || row?.status}
                size="small"
              />
            )}
          </TableCell>
          <TableCell align="right">
            <Stack direction="row" justifyContent="flex-end">
              {showEditIcon && (
                <Tooltip title="Edit" arrow>
                  <IconButton onClick={handleEditClick}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View" arrow>
                <IconButton onClick={() => router.push(`/admin/volunteer-campaigns/${row?.id}/view`)}>
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              {canDelete && (
                <Tooltip title="Delete" arrow>
                  <IconButton onClick={handleDeleteClick}>
                    <DeleteIconRed />
                  </IconButton>
                </Tooltip>
              )}
              {showCancelButton && (
                <Tooltip title="Cancel Volunteer Campaign" arrow>
                  <IconButton onClick={() => setCancelDialogOpen(true)} color="error" size="small">
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              )}
              {showPostAnalysisButton && (
                <>
                  <HtmlTooltip title="More Options" arrow>
                    <IconButton
                      aria-controls={ariaControls}
                      aria-haspopup="true"
                      aria-expanded={ariaExpanded}
                      onClick={handleOpenSubmenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </HtmlTooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openSubmenu}
                    onClose={handleCloseSubmenu}
                    onClick={handleCloseSubmenu}
                  >
                    <MenuItem onClick={handleOpenPostAnalysis}>
                      <QuestionIcon /> &nbsp; Prepare Post Analysis Questions
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </TableCell>
        </TableRow>
        {openDeleteDialog && (
          <Dialog onClose={handleClose} open={openDeleteDialog} maxWidth="sm">
            <GeneralDialog
              id={row?.id}
              onClose={handleClose}
              endPoint="deleteVolunteerCampaignByAdmin"
              deleteMessage="Are you sure you want to delete this volunteer Campaign?"
              btnTitle="Delete"
              dialogTitle="Confirm"
              refetch={refetch}
              apiType="VOLUNTEER"
            />
          </Dialog>
        )}
      </>

      <VolunteerCampaignCancelDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onSubmit={handleCancelCampaign}
        loading={cancelMutation.isLoading}
        campaignId={row?.volunteerCampaignUniqueId}
      />
      {postAnalysisDialogOpen && (
        <VolunteerPostAnalysisQuestions
          open={postAnalysisDialogOpen}
          onClose={handleClosePostAnalysis}
          id={row?.id}
          mode="create"
          data={questionsData}
          isLoading={questionsLoading}
        />
      )}
    </>
  );
}
