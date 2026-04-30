'use client';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
// mui
import { Box } from '@mui/material';
import logoVertical from '../../public/images/logo-vertical.svg';

/**
 * LogoVertical Component
 * This component displays a vertical logo and navigates to the homepage when clicked.
 *
 * @returns {JSX.Element} A clickable logo component that redirects to the homepage.
 */
export const LogoVertical = () => {
  const { push } = useRouter(); // Access the router for navigation

  return (
    // Box component that wraps the logo image, making it clickable
    <Box
      sx={{
        img: {
          cursor: 'pointer', // Change cursor to pointer when hovering over the image
          width: '135px', // Set fixed width for the logo
          height: 'auto' // Maintain aspect ratio of the image
        }
      }}
      onClick={() => push('/')} // Redirect to the homepage when clicked
    >
      {/* Render the logo image */}
      <Image draggable="false" src={logoVertical} alt="DPW Foun" static="true" sizes="200px" objectFit="cover" />
    </Box>
  );
};

/**
 * PropTypes for LogoVertical Component
 * Ensures proper validation for the props passed to the LogoVertical component.
 */
LogoVertical.propTypes = {};

export default LogoVertical;
