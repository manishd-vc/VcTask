import { Dialog, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import { DeleteIconRed, EditIcon, ViewIcon } from 'src/components/icons';
import { checkPermissions } from 'src/utils/permissions';

export default function PartnerContactDetailsRow({ isLoading, row, onEdit, onView, refetch, partnerId }) {
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleView = () => {
    if (onView) {
      onView(row);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Check permissions for actions
  const canEdit = checkPermissions(rolesAssign, ['partner_manage']);
  const canDelete = checkPermissions(rolesAssign, ['partner_manage']);
  const canView = checkPermissions(rolesAssign, ['partner_manage', 'grant_manage']);

  if (isLoading) {
    return (
      <TableRow>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row?.contactPersonName || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row?.contactPersonDesignation || '-'}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            {row?.contactPersonEmail || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row?.contactPhoneNumber || '-'}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row?.isPrimaryContact ? 'Yes' : 'No'}</Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            {canEdit && (
              <Tooltip title="Edit" arrow>
                <IconButton onClick={handleEdit} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {canView && (
              <Tooltip title="View" arrow>
                <IconButton onClick={handleView} size="small">
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {canDelete && (
              <Tooltip title="Delete" arrow>
                <IconButton onClick={handleDelete} size="small">
                  <DeleteIconRed fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      {openDeleteDialog && (
        <Dialog onClose={handleCloseDeleteDialog} open={openDeleteDialog} maxWidth="xs">
          <GeneralDialog
            id={row?.id}
            onClose={handleCloseDeleteDialog}
            endPoint="deletePartnerContactByAdmin"
            deleteMessage="Are you sure you want to perform this action?"
            btnTitle="Confirm"
            dialogTitle="Confirm"
            cancelBtnTitle="Cancel"
            refetch={refetch}
            apiType="PARTNER"
            payload={{ partnerId, contactId: row?.id }}
          />
        </Dialog>
      )}
    </>
  );
}
