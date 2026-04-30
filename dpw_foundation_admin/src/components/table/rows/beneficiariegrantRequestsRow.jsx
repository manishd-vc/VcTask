import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getGrantStatus } from 'src/utils/getGrantStatus';
import { grantStatusColorSchema } from 'src/utils/util';
export default function BeneficiariegrantRequestsRow({ isLoading, row, handleClickOpen, refetch }) {
  const { id: beneficiaryId } = useParams();
  const route = useRouter();
  const fCurrency = useCurrencyFormatter('AED');
  const { masterData } = useSelector((state) => state?.common);
  console.log('row in grant request row', row);
  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.grantUniqueId || '-'}</TableCell>
      <TableCell>{row?.createdOn ? fDateWithLocale(row?.createdOn, true) : '-'}</TableCell>
      <TableCell>{row?.grantSeekerName || '-'}</TableCell>
      <TableCell>{getLabelByCode(masterData, 'dpwf_grant_assistance_required', row?.assistanceType) || '-'}</TableCell>
      <TableCell>{row?.amountRequested ? fCurrency(row?.amountRequested) : '-'}</TableCell>
      <TableCell>{row?.amountGranted ? fCurrency(row?.amountGranted) : '-'}</TableCell>

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
            <IconButton
              onClick={() => route.push(`/admin/all-beneficiaries/${beneficiaryId}/grant-requests/${row?.id}/view`)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
