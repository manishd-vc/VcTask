import {
  Box,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

export default function AvailabilitySection({ availability }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Grid item xs={12}>
        <Typography
          component="h4"
          variant="subtitle6"
          color="primary.main"
          sx={{ mb: 2 }}
          textTransform={'uppercase'}
          mt={3}
        >
          Available for volunteering?
        </Typography>

        <Box sx={{ border: (theme) => `1px solid ${theme.palette.warning.dark}`, py: 3, px: 2, mb: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row', md: 'row' }}
            flexWrap="wrap"
            divider={isDesktop && <Divider orientation="vertical" flexItem />}
            spacing={{ xs: 0, md: 3, lg: 5 }}
            rowGap={3}
          >
            <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
              <Typography variant="subtitle1" color="text.secondarydark">
                Morning:
              </Typography>
              <Typography variant="body1" color="text.secondarydark" component="p">
                5:00 AM - 11:59 AM
              </Typography>
            </Box>
            <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
              <Typography variant="subtitle1" color="text.secondarydark">
                Afternoon:
              </Typography>
              <Typography variant="body1" color="text.secondarydark" component="p">
                12:00 PM - 4:59 PM
              </Typography>
            </Box>
            <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
              <Typography variant="subtitle1" color="text.secondarydark">
                Evening:
              </Typography>
              <Typography variant="body1" color="text.secondarydark" component="p">
                5:00 PM - 8:59 PM
              </Typography>
            </Box>
            <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
              <Typography variant="subtitle1" color="text.secondarydark">
                Night:
              </Typography>
              <Typography variant="body1" color="text.secondarydark" component="p">
                9:00 PM - 4:59 AM
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
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
              {availability?.length > 0 ? (
                availability?.map((slot) => (
                  <TableRow key={slot?.id}>
                    <TableCell>
                      <Typography variant="subtitle1" color="text.secondarydark">
                        {slot?.day}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Grid container>
                        {slot?.timeSlots?.map((timeSlot) => (
                          <Grid item xs={12} sm={3} key={timeSlot} sx={{ p: 1 }}>
                            <Typography variant="body1" color="text.secondarydark">
                              {timeSlot}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      No volunteering priority added
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
