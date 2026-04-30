import PropTypes from 'prop-types';

// mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Styled component for positioning the carousel controls.
 * It positions the controls at the top and bottom of the carousel with appropriate spacing.
 */
const RootStyle = styled(Box)(({ theme }) => ({
  top: 0,
  bottom: 0,
  zIndex: 9,
  height: 40,
  width: '100%',
  margin: 'auto',
  display: 'flex',
  position: 'absolute',
  padding: theme.spacing(0, 2),
  justifyContent: 'space-between'
}));

/**
 * CarouselControls component.
 * Displays the navigation controls for a carousel (previous and next buttons).
 */
CarouselControls.propTypes = {
  arrowLine: PropTypes.bool, // Optional prop to conditionally display the arrows
  onNext: PropTypes.func, // Function to handle the "next" action
  onPrevious: PropTypes.func // Function to handle the "previous" action
};

export default function CarouselControls({ ...props }) {
  const { onNext, onPrevious, ...other } = props;
  const theme = useTheme(); // Get the current theme
  const isRTL = theme.direction === 'rtl'; // Check if the layout direction is right-to-left

  return (
    <RootStyle {...other}>
      {/* Previous button: positioned to the left if in LTR, and to the right if in RTL */}
      <Fab aria-label="right" onClick={onPrevious} size="small" sx={{ position: 'absolute', left: -24 }}>
        {isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
      </Fab>

      {/* Next button: positioned to the right if in LTR, and to the left if in RTL */}
      <Fab aria-label="right" onClick={onNext} size="small" sx={{ position: 'absolute', right: -24 }}>
        {!isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
      </Fab>
    </RootStyle>
  );
}
