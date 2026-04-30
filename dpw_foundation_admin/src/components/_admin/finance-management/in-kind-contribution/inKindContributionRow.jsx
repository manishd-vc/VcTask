'use client';

import { Chip, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AcceptanceLetterIcon, ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateShortYear } from 'src/utils/formatTime';
import { inKindContributionStatusColorSchema } from 'src/utils/util';

export default function InKindContributionRow({ row }) {
  const router = useRouter();
  const fCurrency = useCurrencyFormatter('AED');
  const handleView = () => {
    router.push(`/admin/finance/in-kind-contribution-requests/${row?.id}/view`);
  };
  const handleMakePayment = () => {
    router.push(`/admin/finance/in-kind-contribution-requests/${row?.id}/make-payment`);
  };
  const { masterData } = useSelector((state) => state?.common);

  return (
    <TableRow hover>
      <TableCell>{row?.contributionUniqueId || '-'}</TableCell>
      <TableCell>{row?.createdOn ? fDateShortYear(row.createdOn) : '-'}</TableCell>
      <TableCell>{row?.requesterName || '-'}</TableCell>
      <TableCell>{row?.requestTitle || '-'}</TableCell>
      <TableCell>{row?.estimatedValueDonation ? fCurrency(row.estimatedValueDonation) : '-'}</TableCell>
      <TableCell>{row?.estimatedValueInkind ? fCurrency(row.estimatedValueInkind) : '-'}</TableCell>
      <TableCell>{row?.amountDisbursed ? fCurrency(row.amountDisbursed) : '-'}</TableCell>
      <TableCell>{row?.balanceAmount ? fCurrency(row.balanceAmount) : '-'}</TableCell>
      <TableCell>{row?.iacadPermitId || '-'}</TableCell>
      <TableCell>{row?.paymentVoucher ? fCurrency(row?.paymentVoucher) : '-'}</TableCell>

      <TableCell>
        <Chip
          label={getLabelByCode(masterData, 'dpwf_inkind_contribution_status', row?.status) || 'Unknown'}
          color={inKindContributionStatusColorSchema[row?.status] || 'default'}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="View Details">
            <IconButton onClick={handleView}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Make a Payment" arrow>
            <IconButton onClick={handleMakePayment}>
              <AcceptanceLetterIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
