// mui
import { Box, Skeleton, Stack, Typography } from '@mui/material';

export default function Login() {
  return (
    <Stack spacing={2}>
      <Typography textAlign="center" variant="h3" component="h1">
        <Skeleton variant="text" />
      </Typography>
      <Typography textAlign="center" variant="h3" component="h1">
        <Skeleton variant="text" />
      </Typography>
      <Box>
        <Skeleton variant="text" width={150} sx={{ ml: 'auto' }} />
      </Box>
      <Typography variant="h3" component="h3">
        <Skeleton variant="rectangular" width={100} sx={{ margin: 'auto', borderRadius: '100px' }} />
      </Typography>
    </Stack>
  );
}
