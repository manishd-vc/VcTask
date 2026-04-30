// mui
import { Box, Skeleton, Typography } from '@mui/material';
// component
import ResetPassword from './reset-password';

/**
 * Index - A component that displays a skeleton loader for the title text and renders the ResetPassword component.
 *
 * @returns {JSX.Element} - The component displaying a loading skeleton and the ResetPassword form.
 */
export default function Index() {
  return (
    <Box
      sx={{
        borderRadius: '0', // Remove border-radius
        display: 'flex', // Flexbox for layout
        flexDirection: 'column', // Stack elements vertically
        justifyContent: 'center', // Center content vertically
        p: 3 // Padding around the container
      }}
    >
      <Typography textAlign="center" variant="h1" component="h1">
        {/* Skeleton loader for the title text */}
        <Skeleton variant="text" width={150} sx={{ margin: 'auto' }} />
      </Typography>
      {/* ResetPassword component */}
      <ResetPassword />
    </Box>
  );
}
