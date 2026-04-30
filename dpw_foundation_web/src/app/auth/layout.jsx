'use client';

import { Box, Paper } from '@mui/material';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import LogoVertical from 'src/components/logoVertical';
import Scrollbar from 'src/components/Scrollbar';
import AuthStyles from './auth.styles';

RootLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isRegisterPage = pathname === '/auth/register';
  return (
    <Scrollbar
      sx={{
        height: 1
      }}
    >
      <Box sx={AuthStyles.authBg}>
        <Paper sx={AuthStyles.Paper} className={isRegisterPage ? 'register-page' : ''}>
          <Box textAlign="center">
            <LogoVertical />
          </Box>
          {children}
        </Paper>
      </Box>
    </Scrollbar>
  );
}
