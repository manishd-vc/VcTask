import { Box, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import CustomTable from 'src/components/_admin/my-enrolments/CustomTable';
import { TimerIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale, formatTime } from 'src/utils/formatTime';

const ActivityTableRow = ({ row, masterData, getStatusColor, showMilestoneId = true }) => (
  <TableRow hover key={row?.id}>
    {showMilestoneId && <TableCell>{row?.milestoneUniqueId || '-'}</TableCell>}
    <TableCell>{row?.milestoneDescription || '-'}</TableCell>
    <TableCell>{row?.checkInTime ? formatTime(row?.checkInTime) : '-'}</TableCell>
    <TableCell>{row?.checkOutTime ? formatTime(row?.checkOutTime) : '-'}</TableCell>
    <TableCell>{row?.logHours || '-'}</TableCell>
    <TableCell>{row?.updatedByName || '-'}</TableCell>
    <TableCell>{row?.updatedOn ? `${fDateWithLocale(row?.updatedOn)} ${formatTime(row?.updatedOn)}` : '-'}</TableCell>
    <TableCell>
      <Chip
        label={getLabelByCode(masterData, 'dpwf_log_activity_status', row?.status) || row?.status}
        color={getStatusColor(row?.status)}
        size="small"
      />
    </TableCell>
  </TableRow>
);

export default function ActivityTable({
  loggedHours,
  paginationData,
  page,
  setPage,
  size,
  setSize,
  isLoading,
  totalApprovedHours,
  status,
  setStatus,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  searchKeyword,
  setSearchKeyword,
  handleExport,
  refetch,
  showMilestoneId = true,
  showSearch = true,
  showFilters = true,
  showDatePicker = true
}) {
  const { masterData } = useSelector((state) => state?.common);
  const logActivityStatus = getLabelObject(masterData, 'dpwf_log_activity_status');

  const getStatusColor = (status) => {
    const statusColors = { APPROVED: 'success', SUBMITTED: 'warning', REJECTED: 'error' };
    return statusColors[status] || 'default';
  };

  const headData = [
    ...(showMilestoneId ? [{ id: 'milestoneUniqueId', label: 'Milestone ID', alignRight: false }] : []),
    { id: 'milestoneDescription', label: 'Milestone Description', alignRight: false },
    { id: 'checkInTime', label: 'Check In Time', alignRight: false },
    { id: 'checkOutTime', label: 'Check Out Time', alignRight: false },
    { id: 'logHours', label: 'Log Hours', alignRight: false },
    { id: 'updatedByName', label: 'Last Updated By', alignRight: false },
    { id: 'updatedOn', label: 'Last Updated On', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false }
  ];

  return (
    <CustomTable
      headData={headData}
      data={{
        count: paginationData?.totalElements || loggedHours?.length || 0,
        data: loggedHours || [],
        totalElements: paginationData?.totalElements || loggedHours?.length || 0
      }}
      page={page}
      setPage={setPage}
      size={size}
      setSize={setSize}
      isLoading={isLoading}
      row={ActivityTableRow}
      masterData={masterData}
      getStatusColor={getStatusColor}
      showMilestoneId={showMilestoneId}
      totalCountText={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            LOGGED HOURS ({paginationData?.totalElements || loggedHours?.length || 0})
          </Typography>
          <TimerIcon />
          <Typography variant="body2" color="primary.main">
            TOTAL APPROVED HOURS: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{totalApprovedHours}</span>
          </Typography>
        </Box>
      }
      isSearch={showSearch}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
      filters={
        showFilters
          ? [
              {
                name: 'Status',
                param: 'status',
                data: logActivityStatus?.values?.map((item) => ({ id: item.code, title: item.label })) || [
                  { id: 'APPROVED', title: 'Approved' },
                  { id: 'SUBMITTED', title: 'Submitted' },
                  { id: 'REJECTED', title: 'Rejected' }
                ],
                value: status,
                setValue: setStatus
              }
            ]
          : []
      }
      isDatePicker={showDatePicker}
      setFromDate={setFromDate}
      setToDate={setToDate}
      dateValues={[fromDate, toDate]}
      isExport={true}
      onExport={handleExport}
      refetch={refetch}
    />
  );
}
