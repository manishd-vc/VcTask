// mui
import { Box, Skeleton, Typography } from '@mui/material';
// components
import Login from './login';

/**
 * Index - A component that renders a skeleton loader for the title and includes the Login component.
 *
 * @returns {JSX.Element} - A layout containing a skeleton loader for the title and the Login component.
 */
export default function Index() {
  return (
    <Box>
      {/* Skeleton loader for the title */}
      <Typography textAlign="center" variant="h3" component="h3">
        <Skeleton variant="rounded" width={150} sx={{ margin: 'auto' }} />
      </Typography>
      {/* Login component */}
      <Login />
    </Box>
  );
}
