'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// api
// component
import { Dialog } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import FundRaisingCampaign from 'src/components/table/rows/fundRaisingCampaign';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear } from 'src/utils/formatTime';

// Table header configuration
/**
 * Table head configuration used for displaying campaign data.
 * Contains column ids, labels, alignment, and sorting options.
 */
const TABLE_HEAD = [
  { id: 'campaignNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'campaignTitle', label: 'Campaign Name', alignRight: false, sort: true },
  { id: 'startDateTime', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDateTime', label: 'End Date', alignRight: false, sort: true },
  { id: 'campaignTargetRequired', label: 'Target Amount', alignRight: false, sort: true },
  { id: 'campaignTargetAchieved', label: 'Target Achieved', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Actions', alignRight: true } // Placeholder for actions column
];

FundraisingCampaign.propTypes = {};

/**
 * FundraisingCampaign component displays a paginated, filterable table of fundraising campaigns.
 * It allows the user to filter by status, date range, and search terms.
 */
export default function FundraisingCampaign() {
  const dispatch = useDispatch();
  const { user } = useSelector(({ user }) => user);
  const { masterData } = useSelector((state) => state.common);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const rowsPerPage = searchParams.get('rowsPerPage');
  const searchParam = searchParams.get('search');
  const statusParams = searchParams.get('status');
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);

  // Populate status options on component mount

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
   * Fetches campaign data based on filters like page, search term, status, and date range.
   * Updates the table rows state with the fetched data.
   */
  const { isLoading, isFetching, refetch } = useQuery(
    ['campaign', pageParam, searchParam, statusParams, fromDate, toDate, rowsPerPage],
    () =>
      api.getCampaignByAdminsByAdmin(
        +pageParam || 1, // Default to page 1 if no page param is provided
        searchParam || '', // Default to empty search term if no search param
        'FUNDCAMP', // Campaign type is 'FUNDCAMP'
        statusParams, // Status filter
        (fromDate && fDateShortYear(fromDate)) || '', // Format start date if provided
        (toDate && fDateShortYear(toDate)) || '', // Format end date if provided
        rowsPerPage || 10 // Rows per page filter
      ),
    {
      enabled: true,
      refetchOnWindowFocus: false, // Prevent refetching on window focus
      onSuccess: (data) => {
        const rows = data?.data?.content;
        const count = data?.data?.totalPages;
        const totalElements = data?.data?.totalElements;
        setTableRows({
          count: count,
          data: rows,
          totalElements: totalElements
        });
      },
      onError: (err) => {
        // Show error toast if API request fails
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  /**
   * Opens the modal to view more details about a campaign.
   * Sets the campaign ID to be viewed.
   */
  const handleClickOpen = (prop) => () => {
    setOpen(true);
    setId(prop);
  };

  /**
   * Closes the modal for viewing campaign details.
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
      type: 'FUNDCAMP',
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
        row={FundRaisingCampaign}
        setId={setId}
        id={setId}
        totalCountText={`All Campaigns`}
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
