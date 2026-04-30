// Importing required components and methods from MUI
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';

// Creating a styled version of the Popover component using MUI's styled utility
const RootStyled = styled(Popover)(({ theme }) => ({
  // Styles applied to the Popover's Paper element
  '& .MuiPopover-paper': {
    marginTop: theme.spacing(1.5), // Adding a top margin of 1.5 spacing units (based on theme)
    marginLeft: theme.spacing(0.5), // Adding a left margin of 0.5 spacing units
    overflow: 'inherit', // Inheriting the overflow property to avoid clipping content
    background: theme.palette.background.paper // Applying background color from the theme's paper color
  },

  // Styles applied when the popover is displayed on desktop
  '& .is-desktop': {
    paddingLeft: theme.spacing(3), // Adding padding on the left side
    paddingRight: theme.spacing(3), // Adding padding on the right side
    paddingTop: theme.spacing(5), // Adding padding on the top side
    paddingBottom: theme.spacing(3), // Adding padding on the bottom side
    right: theme.spacing(16), // Positioning the popover from the right using spacing units
    m: 'auto', // Automatically setting the margin to center the popover
    borderRadius: theme.spacing(2), // Applying border-radius from the theme
    overflow: 'auto', // Ensuring content overflows are scrollable
    display: 'flex', // Using flexbox layout for the popover
    gap: 1, // Adding a gap between the flex items
    width: 'calc(100vw - 44px)', // Setting the width to fill the viewport minus 44px
    border: `1px solid ${theme.palette.divider}` // Applying a border with the theme's divider color
  }
}));

// Exporting the styled component
export default RootStyled;
