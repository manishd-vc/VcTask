import { Button, Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import { fDateWithLocale } from 'src/utils/formatTime';
import { checkPermissions } from 'src/utils/permissions';
import { RoleTableCellWithSkeleton } from './roleTableCellWithSkeleton';

// PropTypes
RoleRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cover: PropTypes.shape({ url: PropTypes.string.isRequired }),
    firstName: PropTypes.string.isRequired,
    status: PropTypes.string,
    roleId: PropTypes.string,
    description: PropTypes.string,
    userCount: PropTypes.string,
    name: PropTypes.string,
    createdOn: PropTypes.string,
    default: PropTypes.string,
    updatedOn: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

export default function RoleRow({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const isArchivedRoles = initialTab === 'archivedRoles';
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);

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
    <TableRow hover key={row?.id}>
      <RoleTableCellWithSkeleton isLoading={isLoading} content={row?.roleId} width={120} />
      <RoleTableCellWithSkeleton isLoading={isLoading} content={row?.name} truncateLength={40} />
      <RoleTableCellWithSkeleton
        isLoading={isLoading}
        content={row?.description}
        truncateLength={40}
        sx={{ maxWidth: 300 }}
      />
      <RoleTableCellWithSkeleton isLoading={isLoading} content={row?.userCount} truncateLength={40} />
      <RoleTableCellWithSkeleton
        isLoading={isLoading}
        content={
          (isArchivedRoles ? row?.updatedOn : row?.createdOn) &&
          fDateWithLocale(isArchivedRoles ? row?.updatedOn : row?.createdOn)
        }
        sx={{ whiteSpace: 'nowrap' }}
      />
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip color={renderStatusColor()} label={row?.status} size="small" />
        )}
      </TableCell>
      {checkPermissions(rolesAssign, ['role_manage_operations']) && (
        <TableCell>
          <Stack direction="row" justifyContent="center">
            {isLoading ? (
              <>
                <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
                <Skeleton variant="circular" width={34} height={34} />
              </>
            ) : (
              <>
                {isArchivedRoles ? (
                  checkPermissions(rolesAssign, ['role_manage_operations']) && (
                    <Tooltip title="Restore Role" arrow>
                      <Button variant="outlinedWhite" size="small" onClick={handleClickOpen(row)}>
                        Restore
                      </Button>
                    </Tooltip>
                  )
                ) : (
                  <>
                    {checkPermissions(rolesAssign, ['role_manage_operations']) && (
                      <Tooltip title="Edit" arrow>
                        <IconButton onClick={() => router.push(`/admin/user-management/roles/${row?.id}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!row?.default && checkPermissions(rolesAssign, ['role_manage_operations']) && (
                      <Tooltip title="Delete" arrow>
                        <IconButton onClick={handleClickOpen(row)}>
                          <DeleteIconRed />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
              </>
            )}
          </Stack>
        </TableCell>
      )}
    </TableRow>
  );
}
