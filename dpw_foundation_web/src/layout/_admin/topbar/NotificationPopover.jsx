import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

// mui
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';

// component
import { Popover as MenuPopover } from 'src/components/popover';
import NoDataFoundIllustration from 'src/illustrations/dataNotFound';

// icons
import { GoClock } from 'react-icons/go';
import { TbCheck, TbChecks } from 'react-icons/tb';

// api
import { NotificationIcon } from 'src/components/icons';
import useWebSocket from 'src/hooks/useWebSocket';
import * as api from 'src/services';

// ----------------------------------------------------------------------

const NotificationPopover = ({ item, onClick }) => {
  return (
    <>
      <ListItemButton
        alignItems="flex-start"
        onClick={() => {
          onClick(item);
        }}
        sx={{
          bgcolor: (theme) => (item?.opened ? theme.palette.background.paper : 'rgba(145, 158, 171, 0.08)')
        }}
      >
        <ListItemAvatar>
          <Avatar alt={item?.title.slice(3, 4) || ''} src={item?.avatar} />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography
                variant="body2"
                color="text.primary"
                dangerouslySetInnerHTML={{
                  __html: `${item?.title}`
                }}
              />

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GoClock size={14} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDistanceToNow(new Date(item?.createdAt), { enUS })}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    color: item?.opened ? 'primary.main' : 'text.secondary'
                  }}
                >
                  {item?.opened ? <TbChecks size={16} /> : <TbCheck size={16} />}
                </Box>
              </Stack>
            </React.Fragment>
          }
        />
      </ListItemButton>
      <Divider component="li" />
    </>
  );
};

const SkeletonComponent = () => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography variant="body2" color="text.primary">
                <Skeleton variant="text" />
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                  <Skeleton variant="circular" height={14} width={14} sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    <Skeleton variant="text" width={140} />
                  </Typography>
                </Stack>
                <Skeleton variant="circular" height={14} width={14} />
              </Stack>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
};
NotificationPopover.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const { user } = useSelector(({ user }) => user);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [paginationObj, setPaginationObj] = useState({
    size: 10,
    page: 0
  });
  const isLoading = false;
  const data = {
    totalUnread: 0
  };

  /**
   * Handles a new message received via WebSocket.
   * @param {Object} message - The message object from WebSocket.
   */
  const handleNewMessage = (message) => {
    let msg = message.body ? JSON.parse(message.body) : '';
    console.log(msg);
  };

  // Initialize WebSocket connection using the hook
  const { connected, subscribe } = useWebSocket();
  useEffect(() => {
    if (connected) {
      getNotificationList();
      setNotifications([]);
      setTimeout(() => {
        subscribe(`/topic/inapp/${user.userId}`, handleNewMessage);
      }, 1000);
    }
  }, [connected]);

  /**
   * Fetches the list of notifications from the API.
   */
  const getNotificationList = async () => {
    const response = await api.fetchNotifications(paginationObj);
    if (response?.data?.content) {
      setNotifications([...notifications, ...response.data.content]);
    }
  };

  /**
   * Opens the notification popover and resets pagination.
   */
  const handleOpen = () => {
    setNotifications([]);
    setPaginationObj({
      size: 10,
      page: 0
    });

    setTimeout(() => {
      getNotificationList();
    }, 1000);
    setOpen(true);
  };

  /**
   * Closes the notification popover.
   */
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton ref={anchorRef} size="large" color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={data?.totalUnread} color="error">
          <NotificationIcon />
        </Badge>
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 460 }}>
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">Notifications</Typography>
            </Box>
          </Box>

          <Divider />
          {notifications?.length < 1 ? (
            <NoDataFoundIllustration />
          ) : (
            <Box sx={{ height: { xs: 340, sm: 400, md: 460 }, overflow: 'auto' }}>
              <List disablePadding sx={{ '& .MuiListItemAvatar-root': { mt: 0 } }}>
                {notifications?.map((item) => (
                  <NotificationPopover
                    key={item.id} // Use unique notificationId as key
                    item={item}
                    onClick={() => {
                      handleClose();
                    }}
                  />
                ))}
                {(isLoading ? Array.from(new Array(7)) : []).map((v, index) => (
                  <SkeletonComponent key={index || v} />
                ))}
              </List>
              <Box textAlign="center">
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ my: 2 }}
                  size="small"
                  onClick={() => {
                    setPaginationObj((prev) => ({
                      ...prev,
                      page: prev.page + 1
                    }));
                    getNotificationList();
                  }}
                >
                  View more
                </Button>
              </Box>
            </Box>
          )}
        </>
      </MenuPopover>
    </>
  );
}
