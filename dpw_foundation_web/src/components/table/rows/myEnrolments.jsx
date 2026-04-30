'use client';
import { Chip, IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/_admin/my-donations/generalDialog';
import { DeleteIconRed, EditIcon, TrackActivityIcon, ViewIcon } from 'src/components/icons';
import { setVolunteerEnrollmentData } from 'src/redux/slices/profile';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM, formatTime } from 'src/utils/formatTime';
import { enrolmentStatusColorSchema } from 'src/utils/util';

EnrolmentRows.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  refetch: PropTypes.func,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enrollmentNumericId: PropTypes.string,
    campaignTitle: PropTypes.string,
    eventType: PropTypes.string,
    startDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    enrolledOn: PropTypes.string,
    city: PropTypes.string,
    status: PropTypes.string
  }).isRequired
};

export default function EnrolmentRows({ isLoading, row, refetch }) {
  const { masterData } = useSelector((state) => state?.common);
  const router = useRouter();
  const dispatch = useDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: fetchEnrollmentDetails } = useMutation(volunteerApi.getEnrollmentDetails, {
    onSuccess: (data) => {
      dispatch(setVolunteerEnrollmentData(data?.data));
      router.push(`/user/my-enrolments/${row?.id}/edit`);
    }
  });

  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.enrollmentNumericId || '-'}</TableCell>
        <TableCell>{row?.campaignTitle || '-'}</TableCell>
        <TableCell>{row?.eventType || '-'}</TableCell>
        <TableCell>{row?.startDateTime ? fDateM(row?.startDateTime) : '-'}</TableCell>
        <TableCell>{row?.endDateTime ? fDateM(row?.endDateTime) : '-'}</TableCell>
        <TableCell>{row?.enrolledOn ? `${fDateM(row?.enrolledOn)} ${formatTime(row?.enrolledOn)}` : '-'}</TableCell>
        <TableCell>{row?.city || '-'}</TableCell>
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
        <TableCell>
          {row?.status === 'DRAFT' && (
            <Tooltip title="Edit" arrow>
              <IconButton onClick={() => fetchEnrollmentDetails(row?.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View" arrow>
            <IconButton onClick={() => router.push(`/user/my-enrolments/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {row?.status === 'DRAFT' && (
            <Tooltip title="Delete" arrow>
              <IconButton onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIconRed />
              </IconButton>
            </Tooltip>
          )}
          {row?.status === 'APPROVED' && (
            <Tooltip title="Track Activity" arrow>
              <IconButton onClick={() => router.push(`/user/my-enrolments/${row?.id}/track-activity`)}>
                <TrackActivityIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <GeneralDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        row={row}
        refetch={refetch}
        textTitle="Are you sure you want to Delete enrollment request?"
        endpoint="enrollDelete"
        btnTitle="Delete"
      />
    </>
  );
}
