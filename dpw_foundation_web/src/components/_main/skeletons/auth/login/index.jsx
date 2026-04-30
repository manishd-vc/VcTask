// mui
import { Box, Skeleton, Typography } from '@mui/material';
// components
import Login from './login';

export default function index() {
  return (
    <Box>
      <Typography textAlign="center" variant="h3" component="h3">
        <Skeleton variant="rounded" width={150} sx={{ margin: 'auto' }} />
      </Typography>
      <Login />
    </Box>
  );
}
