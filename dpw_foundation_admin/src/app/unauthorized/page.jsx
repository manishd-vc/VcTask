'use client';

// mui
import { Box, Typography } from '@mui/material';
import NoDataFoundIllustration from 'src/illustrations/dataNotFound';

// svg

import DashboardLayout from 'src/layout/_admin';
export default function UnauthorizedPage() {
  return (
    <DashboardLayout>
      <Box
        spacing={3}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}
      >
        <NoDataFoundIllustration />
        <Typography variant="h5" color="text.primary">
          unauthorized page not found
        </Typography>
        <Typography variant="body1" color="initial">
          Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or
          the page is removed.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
