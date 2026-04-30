'use client';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import PropTypes from 'prop-types';
import logoImageWhite from '../../public/images/logo-white.svg';
import logoImage from '../../public/images/logo.svg';
// mui
import { Box } from '@mui/material';

/**
 * Logo Component
 * Displays a logo based on the `logoType` prop, either in white or default color.
 * The logo is clickable and redirects to the homepage when clicked.
 *
 * @param {object} props - The component props.
 * @param {string} props.logoType - Type of the logo to display ('white' or 'default').
 * @returns {JSX.Element} A clickable logo component that redirects to the homepage.
 */
export const Logo = ({ logoType }) => {
  const { push } = useRouter(); // Use the router to navigate to the homepage
  const logoSrc = logoType === 'white' ? logoImageWhite : logoImage; // Choose logo source based on the logoType prop

  return (
    // Box component that wraps the logo and makes it clickable
    <Box className="brand-logo" sx={{ cursor: 'pointer' }} onClick={() => push('/')}>
      {/* Render the selected logo image */}
      <Image
        draggable="false" // Disable dragging of the image
        src={logoSrc} // Dynamic logo source based on the logoType
        alt="DP World Foundation" // Alt text for accessibility
        static="true"
        style={{ maxWidth: '136px', height: 'auto' }} // Make logo responsive
        objectFit="cover" // Ensure the image covers the Box element while maintaining aspect ratio
      />
    </Box>
  );
};

/**
 * PropTypes for Logo Component
 * Ensures proper validation for the props passed to the Logo component.
 */
Logo.propTypes = {
  logoType: PropTypes.string // Logo type, either 'white' or 'default'
};

export default Logo;
