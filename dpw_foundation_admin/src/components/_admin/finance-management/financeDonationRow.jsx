import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { donorStatusColorSchema } from 'src/utils/util';

export default function FinanceDonationRow({ isLoading, row }) {
  const router = useRouter();
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const countryLabel = country?.find((item) => item?.code === row?.country)?.label;

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.donationPledgeId || '-'}</TableCell>
      <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
      <TableCell>{row?.donatedBy || '-'}</TableCell>
      <TableCell>
        {row?.donationType ? getLabelByCode(masterData, 'dpw_foundation_donation_type', row?.donationType) : '-'}
      </TableCell>
      <TableCell>{row?.donationProject || '-'}</TableCell>
      <TableCell>{countryLabel || '-'}</TableCell>
      <TableCell>{row?.donationAmount ? fCurrency(row?.donationAmount) : '0.00'}</TableCell>
      <TableCell>
        {row?.donorType ? getLabelByCode(masterData, 'dpw_foundation_donor_type', row?.donorType) : '-'}
      </TableCell>
      <TableCell>{row?.iacadPermitId || '-'}</TableCell>
      <TableCell>{row?.receiptVoucher || '-'}</TableCell>
      <TableCell align="center">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Stack flexDirection="row" justifyContent="center" gap={1}>
            <Chip
              color={donorStatusColorSchema[row?.status]}
              label={row?.status ? getLabelByCode(masterData, 'dpw_foundation_donor_status', row?.status) : '-'}
              size="small"
            />
          </Stack>
        )}
      </TableCell>
      <TableCell>
        <Tooltip title="View" arrow>
          <IconButton onClick={() => router.push(`/admin/finance/donations/${row?.id}/view`)}>
            <ViewIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
