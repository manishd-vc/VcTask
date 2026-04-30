import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

/**
 * RootStyled is a styled Box component that is used to set specific styling
 * for a container element. It is responsive and adjusts the size of its content
 * based on the screen size.
 *
 * @returns {JSX.Element} - The styled Box component with responsive styles.
 */
const RootStyled = styled(Box)(({ theme }) => ({
  maxWidth: 500, // Maximum width of the container
  width: '100%', // Full width for responsiveness
  margin: '0 auto', // Center the container horizontally
  display: 'flex', // Use flexbox to align content
  alignItems: 'center', // Vertically center the content
  justifyContent: 'center', // Horizontally center the content

  // Styling for the SVG element inside the container
  svg: {
    width: 500, // Default width for the SVG
    height: 500 // Default height for the SVG
  },

  // Media query for smaller screens (below 'md' breakpoint)
  [theme.breakpoints.down('md')]: {
    maxWidth: 300, // Reduce max width on smaller screens
    svg: {
      width: 300, // Adjust SVG width on smaller screens
      height: 300 // Adjust SVG height on smaller screens
    }
  }
}));

export default RootStyled;
