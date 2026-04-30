'use client';
import { Dialog, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GeneralDialog from 'src/components/dialog/approval';
import { DeleteIconRed, EditIcon } from 'src/components/icons';

export default function AllReportsRow({ row, refetch }) {
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowId, setRowId] = useState('');
  const handleDeleteClick = (id) => {
    setOpenDeleteDialog(true);
    setRowId(id);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditClick = () => {
    router.push(`/admin/report-management/${row?.id}/edit`);
  };

  return (
    <>
      <>
        <TableRow hover>
          <TableCell>{row?.reportFilterUniqueId}</TableCell>
          <TableCell>{row?.reportName}</TableCell>
          <TableCell>{row?.reportModuleName}</TableCell>
          <TableCell>{row?.createdOn}</TableCell>
          <TableCell>{row?.createdBy}</TableCell>
          <TableCell align="right">
            <Stack direction="row" justifyContent="center">
              <Tooltip title="Edit" arrow>
                <IconButton onClick={handleEditClick}>
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete" arrow>
                <IconButton onClick={() => handleDeleteClick(row?.id)}>
                  <DeleteIconRed />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        </TableRow>
        {openDeleteDialog && (
          <Dialog onClose={handleClose} open={openDeleteDialog} maxWidth="xs">
            <GeneralDialog
              id={rowId}
              onClose={handleClose}
              endPoint="deleteReport"
              deleteMessage="Are you sure you want to delete this report?"
              btnTitle="Delete"
              dialogTitle="Delete Report"
              apiType="REPORT"
              refetch={refetch}
            />
          </Dialog>
        )}
      </>
    </>
  );
}
