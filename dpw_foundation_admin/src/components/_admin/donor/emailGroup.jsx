'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Components
import EmailGroupRow from 'src/components/table/rows/emailGroup';
import Table from 'src/components/table/table';

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
 * EmailGroup Component
 *
 * A table-based component to display and manage email groups with filtering, pagination,
 * and status-based filtering capabilities.
 *
 * @returns {JSX.Element} - Rendered EmailGroup component
 */
export default function EmailGroup() {
  // State and hooks
  const searchParams = useSearchParams();

  // Extract query parameters
  const statusParams = searchParams.get('status');

  // Local state
  const [setId] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tableRows] = useState({
    count: 0,
    data: [{ status: 'INTENT_PROVIDED' }, { status: 'REJECTED' }, { status: 'APPROVED' }],
    totalElements: 0
  });
  const [status] = useState([]);
  const isLoading = false;

  /**
   * Handles opening a modal or performing an action when a table row is clicked.
   *
   * @param {any} prop - Data associated with the clicked row
   * @returns {void}
   */
  const handleClickOpen = (prop) => () => {
    setId(prop);
  };

  return (
    <Table
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading}
      row={EmailGroupRow}
      setId={setId}
      id={setId}
      totalCountText="Email Group"
      allCount={tableRows?.totalElements}
      isSearch
      handleClickOpen={handleClickOpen}
      filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
      isDatePicker
      setFromDate={setFromDate}
      setToDate={setToDate}
      dateValues={[fromDate, toDate]}
    />
  );
}
