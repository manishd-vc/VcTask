// Importing necessary components from MUI
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';

// Styled component for RadioGroup
const RootStyled = styled(RadioGroup)(({ theme }) => ({
  // Styling for the root element, which is the RadioGroup
  '& .main-paper': {
    width: '100%', // Set width to 100% to occupy the full container
    zIndex: 0, // Set the z-index to ensure the component layers correctly
    overflow: 'hidden', // Hide any overflowing content
    position: 'relative', // Position the element relatively for absolute children
    borderRadius: '8px', // Set border-radius to 8px for rounded corners

    // Styling for the button inside the main paper element
    '& .button': {
      display: 'block', // Make the button a block element (takes full width)
      height: 94, // Set the button height to 94px
      borderRadius: '8px', // Set border-radius for rounded corners on the button
      background: theme.palette.background.paper, // Use the background color from the theme
      '& .MuiButton-startIcon': {
        margin: '0 auto' // Center the start icon inside the button
      }
    },

    // Styling for the label element inside the main paper
    '& .label': {
      top: 0, // Position the label at the top
      margin: 0, // Remove any margin
      left: 0, // Position the label to the left
      width: '100%', // Make the label take full width
      height: '100%', // Make the label take full height
      position: 'absolute', // Position the label absolutely within the container
      cursor: 'pointer', // Set the cursor to pointer to indicate it's clickable

      // Styling for when the label has the active class
      '&.active': {
        cursor: 'initial' // Remove pointer cursor when label is active
      }
    }
  }
}));

// Export the styled RadioGroup component as RootStyled
export default RootStyled;
