import {
  Box,
  Button,
  Chip,
  IconButton,
  Link,
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
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import { fDateWithLocale } from 'src/utils/formatTime';
import { enrolmentStatusColorSchema } from 'src/utils/util';
import AddSupportingDocumentDialog from '../dialog/AddSupportingDocumentDialog';
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
  userData,
  isUser = false
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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
      return 'Active';
    }

    return 'Inactive';
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
                  {doc.preSignedUrl ? (
                    <Link
                      href={doc.preSignedUrl}
                      target="_blank"
                      download
                      variant="body2"
                      underline="always"
                      sx={(theme) => ({
                        '&&': {
                          color: theme.palette.common.black,
                          fontWeight: theme.typography.fontWeightLight
                        }
                      })}
                    >
                      {doc.fileName || '-'}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {doc.fileName || '-'}
                    </Typography>
                  )}
                </TableCell>
                {(isEditable && doc?.newData) || isUser ? (
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
                ) : (
                  isEditable && <TableCell align="center">-</TableCell>
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
          {isEditable && showAddButton && (
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
