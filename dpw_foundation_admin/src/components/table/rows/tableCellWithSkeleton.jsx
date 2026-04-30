import { Skeleton, TableCell, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * TableCellWithSkeleton Component
 *
 * This component renders a table cell with a skeleton loader while data is being fetched.
 * If the content is provided and it's not loading, it displays the content in a truncated form
 * with a tooltip when necessary. If the content is empty, it shows a fallback value ('-').
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isLoading - Indicates if the data is still loading.
 * @param {string} props.content - The content to display inside the table cell.
 * @param {number} [props.width=120] - The width of the skeleton loader.
 * @param {number} [props.truncateLength] - The length at which the content should be truncated.
 * @param {Object} [props.sx] - Additional styles for the TableCell.
 * @param {Object} [props.typographyStyle] - Styles to be applied to the Typography.
 *
 * @returns {JSX.Element} The rendered TableCell with either a skeleton or content.
 */
export const TableCellWithSkeleton = ({
  isLoading = false,
  content = '',
  width = 120,
  truncateLength = undefined,
  sx = {},
  typographyStyle = {}
}) => {
  let cellContent;

  if (isLoading) {
    // Show Skeleton if loading
    cellContent = <Skeleton variant="text" width={width} />;
  } else if (truncateLength && content?.length > truncateLength) {
    // Truncate content and show tooltip if needed
    cellContent = (
      <Tooltip title={content} arrow>
        <Typography sx={{ ...typographyStyle }}>{`${content.slice(0, truncateLength)}...`}</Typography>
      </Tooltip>
    );
  } else {
    // Show content or '-' if empty
    cellContent = <Typography sx={{ ...typographyStyle }}>{content || '-'}</Typography>;
  }

  return <TableCell sx={{ ...sx }}>{cellContent}</TableCell>;
};

// PropTypes validation
TableCellWithSkeleton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  content: PropTypes.string,
  width: PropTypes.number,
  truncateLength: PropTypes.number,
  sx: PropTypes.object,
  typographyStyle: PropTypes.object
};
