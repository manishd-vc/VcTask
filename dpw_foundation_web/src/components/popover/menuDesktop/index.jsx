import PropTypes from 'prop-types'; // Importing PropTypes for type-checking the props
// mui
import { Grid } from '@mui/material'; // Importing Grid layout from MUI
// components
import MenuDesktopList from 'src/components/lists/menuDesktopList'; // Importing MenuDesktopList component
import MenuPopover from 'src/components/popover/popover'; // Importing MenuPopover component

// MenuDesktop component to render a desktop menu
export default function MenuDesktop({ ...props }) {
  // Destructuring props
  const { isOpen, onClose, isLoading, data, scrollPosition } = props;

  return (
    <MenuPopover
      open={isOpen} // Controls whether the menu is open or not
      onClose={onClose} // Function to close the menu
      anchorReference="anchorPosition" // Using position as anchor for the popover
      anchorPosition={{
        top: scrollPosition > 100 ? 134 : 170, // Dynamic positioning based on scroll position
        left: 0 // Left position remains static
      }}
      isDesktop // Ensures the menu is rendered for desktop
      sx={{
        display: 'block!important' // Forces the menu to display block (overrides default styles)
      }}
    >
      <Grid container spacing={3}>
        {' '}
        {/* MUI Grid container for responsive layout */}
        {data?.map((parent) => {
          // Iterating over data to render each parent menu item
          return (
            <Grid item lg={2} key={`data-key_${new Date().getTime()}`}>
              {' '}
              {/* Grid item for each parent menu */}
              <MenuDesktopList parent={parent} isLoading={isLoading} onClose={onClose} />{' '}
              {/* Passing props to MenuDesktopList */}
            </Grid>
          );
        })}
      </Grid>
    </MenuPopover>
  );
}

// PropTypes validation to ensure the correct data types are passed as props
MenuDesktop.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Boolean to control whether the menu is open
  onClose: PropTypes.func.isRequired, // Function to close the menu
  isLoading: PropTypes.bool.isRequired, // Boolean to indicate if data is loading
  data: PropTypes.array, // Array of menu data (optional)
  scrollPosition: PropTypes.number.isRequired // Current scroll position for dynamic positioning
};
