import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';

const RootStyled = styled(Box)(({ theme }) => ({
  position: 'sticky', // Makes the carousel stick to the top when scrolling
  top: 156, // The top offset where the carousel should stick
  '& > .carousel-wrap': {
    // Targeting the `.carousel-wrap` inside the root Box
    width: '100%', // Ensures the carousel takes up full width
    position: 'relative', // Positions the carousel relative to its parent
    overflow: 'hidden', // Prevents content from overflowing the carousel container
    paddingTop: '100%', // Creates a square aspect ratio (100% height of the width)
    borderRadius: 0, // No rounded corners for the carousel container
    '& .motion-dev': {
      // Targeting the motion animation wrapper
      position: 'absolute', // Positions it absolutely within the `.carousel-wrap`
      width: '100%', // Full width of the parent container
      overflow: 'hidden', // Prevents overflow of content
      top: 0 // Aligns it to the top of the parent container
    },
    '& .slide-wrapper': {
      // Controls the individual slide container
      position: 'relative',
      paddingBottom: '100%', // Maintains a square aspect ratio for the slide container
      zIndex: 11, // Ensures the slide is on top of other elements
      backgroundColor: 'transparent', // Sets background to transparent
      borderRadius: 0, // No rounded corners for individual slides
      img: {
        // Styling for the images inside each slide
        borderRadius: '8px', // Adds rounded corners to images
        objectPosition: 'center', // Ensures images are centered
        border: `1px solid ${theme.palette.divider}`, // Adds a border around the images
        ...(theme.direction === 'rtl' && {
          // If the direction is right-to-left, flip the image horizontally
          '-webkit-transform': 'scaleX(-1)',
          transform: 'scaleX(-1)'
        })
      }
    },
    '& .bg-overlay': {
      // Background overlay for the carousel images
      top: 0,
      width: '100%',
      height: '100%',
      position: 'absolute', // Positions the overlay absolutely within the `.slide-wrapper`
      background: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.2) : '' // Applies a semi-transparent dark overlay in dark mode
    },
    '& .controls-wrapper': {
      // Controls the wrapper for thumbnail navigation buttons
      paddingTop: theme.spacing(2), // Adds padding to the top
      overflow: 'auto', // Allows for horizontal scrolling if necessary
      '& .controls-button': {
        // Styles for individual thumbnail control buttons
        minWidth: 60, // Minimum width for each button
        minHeight: 60, // Minimum height for each button
        position: 'relative', // Positions each control button relative
        cursor: 'pointer', // Changes the cursor to a pointer on hover
        img: {
          // Styles for the images inside the control buttons
          borderRadius: '8px', // Adds rounded corners to the control button images
          border: `2px solid ${theme.palette.divider}` // Adds a border around the control button images
        },

        '&.active': {
          // Active state for the selected control button
          img: {
            border: `2px solid ${theme.palette.primary.main}` // Changes the border color to the primary theme color when active
          }
        }
      }
    }
  }
}));

export default RootStyled;
