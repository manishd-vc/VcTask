import { Chip, IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { EditIcon, ViewIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fNumber } from 'src/utils/formatNumber';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getMatchingString, labelPaymentThrough } from 'src/utils/onSpotUtils';
import { donorStatusColorSchema } from 'src/utils/util';

OnSpotDonationRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    donationPledgeId: PropTypes.string,
    createdOn: PropTypes.string,
    donationType: PropTypes.string,
    donorName: PropTypes.string,
    registeredAs: PropTypes.string,
    campaignTitle: PropTypes.string,
    donationAmount: PropTypes.string,
    status: PropTypes.string,
    paymentThrough: PropTypes.string,
    donationCurrency: PropTypes.string
  }).isRequired,
  donorType: PropTypes.string
};

export default function OnSpotDonationRow({ row, donorType }) {
  const router = useRouter();
  const { masterData } = useSelector((state) => state?.common);
  const renderViewIcon = () => {
    return (
      <Tooltip title="View" arrow>
        <IconButton onClick={() => router.push(`/admin/on-the-spot-donation/${row?.id}/view`)}>
          <ViewIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderEditIcon = () => {
    if (donorType !== 'admin') return null;
    if (row?.status === 'ADMIN_INTENT_REJECTED' || row?.status === 'DONATION_INITIATIVE') return null;

    return (
      <Tooltip title="Edit" arrow>
        <IconButton onClick={() => router.push(`/admin/on-the-spot-donation/${row?.id}/edit`)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const donationMasterData = getLabelObject(masterData, 'dpw_foundation_donation_type');

  const donationType = (donation) => getMatchingString(donationMasterData?.values, donation, 'code');
  return (
    <TableRow hover key={`donation_pledge_${row?.donationPledgeId}`}>
      <TableCell>{row?.donationPledgeId}</TableCell>
      <TableCell>{row?.createdOn && fDateWithLocale(row?.createdOn, true)}</TableCell>
      <TableCell>
        {' '}
        <Typography variant="inherit" textTransform="capitalize">
          {row?.donorName ?? '-'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="inherit" textTransform="capitalize">
          {row?.registeredAs ?? '-'}
        </Typography>
      </TableCell>
      <TableCell>{donationType(row?.donationType) ?? '-'}</TableCell>
      <TableCell>{row?.campaignTitle ?? '-'}</TableCell>
      <TableCell>{labelPaymentThrough[row?.paymentThrough] ?? '-'}</TableCell>
      <TableCell>
        {row?.donationCurrency ?? ''} {fNumber(row?.donationAmount) ?? '-'}
      </TableCell>
      <TableCell>
        <Chip
          color={donorStatusColorSchema[row?.status]}
          label={getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status)}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          {row?.status.toUpperCase() === 'DONATED' ? '' : renderEditIcon()}
          {renderViewIcon()}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
