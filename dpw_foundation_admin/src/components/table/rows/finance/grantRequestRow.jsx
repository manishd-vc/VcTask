import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AcceptanceLetterIcon, ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getGrantStatus } from 'src/utils/getGrantStatus';
import { grantStatusColorSchema } from 'src/utils/util';

export default function FinanceGrantRequestsRow({ isLoading, row }) {
  const route = useRouter();
  const fCurrency = useCurrencyFormatter('AED');
  const { masterData } = useSelector((state) => state?.common);

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.grantUniqueId || '-'}</TableCell>
      <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
      <TableCell>{row?.requesterName || '-'}</TableCell>
      <TableCell>{getLabelByCode(masterData, 'dpwf_grant_assistance_required', row?.assistanceType) || '-'}</TableCell>
      <TableCell>{row?.amountRequested ? fCurrency(row?.amountRequested) : '-'}</TableCell>
      <TableCell>{row?.amountGranted ? fCurrency(row?.amountGranted) : '-'}</TableCell>
      <TableCell>{row?.amountDisbursed ? fCurrency(row?.amountDisbursed) : '-'}</TableCell>
      <TableCell>{row?.balanceAmount ? fCurrency(row?.balanceAmount) : '-'}</TableCell>
      <TableCell>{row?.accountType || '-'}</TableCell>
      <TableCell>{row?.paymentVoucher ? fCurrency(row?.paymentVoucher) : '-'}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            color={row?.feedbackStatus === 'FEEDBACK_REQUESTED' ? 'info' : grantStatusColorSchema[row?.status]}
            label={getGrantStatus(masterData, row?.status, row?.feedbackStatus)}
            size="small"
          />
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="View" arrow>
            <IconButton onClick={() => route.push(`/admin/finance/grant-request/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Make a Payment" arrow>
            <IconButton onClick={() => route.push(`/admin/finance/grant-request/${row?.id}/make-payment`)}>
              <AcceptanceLetterIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
