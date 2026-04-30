import { Skeleton, TableCell, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * CharitableTableCellWithSkeleton is a custom table cell that either shows a Skeleton loader or displays content.
 * It supports optional truncation, wrapping, and customization via props.
 *
 * @param {Object} props - The props for the CharitableTableCellWithSkeleton component.
 * @param {boolean} props.isLoading - Determines if the skeleton loader should be shown.
 * @param {string} props.content - The content to display in the table cell.
 * @param {number} props.width - The width of the skeleton loader when isLoading is true.
 * @param {number} props.truncateLength - The length at which content should be truncated with ellipsis.
 * @param {Object} props.sx - The styles to apply to the TableCell component.
 * @param {Object} props.typographyStyle - The styles to apply to the Typography component.
 * @param {string} props.variant - The variant of the Typography component.
 * @param {string} props.component - The component type for the TableCell (e.g., 'th', 'td').
 * @param {string} props.scope - The scope for the TableCell (used with 'th' elements).
 * @param {boolean} props.noWrap - If true, the text will not wrap and will be truncated if necessary.
 * @returns {JSX.Element} The CharitableTableCellWithSkeleton component.
 */
const CharitableTableCellWithSkeleton = ({
  isLoading,
  content,
  width = 120,
  truncateLength = 40,
  sx,
  typographyStyle,
  variant,
  component = 'td',
  scope,
  noWrap = false
}) => {
  let cellContent;

  if (isLoading) {
    // Show Skeleton if loading
    cellContent = <Skeleton variant="text" width={width} />;
  } else if (truncateLength && content?.length > truncateLength) {
    // Truncate content and show tooltip if needed
    cellContent = (
      <Tooltip title={content} arrow>
        <Typography variant={variant} sx={{ ...typographyStyle }}>
          {`${content.slice(0, truncateLength)}...`}
        </Typography>
      </Tooltip>
    );
  } else {
    // Show content or '-' if empty
    cellContent = (
      <Typography variant={variant} noWrap={noWrap} sx={{ ...typographyStyle }}>
        {content || '-'}
      </Typography>
    );
  }

  return (
    <TableCell sx={{ ...sx }} component={component} scope={scope}>
      {cellContent}
    </TableCell>
  );
};

// Prop validation
CharitableTableCellWithSkeleton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  content: PropTypes.string,
  width: PropTypes.number,
  truncateLength: PropTypes.number,
  sx: PropTypes.object,
  typographyStyle: PropTypes.object,
  variant: PropTypes.string,
  component: PropTypes.string,
  scope: PropTypes.string,
  noWrap: PropTypes.bool
};

export default CharitableTableCellWithSkeleton;
