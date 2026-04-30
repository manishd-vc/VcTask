'use client';
import { Chip, IconButton, Menu, MenuItem, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MoreVertIcon, ViewIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { commonUserStatusColorSchema } from 'src/utils/util';

export default function AllBeneficiaryRow({ row, isLoading }) {
  const router = useRouter();
  const { masterData } = useSelector((state) => state?.common);
  // State for dropdown menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <TableRow hover>
        <TableCell>{row?.beneficiaryUniqueId}</TableCell>
        <TableCell sx={{ textTransform: 'capitalize' }}>{row?.firstName}</TableCell>
        <TableCell sx={{ textTransform: 'capitalize' }}>{row?.lastName}</TableCell>
        <TableCell>{row?.email}</TableCell>
        <TableCell>{row?.mobile}</TableCell>
        <TableCell>{row?.numberOfProjectsAssociated}</TableCell>
        <TableCell>{row?.accountType}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              color={commonUserStatusColorSchema[row?.status] || 'default'}
              label={getLabelByCode(masterData, 'dpwf_user_status', row?.status) || row?.status}
              size="small"
            />
          )}
        </TableCell>
        <TableCell>
          <Stack direction="row" justifyContent="center">
            <Tooltip title="View" arrow>
              <IconButton onClick={() => router.push(`/admin/all-beneficiaries/${row?.id}/view`)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              aria-label="more options"
              aria-controls={open ? 'menu' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>

          {/* Dropdown Menu */}
          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'menu-button'
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '10px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                padding: '0px 0',
                width: '340px'
              },
              '& .MuiMenuItem-root': {
                fontSize: '18px',
                padding: '14px 20px'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                router.push(`/admin/all-beneficiaries/${row?.userId}/in-kind-contribution-requests`);
              }}
            >
              In-Kind Contribution Requests
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push(`/admin/all-beneficiaries/${row?.id}/projects`);
              }}
            >
              Charitable Projects
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push(`/admin/all-beneficiaries/${row?.userId}/grant-requests`);
              }}
            >
              Grant Requests
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
}
