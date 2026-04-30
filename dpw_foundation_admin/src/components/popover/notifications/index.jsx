import React from 'react';
// mui
import { Badge, IconButton, Divider, Typography } from '@mui/material';
// icons
import { IoMdNotificationsOutline } from 'react-icons/io';

// components
import NotificationsList from 'src/components/lists/notifications'; // Custom NotificationsList component
import MenuPopover from 'src/components/popover/popover'; // Custom MenuPopover component

// ----------------------------------------------------------------------
export default function NotificationsPopover() {
  const anchorRef = React.useRef(null); // Creating a reference for the IconButton to anchor the popover

  const [open, setOpen] = React.useState(false); // State to control whether the popover is open or closed
  const [state] = React.useState({
    notifications: null, // State to hold notifications data (initially null)
    loading: true // State to indicate if the notifications are loading
  });

  // Function to handle opening the popover
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the popover
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Icon button for notifications */}
      <IconButton ref={anchorRef} color={open ? 'primary' : 'default'} onClick={handleOpen}>
        {/* Badge to show the number of notifications */}
        <Badge showZero={false} badgeContent={(!state.loading && state.notifications?.length) || 0} color="error">
          <IoMdNotificationsOutline /> {/* Icon for notifications */}
        </Badge>
      </IconButton>

      {/* MenuPopover to display the notification list */}
      <MenuPopover
        open={open} // Controls whether the popover is open
        onClose={handleClose} // Function to close the popover
        anchorEl={anchorRef.current} // The anchor element for the popover
        sx={{
          width: 360 // Setting the width of the popover
        }}
      >
        <Typography variant="subtitle1" p={2}>
          Notifications
        </Typography>
        <Divider /> {/* Divider between the title and the notifications list */}
        {/* Conditional rendering based on loading state and notifications */}
        {!state.loading && state.notifications?.length === 0 ? (
          <Typography variant="subtitle1" color="text.secondary" sx={{ p: 3 }}>
            No Notification Found {/* Message when no notifications are available */}
          </Typography>
        ) : (
          <NotificationsList loading={state.loading} notifications={state.notifications} handleClose={handleClose} /> // Rendering the notifications list
        )}
      </MenuPopover>
    </>
  );
}
