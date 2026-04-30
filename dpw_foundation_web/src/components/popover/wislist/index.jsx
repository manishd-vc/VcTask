// react
import { useRouter } from 'next-nprogress-bar'; // For navigation in Next.js

// mui
import { IconButton, Stack, Typography, alpha } from '@mui/material'; // MUI components
import { IoMdHeartEmpty } from 'react-icons/io'; // Heart icon from react-icons
import { useSelector } from 'react-redux'; // For accessing the Redux store

// PropTypes for type checking
WishlistPopover.propTypes = {};

// ----------------------------------------------------------------------
export default function WishlistPopover() {
  const router = useRouter(); // Next.js router for navigation

  // Accessing 'wishlist' and 'isAuthenticated' from the Redux store
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);

  return (
    <>
      {/* Stack container for the Wishlist icon and text */}
      <Stack
        direction="row" // Layout direction of the stack (horizontal)
        alignItems="center" // Vertically aligns the items in the center
        width="auto" // Sets the width to auto
        sx={{ cursor: 'pointer' }} // Makes the whole area clickable
        onClick={() => {
          // If user is not authenticated, redirect to login page
          if (!isAuthenticated) {
            router.push('/auth/login');
          } else {
            router.push('/profile/wishlist'); // Otherwise, go to the wishlist page
          }
        }}
        spacing={1} // Spacing between the elements inside the stack
      >
        {/* Wishlist icon button */}
        <IconButton
          name="wishlist"
          color="primary" // Icon color
          disableRipple // Disables the ripple effect on click
          sx={{
            ml: 1, // Adds margin left
            borderColor: 'primary', // Border color set to primary color
            borderWidth: 1, // Border width
            borderStyle: 'solid', // Solid border style
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) // Background color with alpha transparency
          }}
          onClick={() => {
            // Navigates to login or wishlist page based on authentication status
            if (!isAuthenticated) {
              router.push('/auth/login');
            } else {
              router.push('/profile/wishlist');
            }
          }}
        >
          {/* Heart icon from react-icons */}
          <IoMdHeartEmpty />
        </IconButton>

        {/* Text information about the Wishlist */}
        <Stack>
          <Typography variant="subtitle2" color="text.primary" mb={-0.6}>
            Wishlist
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {wishlist?.length || 0} {wishlist?.length > 1 ? 'Items' : 'Item'}{' '}
            {/* Displays number of items in the wishlist */}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
