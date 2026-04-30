/**
 * Breakpoints configuration for responsive design.
 * The breakpoints define the width of the device at which the layout should adjust.
 *
 * - xs: Extra small (0px and up)
 * - sm: Small (600px and up)
 * - md: Medium (900px and up, previously 960px)
 * - lg: Large (1200px and up, previously 1280px)
 * - xl: Extra large (1536px and up, previously 1920px)
 */
const breakpoints = {
  values: {
    xs: 0, // Extra small screens (mobile devices)
    sm: 600, // Small screens (typically tablets)
    md: 900, // Medium screens (small laptops, up to 960px in older versions)
    lg: 1200, // Large screens (desktops, up to 1280px in older versions)
    xl: 1536 // Extra large screens (large desktops, up to 1920px in older versions)
  }
};

export default breakpoints;
