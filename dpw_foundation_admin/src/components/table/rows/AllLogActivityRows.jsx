'use client';
import { Chip, IconButton, Skeleton, Stack, TableCell, TableRow, Tooltip } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ApproveLogHour from 'src/components/dialog/ApproveLogHour';
import RejectForm from 'src/components/dialog/rejectForm';
import { CloseIcon, TickIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale, formatTime } from 'src/utils/formatTime';
import { logActivityStatusColorSchema } from 'src/utils/util';

export default function AllLogActivityRow({ row, isLoading }) {
  const { masterData } = useSelector((state) => state?.common);
  const pathname = usePathname();
  const { id } = useParams();
  const isViewMode = pathname.includes('/view');
  const [open, setOpen] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [logHourId, setLogHourId] = useState('');
  const [approvalLogData, setApprovalLogData] = useState({});
  const handleApproval = (data) => {
    setOpen(true);
    setApprovalLogData(data);
  };
  const handleReject = (id) => {
    setOpenReject(true);
    setLogHourId(id);
  };
  const convertDateTime = (datetime) => `${fDateWithLocale(datetime)} ${formatTime(datetime)}`;
  const handleCloseModal = () => {
    setOpen(false);
    setOpenReject(false);
    setLogHourId('');
    setApprovalLogData({});
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{row?.milestoneDescription}</TableCell>
        <TableCell>{row?.checkInTime ? convertDateTime(row?.checkInTime) : '-'}</TableCell>
        <TableCell>{row?.checkOutTime ? convertDateTime(row?.checkOutTime) : '-'}</TableCell>
        <TableCell>{row?.logHours}</TableCell>
        <TableCell>{row?.logSource}</TableCell>
        <TableCell sx={{ textTransform: 'capitalize' }}>{row?.updatedByName || '-'}</TableCell>
        <TableCell>{row?.updatedOn ? convertDateTime(row.updatedOn) : '-'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Tooltip title={row?.rejectionReason} arrow>
              <Chip
                color={logActivityStatusColorSchema[row?.status] || 'default'}
                label={getLabelByCode(masterData, 'dpwf_enrollment_status', row?.status) || row?.status}
                size="small"
              />
            </Tooltip>
          )}
        </TableCell>
        {!isViewMode && (
          <TableCell align="right">
            {row?.status?.toLowerCase() === 'submitted' ? (
              <Stack direction="row" justifyContent="flex-end">
                <Tooltip title="Approve" arrow>
                  <IconButton onClick={() => handleApproval(row)}>
                    <TickIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject" arrow>
                  <IconButton onClick={() => handleReject(row?.id)}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <>-</>
            )}
          </TableCell>
        )}
      </TableRow>
      {open && (
        <ApproveLogHour open={open} onClose={handleCloseModal} enrolledId={id} approvalLogData={approvalLogData} />
      )}

      {openReject && <RejectForm enrolledId={id} logHourId={logHourId} open={openReject} onClose={handleCloseModal} />}
    </>
  );
}
