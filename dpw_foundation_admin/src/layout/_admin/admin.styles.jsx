/**
 * AdminStyle function returns an object containing custom styles
 * for the Admin layout. These styles are used for the main wrapper
 * and the main content area to manage the layout and responsiveness.
 *
 * @returns {Object} The style object for the Admin layout.
 */
const AdminStyle = () => ({
  /**
   * Styles for the main content area.
   * - Uses flexbox layout to grow the container.
   * - Ensures that overflow content is hidden.
   * - Sets the height of the container to 100% for full vertical space.
   */
  main: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%'
  },

  /**
   * Styles for the main wrapper of the content.
   * - Applies padding on the left and right based on screen size.
   * - The padding is responsive, with larger values on medium and larger screens.
   */
  mainWrapper: {
    px: { md: 9, xs: 1 }
  }
});

export default AdminStyle;
