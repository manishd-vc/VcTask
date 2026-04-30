import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
/**
 * HeroStyle function - Defines the custom styles for the Hero section used in the slider component.
 *
 * @param {Object} theme - The Material-UI theme object to access theme properties for styling.
 *
 * @returns {Object} The custom styles object for the Hero section.
 */
const HeroStyle = (theme) => ({
  /**
   * Styles for the previous navigation icon.
   */
  prevIcon: {
    position: 'absolute', // Position it absolutely within the container.
    top: '50%', // Position it at 35% of the container height.
    transform: 'translateY(-50%)', // Center it vertically using transform.
    zIndex: '10', // Ensure it stays above other content.
    cursor: 'pointer', // Make it clickable.
    userSelect: 'none', // Prevent text selection while interacting.
    left: '20px', // Position it 20px from the left of the container.
    '& img': {
      // Style the image inside the icon.
      height: '48px', // Set the height of the image.
      width: '48px' // Set the width of the image.
    }
  },

  /**
   * Styles for the next navigation icon.
   */
  nextIcon: {
    position: 'absolute', // Position it absolutely within the container.
    top: '50%', // Position it at 35% of the container height.
    transform: 'translateY(-50%)', // Center it vertically using transform.
    zIndex: '10', // Ensure it stays above other content.
    cursor: 'pointer', // Make it clickable.
    userSelect: 'none', // Prevent text selection while interacting.
    right: '20px', // Position it 20px from the right of the container.
    '& img': {
      // Style the image inside the icon.
      height: '48px', // Set the height of the image.
      width: '48px' // Set the width of the image.
    }
  },

  /**
   * Background styles for the slider.
   */
  sliderBg: {
    backgroundSize: 'cover', // Cover the entire area with the background image.
    backgroundPosition: 'center', // Center the background image within the container.
    height: '100%', // Ensure the background fills the entire height of the container.
    width: '100%' // Ensure the background fills the entire width of the container.
  },

  /**
   * Overlay styles for the slider content.
   */
  sliderOverlay: {
    top: 0, // Position it at the top of the container.
    width: '100%', // Ensure it covers the full width of the container.
    height: '100%', // Ensure it covers the full height of the container.
    position: 'absolute', // Position it absolutely to overlay on top of the background.
    background: (theme) => theme.palette.secondary.darker, // Use a dark overlay background color.
    opacity: '0.64' // Set the opacity to slightly transparent.
  },

  /**
   * Styles for the slider content (text and buttons).
   */
  sliderContent: {
    padding: '200px 0 140px', // Add top and bottom padding to center the content.
    width: '100%', // Set the width to 100% to fill the container.
    height: '100%', // Set the height to 100% to fill the container.
    display: 'flex', // Use flexbox for layout.
    flexDirection: 'row', // Arrange content in a row.
    alignItems: 'center', // Vertically center content within the row.
    zIndex: '999', // Ensure content appears above the overlay.
    position: 'relative', // Position it relatively within the container.
    [theme.breakpoints.down('md')]: {
      // Apply these styles for screens smaller than 'md'.
      padding: '150px 0 50px' // Adjust padding for smaller screens.
    }
  }
});

export default HeroStyle;
