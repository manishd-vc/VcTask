'use client';
import { Chip, Dialog, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import VolunteerCampaignCancelDialog from 'src/components/dialog/VolunteerCampaignCancelDialog';
import GeneralDialog from 'src/components/dialog/approval';
import { CloseIcon, DeleteIconRed, EditIcon, EnrollVolunteer, ViewIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { checkPermissions } from 'src/utils/permissions';
import { volunteerStatusColorSchema } from 'src/utils/util';
import { canCancelVolunteerCampaign } from 'src/utils/volunteerCampaignUtils';

export default function AllVolunteerRow({ row, isLoading, refetch }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { masterData } = useSelector((state) => state?.common);
  const user = useSelector((state) => state?.user?.user);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const canDelete = row?.status === 'DRAFT' && checkPermissions(rolesAssign, ['volunteer_campaign_manage']);

  const showEditIcon =
    (row?.assignTo === user?.userId && row?.status === 'IN_PROGRESS_ASSESSMENT') || row?.status === 'DRAFT';

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };
  const handleEditClick = () => {
    router.push(`/admin/volunteer-campaigns/${row?.id}`);
  };

  const { mutate: intentVolunteerEnrollment } = useMutation(volunteerApi.intentVolunteerEnrollment, {
    onSuccess: (response) => {
      router.push(`/admin/all-volunteers/${response?.id}?status=ENROLLED`);
      dispatch(resetStep());
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

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

  const handleEnrollVolunteer = (userId) => {
    intentVolunteerEnrollment({ userId });
  };

  return (
    <>
      <>
        <TableRow hover>
          <TableCell>{row?.volunteerNumericId}</TableCell>
          <TableCell sx={{ textTransform: 'capitalize' }}>{row?.firstName}</TableCell>
          <TableCell sx={{ textTransform: 'capitalize' }}>{row?.lastName}</TableCell>
          <TableCell>{row?.email}</TableCell>
          <TableCell>{row?.phone}</TableCell>
          <TableCell>{row?.totalEnrollment}</TableCell>
          <TableCell>
            {isLoading ? (
              <Skeleton variant="text" />
            ) : (
              <Chip
                color={volunteerStatusColorSchema[row?.status] || 'default'}
                label={getLabelByCode(masterData, 'dpwf_user_status', row?.status) || row?.status}
                size="small"
              />
            )}
          </TableCell>
          <TableCell align="right">
            <Stack direction="row" justifyContent="flex-end">
              {showEditIcon && (
                <Tooltip title="edit" arrow>
                  <IconButton onClick={handleEditClick}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {row?.status === 'Active' && row?.isVolunteer && (
                <Tooltip title="Enroll Volunteer" arrow>
                  <IconButton onClick={() => handleEnrollVolunteer(row?.userId)}>
                    <EnrollVolunteer />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View" arrow>
                <IconButton onClick={() => router.push(`/admin/all-volunteers/${row?.id}/view`)}>
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
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </TableCell>
        </TableRow>
        {openDeleteDialog && (
          <Dialog onClose={handleClose} open={openDeleteDialog} maxWidth="xs">
            <GeneralDialog
              id={row?.id}
              onClose={handleClose}
              endPoint="deleteVolunteerCampaignByAdmin"
              deleteMessage="Are you sure you want to delete this volunteer?"
              btnTitle="Delete"
              dialogTitle="Delete Volunteer"
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
    </>
  );
}
