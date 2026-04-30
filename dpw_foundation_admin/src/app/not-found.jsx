'use client';
import { useRouter } from 'next-nprogress-bar';

// mui
import { Box, Button, Typography } from '@mui/material';

// svg
import Scrollbar from 'src/components/Scrollbar';
import NoDataFoundIllustration from 'src/illustrations/dataNotFound';

export default function NotFound() {
  const router = useRouter();
  return (
    <Scrollbar
      sx={{
        height: 1
      }}
    >
      <Box
        spacing={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={3}
        sx={{ py: 5, px: 2, textAlign: 'center' }}
      >
        <NoDataFoundIllustration />
        <Typography variant="h5" color="text.secondarydark">
          404, Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondarydark">
          Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or
          the page is removed.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" size="large" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="outlined" color="primary" onClick={() => router.push('/')} size="large">
            Go To Home
          </Button>
        </Box>
      </Box>
    </Scrollbar>
  );
}
