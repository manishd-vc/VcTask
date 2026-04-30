import { Box, Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import AvailabilityTable from './AvailabilityTable';

export default function AvailabilitySection({ availability }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid item xs={12}>
      <Typography component="h4" variant="subtitle6" color="primary.main" sx={{ mb: 2 }} textTransform={'uppercase'}>
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

      <AvailabilityTable availability={availability} />
    </Grid>
  );
}
