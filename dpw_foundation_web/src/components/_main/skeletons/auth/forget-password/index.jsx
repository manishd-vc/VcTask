// mui
import { Box, Skeleton, Stack, Typography } from '@mui/material';

export default function index() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Typography textAlign="center" variant="h5" component="h1">
        <Skeleton variant="text" />
      </Typography>
      <Stack spacing={2}>
        <Typography textAlign="center" variant="h3" component="h1">
          <Skeleton variant="text" />
        </Typography>

        <Typography variant="h1" component="h1">
          <Skeleton variant="rounded" width={100} sx={{ margin: 'auto' }} />
        </Typography>
      </Stack>
    </Box>
  );
}
