'use client';

import { Box, Paper } from '@mui/material';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import AuthStyles from 'src/app/(user)/auth.styles';
import Scrollbar from 'src/components/Scrollbar';
RootLayout.propTypes = {
  // 'children' represents any valid React node (elements, strings, fragments, etc.)
  children: PropTypes.node.isRequired
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isRegisterPage = pathname === '/auth/register';
  return (
    // Box component with background image and responsive styles
    <Scrollbar
      sx={{
        height: 1
      }}
    >
      <Box sx={AuthStyles.authBg}>
        {/* Paper component for the main content */}

        <Paper sx={AuthStyles.Paper} className={isRegisterPage ? 'register-page' : ''}>
          {/* The children components will be rendered here */}
          {children}
        </Paper>
      </Box>
    </Scrollbar>
  );
}
