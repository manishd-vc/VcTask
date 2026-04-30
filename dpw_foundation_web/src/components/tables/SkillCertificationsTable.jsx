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
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import AddCertificationDialog from 'src/components/_main/profile/edit/AddCertificationDialog';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';
import { enrolmentStatusColorSchema } from 'src/utils/util';

const columns = [
  { id: 'skillTitle', label: 'Title', minWidth: 170 },
  { id: 'docNumber', label: 'Document Number', minWidth: 170 },
  { id: 'issuedDate', label: 'Issued Date', minWidth: 170 },
  { id: 'validTill', label: 'Valid Till', minWidth: 170 },
  { id: 'issuingInstitute', label: 'Issuing Institute', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'type', label: 'Type', minWidth: 170 },
  { id: 'country', label: 'Country', minWidth: 170 },
  { id: 'city', label: 'City', minWidth: 170 }
];

export default function SkillCertificationsTable({
  data = [],
  isEditable = false,
  onAdd,
  onEdit,
  onDelete,
  title = 'Skills Certifications',
  showHeader = true,
  showAddButton = true,
  maxHeight = null,
  showPaper = true,
  userData
}) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { data: countryData } = useQuery(['getCountry'], () => api.getCountry());

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

  const handleEdit = (cert) => {
    setEditData(cert);
    setDialogOpen(true);
    onEdit?.(cert);
  };

  const getCountryLabel = (countryCode) => {
    return countryData?.find((item) => item?.code === countryCode)?.label || countryCode || '-';
  };

  const getStatus = (cert) => {
    const currentDate = new Date();
    const issuedDate = cert?.issuedDate ? new Date(cert.issuedDate) : null;
    const validTill = cert?.validTill ? new Date(cert.validTill) : null;

    if (!issuedDate || !validTill) {
      return '-';
    }

    if (currentDate >= issuedDate && currentDate <= validTill) {
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
            data.map((cert, index) => (
              <TableRow key={cert?.id || index} hover>
                <TableCell>{cert?.skillTitle || cert?.title || '-'}</TableCell>
                <TableCell>{cert?.docNumber || cert?.documentNumber || '-'}</TableCell>
                <TableCell>{cert?.issuedDate ? fDateWithLocale(cert?.issuedDate) : '-'}</TableCell>
                <TableCell>{cert?.validTill ? fDateWithLocale(cert?.validTill) : '-'}</TableCell>
                <TableCell>{cert?.issuingInstitute || '-'}</TableCell>
                <TableCell>
                  {cert?.validTill ? (
                    <Chip
                      label={cert.status || getStatus(cert)}
                      color={enrolmentStatusColorSchema[cert.status || getStatus(cert)] || 'default'}
                      size="small"
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Typography component="div" variant="body2" color="text.secondarydark">
                    {cert.fileName ? (
                      <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => cert.documentImageId && download(cert.documentImageId)}
                      >
                        {cert.fileName}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </Typography>
                </TableCell>
                <TableCell>{getCountryLabel(cert.country)}</TableCell>
                <TableCell>{cert.city || '-'}</TableCell>
                {isEditable && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(cert)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(cert)}>
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
              <TableCell colSpan={isEditable ? 10 : 9} align="center">
                <Typography variant="body2" color="text.secondary" py={2}>
                  No skill certifications found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (!showPaper) {
    return tableContent;
  }

  return (
    <Box sx={{ pb: 2 }}>
      {showHeader && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            {title}
          </Typography>
          {showAddButton && (
            <Button variant="contained" size="small" onClick={handleAdd}>
              Add New Certification
            </Button>
          )}
        </Stack>
      )}
      {tableContent}
      <AddCertificationDialog
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
