/**
 * MediaPreviewStyle function generates the styles for the MediaPreview component based on the MUI theme.
 * It defines styles for various elements within the MediaPreview, such as the image box, close icon, and overlay.
 *
 * @param {object} theme - The MUI theme object, which provides access to the current theme's values (e.g., colors, spacing).
 *
 * @returns {object} An object containing the styles for different parts of the MediaPreview component.
 */
const MediaPreviewStyle = (theme) => ({
  /**
   * Styles for the image container box, which holds the image and centers it within the box.
   */
  imageBox: {
    position: 'relative',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'Center'
  },

  /**
   * Styles for the overlay that appears above the image in the image box.
   * The overlay has a semi-transparent background.
   */
  imageBoxOverlay: {
    '&::before': {
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
      background: theme.palette.secondary.darker,
      opacity: '0.25'
    }
  },

  /**
   * Styles for the close icon placed on the image box, positioned at the top-right corner.
   */
  imageClose: {
    position: 'absolute',
    zIndex: '9',
    right: theme.spacing(0.25),
    top: theme.spacing(0.25)
  },

  /**
   * Styles for the thumbnail image, restricting its width and height while maintaining overflow.
   */
  bannerImgThumbnail: {
    width: '177px',
    height: '80px',
    overflow: 'hidden'
  },

  /**
   * Styles for the email banner preview, with a specific width, height, and padding on the Y-axis.
   */
  emailBannerPreview: {
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    overflow: 'hidden'
  },

  emailContentPreview: {
    maxWidth: 600,
    minWidth: 400,
    backgroundColor: theme.palette.backgrounds.white
  }
});

export default MediaPreviewStyle;
