// mui

/**
 * Sidebar styles based on the provided theme.
 *
 * @param {Object} theme - The MUI theme object used to style the components.
 * @returns {Object} - The styles object to be applied to the Sidebar components.
 */
const SidebarStyles = (theme) => ({
  /**
   * Styles for the sidebar drawer component.
   *
   * @property {Object} '&.MuiDrawer-root' - Targets the Drawer component.
   * @property {Object} '.MuiPaper-root' - Targets the Paper element inside the Drawer.
   * @property {Object} overflow - Sets overflow behavior for different screen sizes.
   * @property {Object} px - Applies padding to the Drawer component.
   */
  sideBarDrawer: {
    '&.MuiDrawer-root': {
      '.MuiPaper-root': {
        overflow: { xs: 'unset', md: 'unset' },
        px: 0
      }
    },
    zIndex: 1111
  },

  /**
   * Styles for the sidebar logo container.
   *
   * @property {number} paddingTop - Padding at the top of the logo.
   * @property {number} paddingBottom - Padding at the bottom of the logo.
   * @property {number} px - Horizontal padding of the logo container.
   */
  sideBarLogo: {
    paddingTop: 7,
    paddingBottom: 2,
    px: 1
  },

  /**
   * Styles for the top header logo.
   *
   * @property {Object} '& img' - Targets the image inside the logo.
   * @property {string} maxWidth - Sets the max width for the image.
   * @property {Object} breakpoints - Adjusts image size based on screen width.
   */
  topHeaderLogo: {
    '& img': {
      maxWidth: 'auto',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '165px'
      }
    }
  },
  CloseIcon: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 1201,
    display: { xs: 'flex', md: 'none' }
  },
  overLappingBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    bgcolor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 111 // Should be just below the Drawer (default is 1200)
  }
});

export default SidebarStyles;
