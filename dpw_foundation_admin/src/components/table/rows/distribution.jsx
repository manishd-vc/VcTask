import { IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DeleteIconRed, EditIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

DistributionRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.any,
    files: PropTypes.arrayOf(PropTypes.object),
    poNumber: PropTypes.string,
    poDate: PropTypes.string,
    poDescription: PropTypes.string,
    poValue: PropTypes.number
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

export default function DistributionRow({ isLoading, row, handleClickOpen, index }) {
  const { masterData } = useSelector((state) => state?.common);

  const distributionEndTimeContent = row?.distributionEndTime ? fDateWithLocale(row.distributionEndTime, false) : '';

  const distributionEndTime = row?.distributionEndTime ? fDateWithLocale(row.distributionEndTime, false) : '';

  const estimatedDistributionValue = row?.estimatedDistributionValue || '0.00';

  return (
    <TableRow hover key={row?.id}>
      <TableCell component="th" scope="row">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          getLabelByCode(masterData, 'dpw_foundation_campaign_category', row?.distributionCategory)
        )}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : estimatedDistributionValue}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : row?.distributionSource}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : row?.beneficiaryType}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : row?.targetBeneficiaryNo}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : distributionEndTimeContent}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? <Skeleton variant="text" /> : distributionEndTime}
      </TableCell>
      <TableCell component="th" scope="row">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          getLabelByCode(masterData, 'dpw_foundation_project_fund_source', row?.distributionSource)
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} />
          ) : (
            <>
              <Tooltip title="Edit" sx={{ color: 'error.main' }} arrow>
                <IconButton onClick={() => handleClickOpen(index, 'edit')}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" sx={{ color: 'error.main' }} arrow>
                <IconButton onClick={() => handleClickOpen(index, 'delete')}>
                  <DeleteIconRed />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
