import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function AvailabilityList({ userData }) {
  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: { xs: '100px', sm: '120px', md: '160px', lg: '180px' } }}>
              <Typography variant="subtitle1">Days</Typography>
            </TableCell>
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
          {days.map((day) => {
            const selectedDay = userData?.find((item) => item.day === day);
            if (!selectedDay?.timeSlots?.length) return null;
            return (
              <TableRow key={day}>
                <TableCell>
                  <Typography variant="subtitle1">{day}</Typography>
                </TableCell>
                <TableCell>
                  <Grid container>
                    {timeSlots.map((slot) =>
                      selectedDay.timeSlots.includes(slot) ? (
                        <Grid item xs={12} sm={3} key={slot} sx={{ p: 1 }}>
                          <Typography variant="body1" color="text.secondarydark">
                            {slot}
                          </Typography>
                        </Grid>
                      ) : null
                    )}
                  </Grid>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
