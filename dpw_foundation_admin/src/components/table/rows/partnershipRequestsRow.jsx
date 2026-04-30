import { Chip, Dialog, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
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
import { resetStep } from 'src/redux/slices/stepper';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateShortMonth } from 'src/utils/formatTime';
import { getPartnershipStatus } from 'src/utils/getPartnershipStatus';
import { checkPermissions } from 'src/utils/permissions';
import { partnershipStatusColorSchema } from 'src/utils/util';

export default function PartnershipRequestsRow({ isLoading, row, handleClickOpen, refetch }) {
  const route = useRouter();
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const user = useSelector((state) => state?.user?.user);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Fetching country data using a query
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const canPick = checkPermissions(rolesAssign, ['partner_manage_admin_manage']);
  const renderAssignSelf = () => {
    if (canPick) {
      if (!row?.assignTo) {
        return (
          <Tooltip title="Assign To Self" arrow>
            <IconButton onClick={() => handleClickOpen(row.id, 'assign')}>
              <AssignToSelf />
            </IconButton>
          </Tooltip>
        );
      } else if (!row?.adminAssignTo && row?.status === 'IN_PROGRESS_DOC_CREATION') {
        return (
          <Tooltip title="Assign To Self" arrow>
            <IconButton onClick={() => handleClickOpen(row.id, 'admin-assign')}>
              <AssignToSelf />
            </IconButton>
          </Tooltip>
        );
      }
    }
  };

  const handleEdit = () => {
    dispatch(resetStep());
    route.push(`/admin/partnership-request/${row?.id}`);
  };
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const showEditIcon =
    (row?.assignTo === user?.userId && row?.status === 'IN_PROGRESS_ASSESSMENT') || row?.status === 'DRAFT';

  const showLetterIcon = row?.status === 'IN_PROGRESS_DOC_CREATION' && row?.adminAssignTo === user?.userId;

  const hideSignDocumentIcon = row?.status === 'IN_PROGRESS_DOC_CREATION' || row?.status === 'APPROVED';

  const showSignDocumentIcon =
    row?.status !== 'REJECTED_DOC_REQUEST' &&
    row?.lastDocApproval &&
    !hideSignDocumentIcon &&
    row?.nextApproverId === user?.userId;
  const countryLabel = country?.find((item) => item?.code === row?.country)?.label;

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.partnershipUniqueId || '-'}</TableCell>
        <TableCell>{row?.partnerSeekerName || '-'}</TableCell>
        <TableCell>{row?.email || '-'}</TableCell>
        <TableCell>{countryLabel || '-'}</TableCell>
        <TableCell>{row?.startDate ? fDateShortMonth(row?.startDate, true) : '-'}</TableCell>
        <TableCell>{row?.endDate ? fDateShortMonth(row?.endDate, true) : '-'}</TableCell>
        <TableCell>{row?.projects || '-'}</TableCell>
        <TableCell>{getLabelByCode(masterData, 'dpwf_partner_agreement_type', row?.agreementType) || '-'}</TableCell>
        <TableCell>{row?.reports || '-'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              color={row?.feedbackStatus === 'FEEDBACK_REQUESTED' ? 'info' : partnershipStatusColorSchema[row?.status]}
              label={getPartnershipStatus(masterData, row?.status, row?.feedbackStatus)}
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
              <Tooltip title="Create Agreement" arrow>
                <IconButton onClick={() => route.push(`/admin/partnership-request/${row?.id}/letter`)}>
                  <AcceptanceLetterIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View" arrow>
              <IconButton onClick={() => route.push(`/admin/partnership-request/${row?.id}/view`)}>
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
                <IconButton onClick={() => route.push(`/admin/partnership-request/${row?.id}/sign-document`)}>
                  <SignDocumentIcon />
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
            endPoint="deletePartnerByAdmin"
            deleteMessage="Are you sure you want to delete Partnership request?"
            btnTitle="delete"
            dialogTitle="Confirm"
            refetch={refetch}
            apiType="PARTNER" // lowercase to match condition in GeneralDialog
          />
        </Dialog>
      )}
    </>
  );
}
