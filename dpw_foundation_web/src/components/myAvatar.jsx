import PropTypes from 'prop-types';

// mui
import { Typography } from '@mui/material';

// extend
import { MAvatar } from './@material-extend';

/**
 * MyAvatar Component
 * A custom avatar component that displays a user's profile picture or initials in a circular avatar.
 *
 * @param {object} data - The data object containing the user's avatar and name details.
 * @param {string} data.cover - The URL for the user's cover image.
 * @param {string} data.fullName - The full name of the user.
 * @param {object} other - Additional props passed to the MAvatar component.
 *
 * @returns {JSX.Element} The MyAvatar component that renders a circular avatar with the user's cover image or initials.
 */
MyAvatar.propTypes = {
  data: PropTypes.shape({
    cover: PropTypes.string, // URL to the user's cover image
    fullName: PropTypes.string // User's full name for displaying initials
  })
};

/**
 * MyAvatar Function
 * This component is used to display a user's avatar. If the `cover` is available, it will display it, otherwise,
 * it will display the first letter of the user's name.
 *
 * @param {object} props - The component props containing the `data` object and additional properties.
 *
 * @returns {JSX.Element} A circular avatar component displaying the user's profile image or initials.
 */
export default function MyAvatar({ ...props }) {
  const { data, ...other } = props; // Destructure props to extract 'data' and the rest as 'other'

  return (
    // Render the MAvatar component, displaying the user's cover image or initials as fallback
    <MAvatar src={data?.cover} alt={data?.fullName + ' cover'} color={'default'} {...other}>
      {/* Display the first letter of the user's name in a typography component */}
      <Typography variant="h1">{data?.fullName?.slice(0, 1).toUpperCase()}</Typography>
    </MAvatar>
  );
}
