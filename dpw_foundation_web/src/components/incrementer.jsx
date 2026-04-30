// mui
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// mui
import { Fab, Stack, Typography } from '@mui/material';

// icons
import { IoIosAdd, IoIosRemove } from 'react-icons/io';

/**
 * IncrementerStyle Component
 * A styled div component that provides a flex container with alignment and padding.
 *
 * @returns {JSX.Element} A styled container for the incrementer component.
 */
const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0.75) // Apply padding for spacing between the components
}));

/**
 * Incrementer Component
 * A component to manage quantity selection with increment and decrement functionality.
 * Displays available quantity and current selection with interactive buttons for increasing or decreasing the quantity.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.available - The total available quantity.
 * @param {number} props.quantity - The current selected quantity.
 * @param {Function} props.onIncrease - The function called when the increment button is clicked.
 * @param {Function} props.onDecrease - The function called when the decrement button is clicked.
 *
 * @returns {JSX.Element} The incrementer component with buttons and available quantity text.
 */
function Incrementer({ ...props }) {
  const { available, quantity, onIncrease, onDecrease } = props; // Destructure props for easier access

  return (
    <Stack sx={{ width: 96, mb: 0 }}>
      {/* Container for the decrement and increment buttons, with the current quantity in the center */}
      <IncrementerStyle>
        {/* Decrease button */}
        <Fab
          size="small"
          color="primary"
          onClick={onDecrease}
          disabled={quantity <= 1} // Disable the button if quantity is 1 or less
          sx={{
            width: 26, // Set fixed width
            maxHeight: 26,
            minHeight: 'auto' // Ensure the height is automatically adjusted
          }}
        >
          <IoIosRemove size={16} /> {/* Decrease icon */}
        </Fab>

        {/* Display current quantity */}
        {quantity}

        {/* Increase button */}
        <Fab
          size="small"
          color="primary"
          onClick={onIncrease}
          disabled={quantity >= available} // Disable the button if quantity exceeds available
          sx={{
            width: 26, // Set fixed width
            maxHeight: 26,
            minHeight: 'auto' // Ensure the height is automatically adjusted
          }}
        >
          <IoIosAdd size={16} /> {/* Increase icon */}
        </Fab>
      </IncrementerStyle>

      {/* Available quantity label */}
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Available: {available}
      </Typography>
    </Stack>
  );
}

// Prop type validation
Incrementer.propTypes = {
  available: PropTypes.number.isRequired, // Ensure available is a number
  quantity: PropTypes.number.isRequired, // Ensure quantity is a number
  onIncrease: PropTypes.func.isRequired, // Ensure onIncrease is a function
  onDecrease: PropTypes.func.isRequired // Ensure onDecrease is a function
};

export default Incrementer;
