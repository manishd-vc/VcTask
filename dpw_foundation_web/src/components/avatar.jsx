import PropTypes from 'prop-types';
import Image from 'next/image';
// mui
import { Box } from '@mui/material';

/**
 * BlurImageAvatar component - Renders a circular user avatar with a blurred effect.
 *
 * This component is used to display a circular avatar image, utilizing the Next.js `Image`
 * component for optimal image performance. The image is made to cover the full size of the
 * container with a `fill` layout and `objectFit="cover"` to maintain aspect ratio while
 * filling the box.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.src - The image source URL for the avatar.
 *
 * @returns {JSX.Element} The Avatar image inside a circular container.
 */
export default function BlurImageAvatar({ ...props }) {
  return (
    <Box
      sx={{
        position: 'relative', // Ensure the Box container is relative for positioning the image
        height: 40, // Set a fixed height for the avatar
        width: 40, // Set a fixed width for the avatar
        borderRadius: '50%', // Make the Box container circular
        overflow: 'hidden', // Hide overflowed parts of the image to maintain a circle
        ...props // Spread other props passed to Box for customization
      }}
    >
      <Image
        src={props.src}
        alt="user avatar"
        layout="fill" // Make the image fill the entire container
        objectFit="cover" // Maintain aspect ratio while filling the container
        {...props} // Spread other props for additional customization
      />
    </Box>
  );
}

/**
 * Prop types validation for the BlurImageAvatar component.
 * Ensures the correct types for the props passed into the component.
 */
BlurImageAvatar.propTypes = {
  src: PropTypes.string.isRequired // Image source URL for the avatar
};
