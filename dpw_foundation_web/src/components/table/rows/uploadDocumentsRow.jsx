import {
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useState } from 'react';
import DeleteUploadDocuments from 'src/components/dialog/deleteUploadDocuments';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import { fDateWithLocale } from 'src/utils/formatTime';

const columns = [
  {
    id: 'documentName',
    label: 'Document Name'
  },
  {
    id: 'purpose',
    label: 'Purpose'
  },
  {
    id: 'type',
    label: 'Type'
  },
  {
    id: 'uploadDate',
    label: 'Upload Date'
  },
  {
    id: 'uploadedBy',
    label: 'Uploaded By'
  },
  {
    id: 'actions',
    label: 'Actions'
  }
];

export default function UploadDocumentsRow({ rowData, targetEntityId, refetchDocumentsList, type = '' }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const handleOpenEdit = (document) => {
    setOpenEdit(true);
    setDocument(document);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    refetchDocumentsList();
  };

  const handleOpenDelete = (documentId) => {
    setOpenDelete(true);
    setDocumentId(documentId);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    refetchDocumentsList();
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData?.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" p={2}>
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {rowData?.map((row) => (
              <TableRow hover key={row?.id}>
                <TableCell>{row?.documentName || '-'}</TableCell>
                <TableCell>{row?.documentPurpose || '-'}</TableCell>
                <TableCell>
                  <Link
                    sx={{
                      textDecoration: row?.fileName ? 'underline' : 'none',
                      cursor: row?.fileName ? 'pointer' : 'default',
                      color: row?.fileName ? 'text.secondarydark' : 'inherit',
                      fontWeight: 300
                    }}
                    href={row?.preSignedUrl}
                  >
                    {row?.fileName || '-'}
                  </Link>
                </TableCell>
                <TableCell>{row?.updatedAt && fDateWithLocale(row?.updatedAt, true)}</TableCell>
                <TableCell>{row?.updatedByName || '-'}</TableCell>

                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDelete(row?.id)}>
                    <DeleteIconRed />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openEdit && (
        <UploadDocuments
          open={openEdit}
          onClose={handleCloseEdit}
          targetEntityId={targetEntityId}
          updateData={document}
          type={type}
        />
      )}
      {openDelete && (
        <DeleteUploadDocuments
          open={openDelete}
          onClose={handleCloseDelete}
          targetEntityId={targetEntityId}
          documentId={documentId}
          type={type}
        />
      )}
    </>
  );
}
