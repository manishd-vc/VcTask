import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { Button, Chip, IconButton, Skeleton, Stack, TableCell, TableRow, useTheme } from '@mui/material';

// utils
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import { DeleteIconRed, EditIcon, ViewIcon } from 'src/components/icons';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import TableStyle from './../table.styles';
import { TableCellWithSkeleton } from './tableCellWithSkeleton';
// icons

// component

UserRow.propTypes = {
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
  handleClickOpen: PropTypes.func.isRequired
};

export default function UserRow({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  const theme = useTheme();
  const style = TableStyle(theme);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);

  const isArchivedUser = initialTab === 'archivedUsers';
  const roles = row?.roles?.map((role) => role.name) || [];

  const renderStatusColor = () => {
    if (row?.status === 'Active') {
      return 'success';
    } else if (row?.status === 'Inactive') {
      return 'error';
    } else if (row?.status === 'Archived') {
      return 'warning';
    } else {
      return 'success';
    }
  };

  return (
    <TableRow hover key={`table_row_${row?.employeeId}`} sx={{ textAlign: 'center' }}>
      <TableCellWithSkeleton
        isLoading={isLoading}
        content={row?.employeeId}
        truncateLength={40}
        sx={{ maxWidth: 400 }}
        typographyStyle={{ ...style.textTurncate }}
      />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.firstName} width={120} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.lastName} width={120} />
      <TableCellWithSkeleton
        isLoading={isLoading}
        content={roles?.join(', ')}
        truncateLength={40}
        typographyStyle={style.textTurncate}
      />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.email} truncateLength={25} sx={{ maxWidth: 300 }} />
      <TableCellWithSkeleton isLoading={isLoading} content={row?.mobile} width={120} />
      {isArchivedUser && (
        <TableCellWithSkeleton
          isLoading={isLoading}
          content={row?.updatedAt && fDateWithLocale(row?.updatedAt)}
          truncateLength={40}
          sx={{ maxWidth: 300 }}
        />
      )}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip color={renderStatusColor()} label={row?.status} size="small" />
        )}
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
              {isArchivedUser ? (
                <>
                  {checkPermissions(rolesAssign, ['user_manage_view', 'user_manage_operations']) && (
                    <HtmlTooltip title="View" arrow>
                      <IconButton onClick={() => router.push(`/admin/user-management/users/view/${row?.id}`)}>
                        <ViewIcon />
                      </IconButton>
                    </HtmlTooltip>
                  )}
                  {checkPermissions(rolesAssign, ['user_manage_operations']) && (
                    <HtmlTooltip title="Restore User" arrow>
                      <Button variant="outlinedWhite" size="small" onClick={handleClickOpen(row?.id)}>
                        Restore
                      </Button>
                    </HtmlTooltip>
                  )}
                </>
              ) : (
                <>
                  {!row?.externalUser && (
                    <>
                      {checkPermissions(rolesAssign, ['user_manage_operations']) && (
                        <HtmlTooltip title="Edit" arrow>
                          <IconButton onClick={() => router.push(`/admin/user-management/users/${row?.id}`)}>
                            <EditIcon />
                          </IconButton>
                        </HtmlTooltip>
                      )}
                    </>
                  )}
                  {checkPermissions(rolesAssign, ['user_manage_view', 'user_manage_operations']) && (
                    <HtmlTooltip title="View" arrow>
                      <IconButton onClick={() => router.push(`/admin/user-management/users/view/${row?.id}`)}>
                        <ViewIcon />
                      </IconButton>
                    </HtmlTooltip>
                  )}
                  {!row?.externalUser && (
                    <>
                      {checkPermissions(rolesAssign, ['user_manage_operations']) && (
                        <HtmlTooltip title="Delete" arrow>
                          <IconButton onClick={handleClickOpen(row.id)}>
                            <DeleteIconRed />
                          </IconButton>
                        </HtmlTooltip>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
