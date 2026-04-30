import PropTypes from 'prop-types';

// mui
import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/**
 * RootStyle component - A flex container that aligns items to the right.
 */
const RootStyle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

/**
 * IconStyle component - Styled div representing each color preview circle.
 */
const IconStyle = styled('div')(({ theme }) => ({
  marginLeft: -4, // Slight negative margin to reduce the space between icons
  borderRadius: '50%', // Circular shape
  width: theme.spacing(2), // Width of the circle (2 spacing units)
  height: theme.spacing(2), // Height of the circle (2 spacing units)
  border: `solid 2px ${theme.palette.background.paper}`, // Border color for contrast
  boxShadow: `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}` // Subtle shadow for depth
}));

// ----------------------------------------------------------------------

/**
 * ColorPreviewGroup component - Displays a group of color previews with an optional "more" count.
 *
 * @param {Object} props - Component props
 * @param {Array} props.colors - List of colors to display as preview.
 * @param {number} [props.limit=3] - Maximum number of colors to display, remaining colors will be represented by a count.
 * @param {Object} other - Other props passed to the root container.
 *
 * @returns {JSX.Element} The ColorPreviewGroup component.
 */
ColorPreviewGroup.propTypes = {
  colors: PropTypes.array.isRequired, // List of color values
  limit: PropTypes.number // Limit of how many colors to show
};

/**
 * ColorPreviewGroup component that renders a list of color preview circles.
 * If the number of colors exceeds the limit, a "+N" indicator will be shown.
 */
export default function ColorPreviewGroup({ colors, limit = 3, ...other }) {
  // Slice the colors array based on the limit prop
  const showColor = colors.slice(0, limit);
  const moreColor = colors.length - limit;

  return (
    <RootStyle component="span" {...other}>
      {/* Render color preview circles */}
      {showColor.map((color) => (
        <IconStyle key={color} sx={{ bgcolor: color }} />
      ))}

      {/* Show the count of remaining colors if applicable */}
      {colors.length > limit && <Typography variant="subtitle2">{`+${moreColor}`}</Typography>}
    </RootStyle>
  );
}
