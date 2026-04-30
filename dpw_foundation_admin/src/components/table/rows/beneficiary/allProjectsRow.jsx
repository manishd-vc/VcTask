'use client';
import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM } from 'src/utils/formatTime';
import { campaignStatusColorSchema } from 'src/utils/util';

export default function AllProjectsRow({ row, isLoading }) {
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED'); // Formatting currency
  const router = useRouter();

  return (
    <>
      <TableRow hover>
        <TableCell>{row?.campaignNumericId}</TableCell>
        <TableCell>{row?.projectName}</TableCell>
        <TableCell>{row?.startDate ? fDateM(row?.startDate) : '-'}</TableCell>
        <TableCell>{row?.endDate ? fDateM(row?.endDate) : '-'}</TableCell>
        <TableCell>{fCurrency(row?.campaignTargetRequired || 0)}</TableCell>
        <TableCell>{fCurrency(row?.campaignTargetAchieved || 0)}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Chip
              color={campaignStatusColorSchema[row?.status] || 'default'}
              label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', row?.status) || row?.status}
              size="small"
            />
          )}
        </TableCell>
        <TableCell>
          <Stack direction="row" justifyContent="center">
            <Tooltip title="View" arrow>
              <IconButton onClick={() => router.push(`/admin/all-projects/${row?.id}/view`)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
