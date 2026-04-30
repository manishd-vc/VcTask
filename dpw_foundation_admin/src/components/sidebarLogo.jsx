import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import PropTypes from 'prop-types';
// mui
import sidebarLogo from '../../public/images/dpwf-logo.svg';

/**
 * SidebarLogo Component
 * A simple component that renders the sidebar logo as an image.
 * The logo is a static SVG file imported from the public directory and displayed using Next.js Image component.
 *
 * @param {object} props - The component props.
 * @param {object} [props.sx] - The optional styling object to customize the logo's appearance.
 * @param {boolean} [props.isMobile] - A flag to determine if the component should render in mobile-specific styles.
 *
 * @returns {JSX.Element} The rendered sidebar logo image.
 */
export const SidebarLogo = ({ sx }) => {
  const router = useRouter(); // Initialize router

  const handleLogoClick = () => {
    router.push('/admin/dashboard'); // Navigate to dashboard on click
  };
  return (
    <Image
      draggable="false" // Disables dragging for this image
      src={sidebarLogo} // Logo image source
      alt="dpwf-sidebar" // Alt text for accessibility
      static={'true'} // Static image loading for better performance (no dynamic loading behavior)
      sizes="200px" // Specifies the display size of the image (200px width)
      objectFit="cover" // Ensures the image covers the available space without distortion
      sx={sx}
      onClick={handleLogoClick}
    />
  );
};

/**
 * PropTypes validation for SidebarLogo component.
 * Ensures proper prop types are passed to the component.
 */
SidebarLogo.propTypes = {
  sx: PropTypes.object // Custom style object for overriding default styles
};

export default SidebarLogo;
