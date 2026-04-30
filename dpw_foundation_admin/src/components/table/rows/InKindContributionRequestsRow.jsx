import { Chip, Dialog, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import { AssignToSelf, DeleteIconRed, EditIcon, ViewIcon } from 'src/components/icons';
import { resetStep } from 'src/redux/slices/stepper';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import { inKindContributionStatusColorSchema } from 'src/utils/util';

export default function InKindContributionRequestsRow({ row, isLoading, refetch }) {
  const dispatch = useDispatch();
  const route = useRouter();
  const user = useSelector((state) => state?.user?.user);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const { masterData } = useSelector((state) => state?.common);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignSelf, setOpenAssignSelf] = useState(false);
  const [openAssignStoreManager, setOpenAssignStoreManager] = useState(false);

  const handleEdit = () => {
    dispatch(resetStep());
    route.push(`/admin/in-kind-contribution-requests/${row?.id}`);
  };
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const showEditIcon =
    (checkPermissions(rolesAssign, ['contribution_manage']) &&
      row?.assignTo === user?.userId &&
      row?.status === 'IN_PROGRESS_ASSESSMENT') ||
    row?.status === 'DRAFT';
  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.contributionUniqueId || '-'}</TableCell>
        <TableCell>{row?.requestTitle || '-'}</TableCell>
        <TableCell>
          {getLabelByCode(masterData, 'dpwf_contribution_assistance_requested', row?.assistanceRequested) || '-'}
        </TableCell>
        <TableCell>{getLabelByCode(masterData, 'dpwf_contribution_req_nature', row?.requestNature) || '-'}</TableCell>
        <TableCell>{row?.expectedDateContribution ? fDateWithLocale(row?.expectedDateContribution) : '-'}</TableCell>
        <TableCell>{row?.approvedValueDonation || row?.estimatedValueDonation || '-'}</TableCell>
        <TableCell>{row?.actualValueOfInkind || '-'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              color={inKindContributionStatusColorSchema[row?.status]}
              label={getLabelByCode(masterData, 'dpwf_inkind_contribution_status', row?.status)}
              size="small"
            />
          )}
        </TableCell>
        <TableCell>
          <Stack direction="row" justifyContent="flex-end">
            {!row?.assignTo && checkPermissions(rolesAssign, ['contribution_manage']) && (
              <Tooltip title="Assign To Self" arrow>
                <IconButton onClick={() => setOpenAssignSelf(true)}>
                  <AssignToSelf />
                </IconButton>
              </Tooltip>
            )}
            {!row?.storeManagerAssignTo &&
              row?.status === 'APPROVED' &&
              checkPermissions(rolesAssign, ['contribution_store_manager']) && (
                <Tooltip title="Assign To Self" arrow>
                  <IconButton onClick={() => setOpenAssignStoreManager(true)}>
                    <AssignToSelf />
                  </IconButton>
                </Tooltip>
              )}

            {showEditIcon && (
              <Tooltip title="Edit" arrow>
                <IconButton onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View" arrow>
              <IconButton onClick={() => route.push(`/admin/in-kind-contribution-requests/${row?.id}/view`)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            {row?.status === 'DRAFT' && (
              <Tooltip title="Delete" arrow>
                <IconButton onClick={handleDeleteClick}>
                  <DeleteIconRed />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      {openDeleteDialog && (
        <Dialog onClose={handleClose} open={openDeleteDialog} maxWidth="sm">
          <GeneralDialog
            id={row?.id}
            onClose={handleClose}
            endPoint="deleteInKindContributionRequestByManager"
            deleteMessage="Are you sure you want to delete In-Kind Contribution Request?"
            btnTitle="Delete"
            dialogTitle="Confirm"
            refetch={refetch}
            apiType="INKIND"
          />
        </Dialog>
      )}
      {openAssignSelf && (
        <Dialog onClose={() => setOpenAssignSelf(false)} open={openAssignSelf} maxWidth="sm">
          <GeneralDialog
            id={row?.id}
            onClose={() => setOpenAssignSelf(false)}
            endPoint="assignManagerToRequest"
            deleteMessage="By selecting this request, you are confirming your ownership and responsibility for its follow-up. Once assigned, it will be removed from the view of other approvers and routed exclusively to you for further action."
            btnTitle="Yes"
            dialogTitle="Confirm"
            refetch={refetch}
            apiType="INKIND"
            payload={{
              assignType: 'self',
              userId: user?.userId
            }}
          />
        </Dialog>
      )}

      {openAssignStoreManager && (
        <Dialog onClose={() => setOpenAssignStoreManager(false)} open={openAssignStoreManager} maxWidth="sm">
          <GeneralDialog
            id={row?.id}
            onClose={() => setOpenAssignStoreManager(false)}
            endPoint="assignStoreManagerToRequest"
            deleteMessage="By selecting this request, you are confirming your ownership and responsibility for its follow-up. Once assigned, it will be removed from the view of other approvers and routed exclusively to you for further action."
            btnTitle="Yes"
            dialogTitle="Confirm"
            refetch={refetch}
            apiType="INKIND"
            payload={{
              assignType: 'self',
              userId: user?.userId
            }}
          />
        </Dialog>
      )}
    </>
  );
}
