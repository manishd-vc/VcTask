import { Chip, IconButton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { grantStatusColorSchema } from 'src/utils/util';

export default function BeneficiaryProjectsRow({ row }) {
  const { id } = useParams();
  const route = useRouter();
  const fCurrency = useCurrencyFormatter('AED');
  const { masterData } = useSelector((state) => state?.common);

  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.campaignNumericId || '-'}</TableCell>
      <TableCell>{row?.projectName || '-'}</TableCell>
      <TableCell>{row?.startDate ? fDateWithLocale(row?.startDate, true) : '-'}</TableCell>
      <TableCell>{row?.endDate ? fDateWithLocale(row?.endDate, true) : '-'}</TableCell>
      <TableCell>{row?.campaignTargetRequired ? fCurrency(row?.campaignTargetRequired) : '-'}</TableCell>
      <TableCell>{row?.campaignTargetAchieved ? fCurrency(row?.campaignTargetAchieved) : '-'}</TableCell>
      <TableCell>
        <Chip
          color={grantStatusColorSchema[row?.status] || 'default'}
          label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status) || row?.status || '-'}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="View" arrow>
            <IconButton onClick={() => route.push(`/admin/all-beneficiaries/${id}/projects/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
