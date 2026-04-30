import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow } from '@mui/material';

// utils
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { DeleteIconRed, ReActiveIcon, SuspendedIcon, ViewIcon } from 'src/components/icons';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import { TableCellWithSkeleton } from './tableCellWithSkeleton';
// icons

import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
// component

ExternalUserList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    firstName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    employeeId: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    updatedAt: PropTypes.instanceOf(Date).isRequired,
    externalUser: PropTypes.string,
    roles: PropTypes.array
  }).isRequired,
  handleClickDelete: PropTypes.func.isRequired,
  handleClickSuspend: PropTypes.func.isRequired,
  handleClickActiveExternal: PropTypes.func.isRequired
};

export default function ExternalUserList({
  isLoading,
  row,
  handleClickSuspend,
  handleClickDelete,
  handleClickActiveExternal
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const isArchivedUser = initialTab === 'archivedUsers';
  const renderStatusColor = () => {
    if (row?.status === 'Active') {
      return 'success';
    } else if (row?.status === 'Deleted') {
      return 'error';
    } else if (row?.status === 'Suspended') {
      return 'warning';
    } else {
      return 'success';
    }
  };
  console.log('row?.contributedAs', row?.contributedAs);
  return (
    <TableRow hover key={`table_row_${row?.id}`} sx={{ textAlign: 'center' }}>
      <TableCellWithSkeleton isLoading={isLoading} content={row?.firstName} width={120} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.lastName} width={120} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.accountType} width={120} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.email} truncateLength={40} sx={{ maxWidth: 300 }} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.mobile} width={120} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.contributedAs?.join(', ') || '-'} width={120} />

      {isArchivedUser && (
        <TableCellWithSkeleton
          isLoading={isLoading}
          content={row?.updatedAt && fDateWithLocale(row?.updatedAt)}
          truncateLength={40}
          sx={{ maxWidth: 300 }}
        />
      )}
      <TableCell>
        <Stack flexDirection="row" alignItems="center" justifyContent="center">
          {row?.status !== 'Suspended' && row?.status !== 'Deleted' && (
            <>
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                <Chip color={renderStatusColor()} label={row?.status} size="small" />
              )}
            </>
          )}

          {(row?.status === 'Suspended' || row?.status === 'Deleted') && (
            <HtmlTooltip
              arrow
              title={
                row?.reason
                // <div>
                //   <button
                //     style={{
                //       color: '#fff',
                //       marginLeft: '8px',
                //       cursor: 'pointer',
                //       background: 'none',
                //       border: 'none',
                //       padding: '0'
                //     }}
                //     aria-label="Suspension Reason"
                //   >
                //     {row?.reason} dfdfdff
                //   </button>
                // </div>
              }
            >
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                <Chip color={renderStatusColor()} label={row?.status} size="small" />
              )}
            </HtmlTooltip>
          )}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="center">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              {checkPermissions(rolesAssign, ['user_manage_view', 'user_manage_operations']) && (
                <HtmlTooltip title="View User" arrow>
                  <IconButton onClick={() => router.push(`/admin/user-management/external-user/view/${row?.id}`)}>
                    <ViewIcon />
                  </IconButton>
                </HtmlTooltip>
              )}
              {checkPermissions(rolesAssign, ['user_manage_operations']) && row?.status === 'Active' && (
                <HtmlTooltip title="Suspend User" arrow>
                  <IconButton onClick={handleClickSuspend(row?.id)}>
                    <SuspendedIcon />
                  </IconButton>
                </HtmlTooltip>
              )}
              {checkPermissions(rolesAssign, ['user_manage_operations']) && row?.status === 'Suspended' && (
                <HtmlTooltip title="Un-Suspend User" arrow>
                  <IconButton onClick={handleClickActiveExternal(row?.id)}>
                    <ReActiveIcon />
                  </IconButton>
                </HtmlTooltip>
              )}
              {checkPermissions(rolesAssign, ['user_manage_operations']) && row?.status !== 'Deleted' && (
                <HtmlTooltip title="Delete User" arrow>
                  <IconButton onClick={handleClickDelete(row?.id)}>
                    <DeleteIconRed />
                  </IconButton>
                </HtmlTooltip>
              )}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
