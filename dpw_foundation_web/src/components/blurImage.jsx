'use client';
import PropTypes from 'prop-types';
import Image from 'next/image';

// mui
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * BlurImage component - Displays an image with dynamic sizing based on the screen width.
 *
 * This component renders an image with different sizes based on whether the screen size
 * is considered desktop or mobile, using the `useMediaQuery` hook from MUI. It also handles
 * the image source dynamically, adjusting the URL based on the environment variable.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.src - The image source URL.
 * @param {string} props.alt - The alt text for the image.
 * @param {boolean} [props.static] - Optional prop to mark the image as static (currently unused).
 *
 * @returns {JSX.Element} The BlurImage component with appropriate image size and source.
 */
export default function BlurImage({ ...props }) {
  // Determine if the screen is considered desktop or mobile
  const isDesktop = useMediaQuery('(min-width:600px)');

  // Return the image with adjusted size and source
  return (
    <Image
      sizes={isDesktop ? '14vw' : '50vw'} // Adjust the image size based on screen width
      {...props}
      src={process.env.IMAGE_BASE == 'LOCAL' ? `${process.env.IMAGE_URL}${props.src}` : props.src}
      alt={props.alt}
    />
  );
}

/**
 * Prop types validation for the BlurImage component.
 * Ensures the correct types for the props passed into the component.
 */
BlurImage.propTypes = {
  src: PropTypes.string.isRequired, // Image source URL
  alt: PropTypes.string.isRequired, // Alt text for the image
  static: PropTypes.bool // Optional: Static image flag (currently not in use)
};
