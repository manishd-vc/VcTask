import { TableRow as MuiTableRow, TableCell, Typography } from '@mui/material';

export default function TableRow({ label, value }) {
  return (
    <MuiTableRow>
      <TableCell>
        <Typography variant="body2" fontWeight="bold">
          {label}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{value || '-'}</Typography>
      </TableCell>
    </MuiTableRow>
  );
}
