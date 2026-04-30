// mui
import { Skeleton, Stack, Typography } from '@mui/material';

/**
 * ResetPassword - A component that renders skeleton loaders for the reset password page content.
 *
 * @returns {JSX.Element} - A layout containing skeleton loaders for the title and a button.
 */
export default function ResetPassword() {
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
      {/* Skeleton loader for a button or action element */}
      <Typography variant="h3" component="h3">
        <Skeleton variant="rectangular" width={100} sx={{ margin: 'auto', borderRadius: '100px' }} />
      </Typography>
    </Stack>
  );
}
