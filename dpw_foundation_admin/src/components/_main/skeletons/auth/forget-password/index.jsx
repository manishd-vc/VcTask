// mui
import { Box, Skeleton, Stack, Typography } from '@mui/material';

/**
 * index - A component that renders skeleton loaders for various UI elements, mimicking the loading state of a page.
 *
 * @returns {JSX.Element} - A layout containing skeleton loaders for a page header and content.
 */
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
      {/* Skeleton loader for the main page title */}
      <Typography textAlign="center" variant="h5" component="h1">
        <Skeleton variant="text" />
      </Typography>

      <Stack spacing={2}>
        {/* Skeleton loader for a secondary title */}
        <Typography textAlign="center" variant="h3" component="h1">
          <Skeleton variant="text" />
        </Typography>

        {/* Skeleton loader for a rounded button */}
        <Typography variant="h1" component="h1">
          <Skeleton variant="rounded" width={100} sx={{ margin: 'auto' }} />
        </Typography>
      </Stack>
    </Box>
  );
}
