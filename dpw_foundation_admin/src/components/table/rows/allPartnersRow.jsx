import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { MoreVertIcon, UserIcon, ViewIcon } from 'src/components/icons';
import * as api from 'src/services';
import { checkPermissions } from 'src/utils/permissions';

export default function AllPartnersRow({ isLoading, row }) {
  const route = useRouter();
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Fetching country data using a query
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const handleView = () => {
    route.push(`/admin/all-partners/${row?.userId}`);
    setAnchorEl(null);
  };

  const handleContactDetails = () => {
    // Navigate to partner contact details page
    route.push(`/admin/all-partners/${row?.id}/contact-details`);
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const countryLabel = country?.find((item) => item?.code === row?.country)?.label;

  // Check if user can view contact details
  const showContactDetails = checkPermissions(rolesAssign, ['grant_manage', 'partner_manage']);

  // Parse name fields - assuming the API returns firstName and lastName or we need to split the name
  const firstName = row?.firstName || row?.partnerSeekerName?.split(' ')[0] || '-';
  const lastName = row?.lastName || row?.partnerSeekerName?.split(' ').slice(1).join(' ') || '-';

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{row?.email || '-'}</TableCell>
      <TableCell>{row?.organizationName || row?.partnerSeekerName || '-'}</TableCell>
      <TableCell>{countryLabel || '-'}</TableCell>
      <TableCell>{row?.phoneNumber || row?.phone || '-'}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip color={row?.status === 'Active' ? 'success' : 'error'} label={row?.status} size="small" />
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="View" arrow>
            <IconButton onClick={handleView}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions" arrow>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {showContactDetails && (
              <MenuItem onClick={handleContactDetails}>
                <UserIcon />
                <Typography sx={{ ml: 1 }}>Partner Contact Details</Typography>
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
