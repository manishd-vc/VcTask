import { Grid } from '@mui/material';
import LogActivityTable from 'src/components/table/LogActivityTable';

const ActivityLogDetails = ({
  enrollmentData,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  refetchTable,
  setTotalHours
}) => {
  return (
    <>
      <Grid item xs={12} mt={3}>
        <LogActivityTable
          enrollmentData={enrollmentData}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          refetchTable={refetchTable}
          setTotalHours={setTotalHours}
        />
      </Grid>
    </>
  );
};

export default ActivityLogDetails;
