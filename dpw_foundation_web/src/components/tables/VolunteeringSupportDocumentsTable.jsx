import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import AddSupportingDocumentDialog from 'src/components/_main/profile/edit/AddSupportingDocumentDialog';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';
import { enrolmentStatusColorSchema } from 'src/utils/util';

const columns = [
  { id: 'documentType', label: 'Title', minWidth: 170 },
  { id: 'documentNumber', label: 'Document Number', minWidth: 170 },
  { id: 'documentValidity', label: 'Valid Till', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'type', label: 'Type', minWidth: 170 }
];

export default function VolunteeringSupportDocumentsTable({
  data = [],
  isEditable = false,
  onAdd,
  onEdit,
  onDelete,
  title = 'Volunteering Supporting Documents',
  showHeader = true,
  showAddButton = true,
  maxHeight = null,
  userData
}) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const download = (fileId) => {
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  const handleAdd = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleEdit = (doc) => {
    if (doc) {
      setEditData(doc);
      setDialogOpen(true);
    }
  };

  const getStatus = (doc) => {
    const currentDate = new Date();
    const validTill = doc?.documentValidity ? new Date(doc.documentValidity) : null;

    if (!validTill) {
      return '-';
    }

    if (currentDate <= validTill) {
      return 'ACTIVE';
    }

    return 'INACTIVE';
  };
  const tableContent = (
    <TableContainer sx={{ maxHeight: maxHeight || 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
            {isEditable && <TableCell align="center">Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length > 0 ? (
            data.map((doc, index) => (
              <TableRow key={doc.id || index} hover>
                <TableCell>{doc.documentType || '-'}</TableCell>
                <TableCell>{doc.documentNumber || '-'}</TableCell>
                <TableCell>{doc?.documentValidity ? fDateWithLocale(doc?.documentValidity) : '-'}</TableCell>
                <TableCell>
                  {doc?.documentValidity ? (
                    <Chip
                      label={doc?.status || getStatus(doc)}
                      color={enrolmentStatusColorSchema[doc?.status || getStatus(doc)] || 'default'}
                      size="small"
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Typography component="div" variant="body2" color="text.secondarydark">
                    <Box
                      component="span"
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => doc.documentImageId && download(doc.documentImageId)}
                    >
                      {doc.fileName || '-'}
                    </Box>
                  </Typography>
                </TableCell>
                {isEditable && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(doc)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(doc)}>
                          <DeleteIconRed />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isEditable ? 6 : 5} align="center">
                <Typography variant="body2" color="text.secondary" py={2}>
                  No supporting documents found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ pb: 2 }}>
      {showHeader && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            {title}
          </Typography>
          {showAddButton && (
            <Button variant="contained" size="small" onClick={handleAdd}>
              Add New Document
            </Button>
          )}
        </Stack>
      )}
      {tableContent}
      <AddSupportingDocumentDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditData(null);
        }}
        userData={userData}
        editData={editData}
        onSave={(savedData) => {
          if (editData) {
            onEdit?.(savedData);
          } else {
            onAdd?.(savedData);
          }
        }}
      />
    </Box>
  );
}
