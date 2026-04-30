import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import Image from 'next/image';
import PropTypes from 'prop-types';
import MediaPreviewStyle from './mediaPreview.styles';

/**
 * MediaPreview component is used to display a media item (e.g., image or video) with options for removal and overlay.
 * It handles the rendering of the media and provides an optional close icon and overlay effect.
 *
 * @param {object} props - The props passed to the MediaPreview component.
 * @param {string} props.src - The source URL of the media to be displayed (e.g., image or video URL).
 * @param {function} props.onRemove - A function to call when the media is removed.
 * @param {boolean} [props.isCloseIcon=true] - Boolean flag to determine whether the close icon is shown. Defaults to true.
 * @param {boolean} [props.isOverlay=false] - Boolean flag to determine whether an overlay effect is applied. Defaults to false.
 * @param {object} [props...otherProps] - Any additional props passed to the component.
 *
 * @returns {JSX.Element} The rendered MediaPreview component with media content and optional controls.
 */
const MediaPreview = ({ src, onRemove, isCloseIcon = true, isOverlay = false, ...props }) => {
  const theme = useTheme(); // Get the current theme from MUI's useTheme hook
  const styles = MediaPreviewStyle(theme); // Apply styles based on the theme

  // Component JSX rendering logic here
  return (
    <Box
      sx={{
        ...styles.imageBox,
        ...(isOverlay && styles.imageBoxOverlay)
      }}
    >
      <Image src={src} alt="Image Preview" unoptimized={true} {...props} />
      {isCloseIcon && (
        <Tooltip title="Remove" arrow>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            sx={styles.imageClose}
          >
            <CloseIcon sx={{ color: 'white' }} fontSize="medium" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

MediaPreview.propTypes = {
  // 'src' is a string representing the source URL of the media (e.g., image/video URL)
  src: PropTypes.string.isRequired,

  // 'onRemove' is a function to handle the removal of the media
  onRemove: PropTypes.func.isRequired,

  // 'isCloseIcon' is a boolean to determine if the close icon should be displayed (defaults to true)
  isCloseIcon: PropTypes.bool,

  // 'isOverlay' is a boolean indicating whether the overlay effect should be applied (defaults to false)
  isOverlay: PropTypes.bool
};

export default MediaPreview;
