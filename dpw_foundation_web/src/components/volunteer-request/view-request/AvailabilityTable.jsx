import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export default function AvailabilityTable({ availability = [] }) {
  return (
    <TableContainer component={Box}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: { xs: '100px', sm: '120px', md: '160px', lg: '180px' } }}>Days</TableCell>
            <TableCell>
              <Grid container>
                <Grid item xs={12} sm={3} sx={{ px: 1 }}>
                  Time
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {availability.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Typography variant="subtitle1" color="text.secondarydark">
                  {item.day}
                </Typography>
              </TableCell>
              <TableCell>
                <Grid container>
                  {item?.timeSlots?.map((timeSlot) => (
                    <Grid item xs={12} sm={3} key={timeSlot} sx={{ p: 1 }}>
                      <Typography variant="body1" color="text.secondarydark">
                        {timeSlot}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </TableCell>
            </TableRow>
          ))}
          {availability.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="body2" color="text.secondary" textAlign={'center'} p={2}>
                  No data found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
