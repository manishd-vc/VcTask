/**
 * CommonStyle function to define reusable styles for loader components.
 *
 * This function creates a style object that is dependent on the provided theme.
 * It returns styles for a loader wrapper and the loader itself.
 *
 * @param {Object} theme - The MUI theme object used to access the theme's palette and other properties.
 * @returns {Object} A style object containing styles for the loader wrapper and loader component.
 */
export const buttonResponsiveStyle = (widthPercent) => (theme) => ({
  width: 'auto',
  [theme.breakpoints.down(419.95)]: {
    width: '100%'
  },
  '@media (min-width:420px) and (max-width:599.95px)': {
    width: widthPercent
  }
});
const CommonStyle = (theme) => ({
  /**
   * Style for the loader wrapper.
   * Sets a fixed width for the wrapper.
   */
  loaderWrapper: {
    width: '366px'
  },

  /**
   * Style for the loader component.
   * Positioned fixed to cover the entire viewport with a background color from the theme.
   * Centers the loader content both vertically and horizontally.
   */
  loaderStyle: {
    position: 'fixed', // Fixes the loader's position relative to the viewport
    height: '100vh', // Ensures the loader takes full height of the viewport
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.backgrounds.light, // Background color from the theme
    left: 0,
    width: '100%', // Full width to cover the entire screen
    display: 'flex', // Flexbox layout to center content
    alignItems: 'center', // Centers content vertically
    justifyContent: 'center', // Centers content horizontally
    zIndex: 111 // High z-index to ensure the loader appears above other elements
  },
  documentCard: {
    background: theme.palette.grey[100],
    p: 3,
    mt: 2,
    position: 'relative'
  },
  docDeleteIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 9, // Ensure the delete icon is on top of other content
    cursor: 'pointer', // Change cursor to pointer to indicate it's clickable
    '&:hover': {
      opacity: 0.8 // Slight opacity change on hover to indicate interaction
    }
  },
  topMenuHover: { fontWeight: 400, '&:hover': { borderBottom: (theme) => `2px solid ${theme.palette.warning.light}` } }
});

export default CommonStyle;
