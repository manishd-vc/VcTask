import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// mui
import {
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
import { NotificationIcon } from 'src/components/icons';

// api
import { useRouter } from 'next-nprogress-bar';
import { useSelector } from 'react-redux';
import useWebSocket from 'src/hooks/useWebSocket';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';

/**
 * Helper function to get color based on the notification title.
 * @param {string} title - The title of the notification.
 * @returns {string} The color associated with the title.
 */
const getColorByTitle = (title) => {
  switch (title) {
    case 'Approved':
      return '#4AA359';
    case 'Rejected':
      return '#B72015';
    case 'Approval Request':
      return '#3230BE';
    case 'Need More Information':
      return '#FFD300';
    default:
      return '#000';
  }
};

/**
 * Component representing individual notification items within the notification list.
 *
 * @param {Object} item - The notification item.
 * @param {Function} onClick - Function to handle click on notification.
 * @returns {JSX.Element} The notification item rendered as a list item.
 */
const NotificationPopover = ({ item, onClick }) => {
  const titleColor = getColorByTitle(item?.title);
  return (
    <>
      <ListItemButton
        alignItems="center"
        onClick={() => {
          onClick(item);
        }}
        sx={{
          bgcolor: (theme) => (item?.opened ? theme.palette.background.default : '#fff'),
          pt: 2,
          pb: 2,
          pr: 3
        }}
      >
        <ListItemAvatar sx={{ pl: 1, pr: 1 }}>
          <NotificationIcon />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <React.Fragment>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant="body2"
                  color={titleColor}
                  dangerouslySetInnerHTML={{
                    __html: `${item?.title}`
                  }}
                  sx={{ fontSize: '18px', fontWeight: '500' }}
                />
                <Typography variant="body2" color="#7E6F6F" fontSize={16}>
                  {item?.deliveredAt ? fDateWithLocale(new Date(item.deliveredAt)) : ''}
                </Typography>
              </Box>
              <Typography variant="body2" color="#0F0F19" fontSize={16} sx={{ marginTop: '10px' }}>
                {item?.message}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItemButton>
      <Divider component="li" />
    </>
  );
};

/**
 * Skeleton component used to display loading placeholders while data is being fetched.
 * @returns {JSX.Element} A skeleton placeholder for a notification.
 */
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

/**
 * Main component for displaying notifications in a popover.
 *
 * @returns {JSX.Element} The notifications popover component.
 */
export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const router = useRouter();
  const { user } = useSelector(({ user }) => user);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationObj, setPaginationObj] = useState({
    size: 10,
    page: 0
  });
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNextPage: false,
    isLastPage: true
  });

  /**
   * Handles a new message received via WebSocket.
   * @param {Object} message - The message object from WebSocket.
   */
  const handleNewMessage = () => {
    setHasUnread(true);
  };

  // Initialize WebSocket connection using the hook
  const { connected, subscribe } = useWebSocket();
  useEffect(() => {
    if (connected) {
      setTimeout(() => {
        subscribe(`/topic/inapp/${user.userId}`, handleNewMessage);
      }, 1000);
    }
  }, [connected]);

  /**
   * Fetches the list of notifications from the API.
   */
  const getNotificationList = async (isLoadMore = false, pageNumber = null) => {
    setIsLoading(true);

    // Use provided page number or current pagination state
    const targetPage = pageNumber !== null ? pageNumber : paginationObj.page;
    const paginationParams = {
      ...paginationObj,
      page: targetPage
    };

    const response = await api.fetchNotifications(paginationParams);

    if (response?.data?.content) {
      if (isLoadMore) {
        // Append new notifications to existing ones
        setNotifications((prev) => [...prev, ...response.data.content]);
      } else {
        // Replace notifications for first load
        setNotifications(response.data.content);
      }

      // Update pagination info
      setPaginationInfo({
        currentPage: response.data.number,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        hasNextPage: !response.data.last,
        isLastPage: response.data.last
      });

      // Update paginationObj to keep it in sync
      setPaginationObj((prev) => ({
        ...prev,
        page: targetPage
      }));
    }

    setIsLoading(false);
  };

  /**
   * Loads more notifications by incrementing the page number.
   */
  const loadMoreNotifications = () => {
    if (!paginationInfo.isLastPage && !isLoading) {
      const nextPage = paginationObj.page + 1;
      // Pass the updated pagination object directly to avoid timing issues
      getNotificationList(true, nextPage);
    }
  };

  /**
   * Opens the notification popover and resets pagination.
   */
  const handleOpen = () => {
    // Reset all states when opening the popover
    setNotifications([]);
    setPaginationObj({
      size: 10,
      page: 0
    });
    setPaginationInfo({
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      hasNextPage: false,
      isLastPage: true
    });
    setHasUnread(false);
    setOpen(true);
    // Fetch fresh data from page 0
    getNotificationList(false, 0);
  };

  /**
   * Closes the notification popover.
   */
  const handleClose = () => {
    setOpen(false);
    setHasUnread(false);
  };

  const getCampaignRoute = (item) => {
    const { targetUserRole, subType } = item?.metadata || {};
    const { entityId } = item;
    console.log('item', item);
    const isFundCamp = subType === 'FUNDCAMP';
    const campaignType = isFundCamp ? 'campaigns' : 'projects';

    switch (targetUserRole) {
      case 'APPROVER':
        return `/admin/charitable-administrator/${campaignType}-approvals/${entityId}/approve`;
      case 'SUPERVISOR':
        return `/admin/charitable-administrator/${campaignType}-supervisor/${entityId}/view`;
      case 'CREATOR':
        return `/admin/charity-operations/${campaignType}/${entityId}/view`;
      default:
        return null;
    }
  };

  const handleNotificationClick = (item) => {
    let route = null;

    // Handle simple cases first
    if (item.type === 'USER') {
      route = `/admin/user-management/users/view/${item.entityId}`;
    } else if (item.type === 'DONOR') {
      const role = item.metadata?.targetUserRole;

      if (role === 'DONORHOD') {
        route = `/admin/donor-hod/${item.entityId}/acceptance-letter?isView=true`;
      } else if (role === 'DONORASSESSMENT') {
        route = `/admin/donor-assessment/${item.entityId}/acceptance-letter?isview=true`;
      } else {
        route = `/admin/donor-admin/${item.entityId}/acceptance-letter?isview=true`;
      }
    } else if (item.type === 'CAMPAIGN' || item.type === 'CAMPAIGN_PO' || item.type === 'CAMPAIGN_EMAIL') {
      route = getCampaignRoute(item);
    } else if (item.type === 'GRANT') {
      route = `/admin/grant-request/${item.entityId}/view`;
    } else if (item.type === 'PARTNERSHIP') {
      route = `/admin/partnership-request/${item.entityId}/view`;
    } else if (item.type === 'VOLUNTEER_CAMPAIGN') {
      route = `/admin/volunteer-campaigns/${item.entityId}/view`;
    } else if (item.type === 'CONTRIBUTION') {
      route = `/admin/in-kind-contribution-requests/${item.entityId}/view`;
    }
    if (route) {
      router.push(route);
    }

    handleClose();
  };

  return (
    <>
      <IconButton ref={anchorRef} size="large" color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge
          color="success"
          badgeContent=" "
          variant="dot"
          invisible={!hasUnread}
          sx={{
            '& .MuiBadge-badge': {
              animation: hasUnread ? 'pulse 1.5s infinite ease-in-out' : 'none',
              transformOrigin: 'center'
            }
          }}
        >
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
                    onClick={(item) => handleNotificationClick(item)}
                  />
                ))}
                {(isLoading ? Array.from(new Array(7)) : []).map((v) => (
                  <SkeletonComponent key={v} />
                ))}
              </List>

              {/* Show "View more" button only if there are more pages and not currently loading */}
              {paginationInfo.hasNextPage && !isLoading && (
                <Box textAlign="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ my: 2 }}
                    size="small"
                    onClick={loadMoreNotifications}
                    disabled={isLoading}
                  >
                    View more
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </>
      </MenuPopover>
    </>
  );
}

NotificationPopover.propTypes = {
  item: PropTypes.shape({
    opened: PropTypes.bool.isRequired, // Ensuring 'opened' is a boolean and required
    title: PropTypes.string.isRequired, // Ensuring 'title' is a string and required
    deliveredAt: PropTypes.instanceOf(Date).isRequired, // Ensuring 'deliveredAt' is a Date and required
    message: PropTypes.string.isRequired // Ensuring 'message' is a string and required
  }).isRequired,
  onClick: PropTypes.func.isRequired // Validating 'onClick' as a required function
};
