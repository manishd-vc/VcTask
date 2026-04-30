import Image from 'next/image';
// MUI Components
import { Box } from '@mui/material';
// Styles
import LoginStyle from 'src/app/(user)/login.styles';
// Assets
import logoImage from '../../public/images/dpwf-login-logo.svg';

/**
 * Logo Component
 *
 * Renders a styled logo image using the Material-UI Box component and the Next.js Image component.
 *
 * @returns {JSX.Element} - A styled logo image.
 */
export const Logo = () => {
  return (
    <Box sx={LoginStyle.logoStyle}>
      {/* Next.js Image component for optimized image rendering */}
      <Image draggable="false" src={logoImage} alt="dpwf-login" static sizes="135px" objectFit="cover" />
    </Box>
  );
};

// Define PropTypes for the Logo component
Logo.propTypes = {};

export default Logo;
