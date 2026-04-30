'use client';
import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { TrackActivityIcon, ViewIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { enrolmentStatusColorSchema } from 'src/utils/util';

export default function AllEnrollmentsRow({ row, isLoading }) {
  const router = useRouter();
  const { masterData } = useSelector((state) => state?.common);

  return (
    <TableRow hover>
      <TableCell>{row?.enrollmentNumericId}</TableCell>
      <TableCell>{row?.firstName}</TableCell>
      <TableCell>{row?.lastName}</TableCell>
      <TableCell>{row?.volunteerCampaignNumericId}</TableCell>
      <TableCell>{row?.campaignTitle}</TableCell>
      <TableCell>{row?.startDateTime ? fDateWithLocale(row.startDateTime) : '-'}</TableCell>
      <TableCell>{row?.endDateTime ? fDateWithLocale(row.endDateTime) : '-'}</TableCell>
      <TableCell>{row?.enrolledOn ? fDateWithLocale(row.enrolledOn) : '-'}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            color={enrolmentStatusColorSchema[row?.status] || 'default'}
            label={getLabelByCode(masterData, 'dpwf_enrollment_status', row?.status) || row?.status}
            size="small"
          />
        )}
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="View" arrow>
            <IconButton onClick={() => router.push(`/admin/all-enrollments/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {row?.status?.toLowerCase() === 'approved' && (
            <Tooltip title="Log Activity" arrow>
              <IconButton onClick={() => router.push(`/admin/all-enrollments/${row?.id}/log-activity`)}>
                <TrackActivityIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
