'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Components
import SMSGroupRow from 'src/components/table/rows/emailGroup';
import Table from 'src/components/table/table';

// Define table head data
const TABLE_HEAD = [
  { id: 'donorNumericId', label: 'Donation ID', alignRight: false, sort: true },
  { id: 'donorTitle', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Donation Event', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'Donation Amount', alignRight: false, sort: true },
  { id: 'donorTargetRequired', label: 'Payment Mode', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: '', alignRight: true }
];

/**
 * SMSGroup Component
 *
 * This component renders a table to display and manage SMS groups. It includes features like search, filters, and date pickers for refined data handling.
 *
 * @returns {JSX.Element} - Rendered SMSGroup component
 */
export default function SMSGroup() {
  const isLoading = false; // Flag to indicate if data is loading

  // Get query parameters from the URL
  const searchParams = useSearchParams();
  const statusParams = searchParams.get('status');

  // Component states
  const [setId] = useState(null); // Selected ID
  const [fromDate, setFromDate] = useState(null); // Start date for filters
  const [toDate, setToDate] = useState(null); // End date for filters
  const [status] = useState([]); // Status filter data

  // Table rows state
  const [tableRows] = useState({
    count: 0,
    data: [{ status: 'INTENT_PROVIDED' }, { status: 'REJECTED' }, { status: 'APPROVED' }],
    totalElements: 0
  });

  /**
   * Opens the modal dialog for a specific row.
   *
   * @param {any} prop - Data associated with the selected row
   * @returns {Function} - Event handler for opening the modal
   */
  const handleClickOpen = (prop) => () => {
    setId(prop);
  };

  return (
    <Table
      headData={TABLE_HEAD} // Table header configuration
      data={tableRows} // Table rows data
      isLoading={isLoading} // Loading state
      row={SMSGroupRow} // Row component
      setId={setId} // Function to set selected ID
      id={setId} // Selected ID
      totalCountText="SMS Group" // Label for total count
      allCount={tableRows?.totalElements} // Total number of rows
      isSearch // Enable search functionality
      handleClickOpen={handleClickOpen} // Click handler for opening modal
      filters={[
        {
          name: 'Status',
          param: 'status',
          data: status,
          value: statusParams
        }
      ]} // Filter configuration
      isDatePicker // Enable date picker
      setFromDate={setFromDate} // Function to set start date
      setToDate={setToDate} // Function to set end date
      dateValues={[fromDate, toDate]} // Date picker values
    />
  );
}
