import LogActivityTable from 'src/components/table/LogActivityTable';

const ActivityLogDetails = ({ enrollmentData }) => {
  return (
    <>
      <LogActivityTable enrollmentData={enrollmentData} />
    </>
  );
};

export default ActivityLogDetails;
