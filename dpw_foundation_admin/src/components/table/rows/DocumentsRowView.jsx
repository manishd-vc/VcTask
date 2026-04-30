import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';

const columns = [
  {
    id: 'documentName',
    label: 'Document Name',
    minWidth: 170
  },
  {
    id: 'purpose',
    label: 'Purpose',
    minWidth: 170
  },
  {
    id: 'type',
    label: 'Type',
    minWidth: 170
  },
  {
    id: 'uploadDate',
    label: 'Upload Date',
    minWidth: 170
  },
  {
    id: 'uploadedBy',
    label: 'Uploaded By',
    minWidth: 170
  }
];

export const columnsPartnership = [
  {
    id: 'documentName',
    label: 'Document Name'
  },
  {
    id: 'purpose',
    label: 'Purpose'
  },
  {
    id: 'documentNumber',
    label: 'Document Number'
  },
  {
    id: 'documentValidity',
    label: 'Document Validity'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'type',
    label: 'Type'
  }
];

export default function DocumentsRowView({ moduleName = '', rowData = [] }) {
  const dispatch = useDispatch();
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

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };
  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table>
        <TableHead>
          <TableRow>
            {moduleName === 'partner'
              ? columnsPartnership.map((column) => <TableCell key={column.id}>{column.label}</TableCell>)
              : columns.map((column) => (
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

          {moduleName === 'partner'
            ? rowData?.map((row) => (
                <TableRow hover key={row?.id}>
                  <TableCell>{row?.documentName || '-'}</TableCell>
                  <TableCell>{row?.documentPurpose || '-'}</TableCell>
                  <TableCell>{row?.documentNumber || '-'}</TableCell>
                  <TableCell>{fDateWithLocale(row?.documentValidity, true) || '-'}</TableCell>
                  <TableCell>{row?.status || '-'}</TableCell>
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
                </TableRow>
              ))
            : rowData?.map((row) => (
                <TableRow hover key={row?.id}>
                  <TableCell>{row?.documentName || '-'}</TableCell>
                  <TableCell>{row?.documentPurpose || '-'}</TableCell>
                  <TableCell>
                    {row?.fileName ? (
                      <Box
                        component="span"
                        sx={{
                          textDecoration: row?.fileName ? 'underline' : 'none',
                          cursor: row?.fileName ? 'pointer' : 'default',
                          color: row?.fileName ? 'primary.light' : 'inherit',
                          fontWeight: 300
                        }}
                        onClick={(e) => downloadMediaFile(e, row?.fileMetadataId)}
                      >
                        {row.fileName}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{row?.updatedAt && fDateWithLocale(row?.updatedAt, true)}</TableCell>
                  <TableCell>{row?.updatedByName || '-'}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
