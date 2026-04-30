// PropTypes for type-checking the incoming props
import PropTypes from 'prop-types';
import RootStyled from './styled'; // Importing the styled component for MenuPopover

// Defining the expected prop types for MenuPopover component
MenuPopover.propTypes = {
  open: PropTypes.bool.isRequired, // open (boolean) determines if the popover is open or closed
  sx: PropTypes.object, // sx (optional object) for additional styling
  isDesktop: PropTypes.bool.isRequired, // isDesktop (boolean) determines if the device is desktop or not
  children: PropTypes.node.isRequired // children (node) are the elements that will be rendered inside the popover
};

export default function MenuPopover({ ...props }) {
  // Destructuring the props for use in the component
  const { children, open, sx, isDesktop, ...other } = props;

  return (
    <RootStyled
      // The anchor position is determined based on whether it's a desktop device or not
      anchorOrigin={{
        vertical: 'bottom', // The popover opens from the bottom
        horizontal: isDesktop ? 'center' : 'right' // On desktop, the popover opens at the center, on mobile (or non-desktop) it opens at the right
      }}
      transformOrigin={{
        vertical: 'top', // The popover transforms from the top
        horizontal: isDesktop ? 'center' : 'right' // On desktop, it transforms from the center, on mobile it transforms from the right
      }}
      open={open} // Control the visibility of the popover
      {...other} // Spread the remaining props into the component
      PaperProps={{
        // Class applied if it's a desktop to handle specific desktop styling
        className: isDesktop && 'is-desktop',
        sx: {
          ...sx // Merge additional styles passed through sx prop
        }
      }}
    >
      {children}
    </RootStyled>
  );
}
