import { Chip, Dialog, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import {
  AcceptanceLetterIcon,
  AssignToSelf,
  DeleteIconRed,
  EditIcon,
  SignDocumentIcon,
  ViewIcon
} from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { resetStep } from 'src/redux/slices/stepper';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getGrantStatus } from 'src/utils/getGrantStatus';
import { checkPermissions } from 'src/utils/permissions';
import { grantStatusColorSchema } from 'src/utils/util';

export default function GrantRequestsRow({ isLoading, row, handleClickOpen, refetch }) {
  const route = useRouter();
  const dispatch = useDispatch();
  const fCurrency = useCurrencyFormatter('AED');
  const { masterData } = useSelector((state) => state?.common);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const user = useSelector((state) => state?.user?.user);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const renderAssignSelf = () => {
    if (!row?.assignTo) {
      return (
        <Tooltip title="Assign To Self" arrow>
          <IconButton onClick={() => handleClickOpen(row.id, 'assign')}>
            <AssignToSelf />
          </IconButton>
        </Tooltip>
      );
    } else if (
      !row?.adminAssignTo &&
      row?.status === 'IN_PROGRESS_DOC_CREATION' &&
      checkPermissions(rolesAssign, ['grant_manage_admin_manage'])
    ) {
      return (
        <Tooltip title="Assign To Self" arrow>
          <IconButton onClick={() => handleClickOpen(row.id, 'admin-assign')}>
            <AssignToSelf />
          </IconButton>
        </Tooltip>
      );
    }
  };

  const handleEdit = () => {
    dispatch(resetStep());
    route.push(`/admin/grant-request/${row?.id}`);
  };
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const showEditIcon =
    (checkPermissions(rolesAssign, ['grant_manage']) &&
      row?.assignTo === user?.userId &&
      row?.status === 'IN_PROGRESS_ASSESSMENT') ||
    row?.status === 'DRAFT';

  const showLetterIcon = row?.status === 'IN_PROGRESS_DOC_CREATION' && row?.adminAssignTo === user?.userId;

  const hideSignDocumentIcon = row?.status === 'IN_PROGRESS_DOC_CREATION' || row?.status === 'GRANT_APPROVED';

  const showSignDocumentIcon = row?.lastDocApproval && !hideSignDocumentIcon && row?.nextApproverId === user?.userId;

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.grantUniqueId || '-'}</TableCell>
        <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
        <TableCell>{row?.grantSeekerName || '-'}</TableCell>
        <TableCell>
          {getLabelByCode(masterData, 'dpwf_grant_assistance_required', row?.assistanceType) || '-'}
        </TableCell>
        <TableCell>{row?.amountRequested ? fCurrency(row?.amountRequested) : '-'}</TableCell>
        <TableCell>{row?.amountGranted ? fCurrency(row?.amountGranted) : '-'}</TableCell>
        <TableCell>{row?.accountType || '-'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              color={row?.feedbackStatus === 'FEEDBACK_REQUESTED' ? 'info' : grantStatusColorSchema[row?.status]}
              label={getGrantStatus(masterData, row?.status, row?.feedbackStatus)}
              size="small"
            />
          )}
        </TableCell>
        <TableCell>
          <Stack direction="row" justifyContent="flex-end">
            {renderAssignSelf()}
            {showEditIcon && (
              <Tooltip title="Edit" arrow>
                <IconButton onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {showLetterIcon && (
              <Tooltip title="Create Document" arrow>
                <IconButton onClick={() => route.push(`/admin/grant-request/${row?.id}/letter`)}>
                  <AcceptanceLetterIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View" arrow>
              <IconButton onClick={() => route.push(`/admin/grant-request/${row?.id}/view`)}>
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
            {showSignDocumentIcon && (
              <Tooltip title="Sign the Document" arrow>
                <IconButton onClick={() => route.push(`/admin/grant-request/${row?.id}/sign-document`)}>
                  <SignDocumentIcon />
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
            endPoint="deleteGrantByAdmin"
            deleteMessage="Are you sure you want to delete this grant request?"
            btnTitle="Delete"
            dialogTitle="Delete Grant"
            refetch={refetch}
            apiType="GRANT" // lowercase to match condition in GeneralDialog
          />
        </Dialog>
      )}
    </>
  );
}
