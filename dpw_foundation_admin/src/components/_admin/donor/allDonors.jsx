'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// api
// component
import AllDonorsRow from 'src/components/table/rows/allDonors';
import Table from 'src/components/table/table';

/**
 * Table headers for the All Donors table.
 */
const TABLE_HEAD = [
  { id: 'donorNumericId', label: 'Donation ID', alignRight: false, sort: true },
  { id: 'donorTitle', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Donation Event', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'Donation Amount', alignRight: false, sort: true },
  { id: 'donorTargetRequired', label: 'Payment Mode', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: '', alignRight: true }
];

AllDonors.propTypes = {};

export default function AllDonors() {
  // Extract search parameters from the URL
  const searchParams = useSearchParams();
  const statusParams = searchParams.get('status');

  // State hooks for managing the table data and UI
  const [setId] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status] = useState([]);

  /**
   * Handles the opening of a row detail dialog.
   * @param {any} prop - The ID or data associated with the row.
   */
  const handleClickOpen = (prop) => () => {
    setId(prop);
  };

  const onExport = () => {
    console.log('onExport= works');
  };

  return (
    <>
      {/* Table component for displaying All Donors data */}
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={false} // Placeholder for loading state
        row={AllDonorsRow}
        setId={setId}
        id={setId}
        totalCountText="All Donors"
        allCount={tableRows?.totalElements}
        isSearch // Enable search functionality
        handleClickOpen={handleClickOpen}
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
        isDatePicker // Enable date picker for filtering
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        isExport={true}
        onExport={onExport}
      />
    </>
  );
}
