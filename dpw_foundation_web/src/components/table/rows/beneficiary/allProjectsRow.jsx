'use client';
import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { approvalStatusColorSchema, getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM } from 'src/utils/formatTime';
export default function AllProjectsRow({ row, isLoading }) {
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  const router = useRouter();

  return (
    <TableRow hover>
      <TableCell>{row?.campaignNumericId || '-'}</TableCell>
      <TableCell>{row?.projectName || '-'}</TableCell>
      <TableCell>{row?.startDate ? fDateM(row?.startDate) : '-'}</TableCell>
      <TableCell>{row?.endDate ? fDateM(row?.endDate) : '-'}</TableCell>
      <TableCell>{fCurrency(row?.campaignTargetRequired || 0)}</TableCell>
      <TableCell>{fCurrency(row?.campaignTargetAchieved || 0)}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            color={approvalStatusColorSchema[row?.status] || 'default'}
            label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status) || row?.status}
            size="small"
          />
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="center">
          <Tooltip title="View" arrow>
            <IconButton onClick={() => router.push(`/user/all-projects/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
