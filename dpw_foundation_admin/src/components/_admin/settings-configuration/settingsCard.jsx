import PropTypes from 'prop-types';
// mui imports
import { Card, CardContent, Skeleton, Typography } from '@mui/material';

// DailyEarning component prop types validation
DailyEaring.propTypes = {
  title: PropTypes.string.isRequired, // Title of the daily earning card
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Value representing the daily earning
  isLoading: PropTypes.bool.isRequired, // Flag to indicate loading state
  color: PropTypes.string.isRequired // Color for the card (required)
};

/**
 * DailyEarning component displays a card showing the daily earning details.
 * It shows loading skeletons if the data is being fetched.
 *
 * @param {string} title - The title of the daily earning item.
 * @param {string|number} value - The value representing the daily earning amount.
 * @param {boolean} isLoading - Indicates if the data is still loading.
 * @param {boolean} [isAmount=false] - Optional flag to format the value as an amount.
 * @param {React.ReactNode} [icon=null] - Optional icon to display in the card.
 * @param {string} color - The color scheme for the card.
 *
 * @returns {JSX.Element} The DailyEarning component, a card displaying the title and value, with loading skeletons when necessary.
 */
export default function DailyEaring({ title, value, isLoading, color, valueColor }) {
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: color || 'defaultColor' // Apply the passed color or fallback to default
      }}
    >
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
          {isLoading ? <Skeleton variant="text" width="100px" /> : title}
        </Typography>
        {/* Value */}
        <Typography variant="h9" color={valueColor || 'primary.light'} component="h5">
          {isLoading ? <Skeleton variant="text" width="100px" /> : value}
        </Typography>
      </CardContent>
    </Card>
  );
}
