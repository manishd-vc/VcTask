'use client';

// api
// component
import { Dialog } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import CharitableProgramsRows from 'src/components/table/rows/charitablePrograms';
import Table from 'src/components/table/table';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
const TABLE_HEAD = [
  { id: 'campaignNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'campaignTitle', label: 'Project Name', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'estimatedDistributionValue', label: 'Estimated Amount', alignRight: false, sort: true },
  { id: 'actualDistributionValue', label: 'Actual Dispensed', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

CharitablePrograms.propTypes = {};

/**
 * CharitablePrograms component renders a table of charitable programs.
 * It includes filters for search, status, and date ranges and displays the data in a paginated format.
 *
 * @returns {JSX.Element} Rendered charitable programs list
 */
export default function CharitablePrograms() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { user } = useSelector(({ user }) => user);
  const { masterData } = useSelector((state) => state.common);
  // Extract query parameters for pagination and filtering
  const pageParam = searchParams.get('page');
  const rowsPerPage = searchParams.get('rowsPerPage');
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');

  // Local state to store program details, status list, and modals
  const [id, setId] = useState(null);
  const [status, setStatus] = useState([]);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  // Initialize the status list from the Masterdata
  useEffect(() => {
    const filterOption = getLabelObject(masterData, 'dpw_foundation_campaign_status');
    const statusOptions =
      filterOption?.values.map((item) => ({
        id: item.code,
        name: item.description
      })) || [];
    setStatus(statusOptions);
  }, [masterData]);

  /**
   * Fetch data from the API based on the current filters.
   * Uses react-query for data fetching and caching.
   */
  const { isLoading, isFetching, refetch } = useQuery(
    ['campaign', pageParam, searchParam, statusParams, fromDate, toDate, rowsPerPage],
    () =>
      api.getCampaignByAdminsByAdmin(
        +pageParam || 1,
        searchParam || '',
        'CHARITY', // Specific category for charitable programs
        statusParams,
        (fromDate && fDateShortYear(fromDate)) || '',
        (toDate && fDateShortYear(toDate)) || '',
        rowsPerPage || 10
      ),
    {
      enabled: true,
      refetchOnWindowFocus: false, // Avoid fetching when the window refocuses
      onSuccess: (data) => {
        const rows = data?.data?.content;
        const count = data?.data?.totalPages;
        const totalElements = data?.data?.totalElements;
        const updatedRows = rows.map((row) => {
          return {
            ...row,
            quantityAchieved: row.campaignInKindContributions?.[0]?.quantityAchieved || 'N/A',
            targetQuantity: row.campaignInKindContributions?.[0]?.targetQuantity || 'N/A'
          };
        });
        setTableRows({
          count: count,
          data: updatedRows,
          totalElements: totalElements
        });
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  /**
   * Open the modal for a specific program by setting its ID.
   *
   * @param {string} prop - The ID of the selected program
   */
  const handleClickOpen = (prop) => () => {
    setOpen(true);
    setId(prop);
  };

  /**
   * Close the modal.
   */
  const handleClose = () => {
    setOpen(false);
  };

  const { mutate } = useMutation('export', api.exportCampaignByAdminsByAdmin, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      page: +pageParam || 1,
      rows: +rowsPerPage || 10,
      sort: 'campaignTitle',
      type: 'CHARITY',
      search: searchParam || '',
      status: statusParams,
      fromDate: (fromDate && fDateShortYear(fromDate)) || '',
      toDate: (toDate && fDateShortYear(toDate)) || '',
      curentUserId: user?.userId
    };
    mutate(obj);
  };
  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <GeneralDialog
          onClose={handleClose}
          id={id}
          refetch={refetch}
          endPoint="deleteCampaignByAdmin"
          type={'Campaign deleted'}
          deleteMessage={
            'Are you sure you want to delete this campaign? Please consider carefully before making irreversible changes.'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        row={CharitableProgramsRows}
        setId={setId}
        id={setId}
        totalCountText={`All Projects`}
        allCount={tableRows?.totalElements}
        isSearch
        handleClickOpen={handleClickOpen}
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
        isDatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        isExport={true}
        onExport={onExport}
      />
    </>
  );
}
