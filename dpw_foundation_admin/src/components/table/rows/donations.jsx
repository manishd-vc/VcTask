import PropTypes from 'prop-types';

// mui
import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { donorStatusColorSchema } from 'src/utils/util';

// component

DonationsRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    donationPledgeId: PropTypes.string, // ID for the need info (string),
    createdOn: PropTypes.string, // ID for the need info (string),
    status: PropTypes.string, // ID for the need info (string),
    assignTo: PropTypes.string, // ID for the need info (string),
    eventTitle: PropTypes.string, // ID for the need info (string),
    donationAmount: PropTypes.string, // ID for the need info (string),
    donationPayment: PropTypes.shape({
      paymentInstrument: PropTypes.string // ID for the need info (string),
    }).isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

export default function DonationsRow({ isLoading, row, handleClickOpen, donorType = 'admin', handleIcadOpen }) {
  const route = useRouter();
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  const handleView = (type) => {
    handleClickOpen(row.id, 'intent', row);
    route.push(`/admin/donations/${row?.id}/view`);
  };

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.donationPledgeId}</TableCell>
      <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
      <TableCell>{getLabelByCode(masterData, 'dpw_foundation_donation_type', row?.donationType) || '-'}</TableCell>
      <TableCell>{row?.eventTitle || '-'}</TableCell>
      <TableCell>{row?.pledgeAmount ? fCurrency(row?.pledgeAmount) : '0.00'}</TableCell>
      <TableCell>{row?.donationAmount ? fCurrency(row?.donationAmount) : '0.00'}</TableCell>
      <TableCell align="center">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Stack flexDirection="row" justifyContent="center" gap={1}>
            <Chip
              color={donorStatusColorSchema[row?.status]}
              label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
              size="small"
            />
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Tooltip title="View" arrow>
          <IconButton onClick={() => handleView(donorType)}>
            <ViewIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
