import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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

export default function DocumentsRowView({ rowData = [] }) {
  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData?.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography variant="body2" color="text.secondary" textAlign={'center'} p={2}>
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
                    color: row?.fileName ? 'primary.light' : 'inherit',
                    fontWeight: 300
                  }}
                  href={row?.preSignedUrl}
                >
                  {row?.fileName || '-'}
                </Link>
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
