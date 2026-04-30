// mui
import { Box, Skeleton, Stack, Typography } from '@mui/material';

/**
 * Login - A component that renders skeleton loaders for various UI elements, mimicking the loading state of a login form.
 *
 * @returns {JSX.Element} - A layout containing skeleton loaders for the login form's title and button.
 */
export default function Login() {
  return (
    <Stack spacing={2}>
      {/* Skeleton loader for the first title */}
      <Typography textAlign="center" variant="h3" component="h1">
        <Skeleton variant="text" />
      </Typography>

      {/* Skeleton loader for the second title */}
      <Typography textAlign="center" variant="h3" component="h1">
        <Skeleton variant="text" />
      </Typography>

      {/* Skeleton loader for the button label */}
      <Box>
        <Skeleton variant="text" width={150} sx={{ ml: 'auto' }} />
      </Box>

      {/* Skeleton loader for the circular button */}
      <Typography variant="h3" component="h3">
        <Skeleton variant="rectangular" width={100} sx={{ margin: 'auto', borderRadius: '100px' }} />
      </Typography>
    </Stack>
  );
}
