import { sum } from 'lodash';
import { useRouter } from 'next-nprogress-bar';
import { useSelector } from 'react-redux';

// mui
import { Badge, IconButton, Stack } from '@mui/material';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

/**
 * CartWidget component - Displays a cart icon with the total quantity of items in the cart.
 *
 * This component retrieves the current cart items from the Redux store and calculates
 * the total number of items in the cart. When clicked, it navigates to the cart page.
 *
 * @returns {JSX.Element} The CartWidget component with a badge displaying total items in the cart.
 */
export default function CartWidget() {
  // Retrieve the cart information from Redux store
  const {
    checkout: { cart }
  } = useSelector(({ product }) => product);

  // Get router instance for navigation
  const router = useRouter();

  // Calculate the total number of items in the cart
  const totalItems = sum(cart?.map((item) => item.quantity));

  return (
    <Stack
      onClick={() => router.push('/cart')} // Navigate to the cart page on click
      direction="row"
      spacing={1}
      alignItems="center"
      width="auto"
      sx={{
        cursor: 'pointer' // Make the widget clickable
      }}
    >
      {/* Badge to display the total number of items */}
      <Badge badgeContent={totalItems} color="primary">
        <IconButton name="cart" disableRipple color="primary">
          <HiOutlineShoppingBag />
        </IconButton>
      </Badge>
    </Stack>
  );
}

/**
 * Prop types validation to ensure proper prop structure and types.
 */
CartWidget.propTypes = {};
