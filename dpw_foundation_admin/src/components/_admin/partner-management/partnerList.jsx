'use client';
import { Dialog } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import PartnershipRequestsRow from 'src/components/table/rows/partnershipRequestsRow';
import Table from 'src/components/table/table';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnershipApi from 'src/services/partner';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';

const TABLE_HEAD = [
  { id: 'partnerId', label: 'ID', alignRight: false, sort: true },
  { id: 'partnerName', label: 'Partner Name', alignRight: false, sort: true },
  { id: 'partnerEmail', label: 'Email', alignRight: false, sort: true },
  { id: 'country', label: 'Country', alignRight: false, sort: true },
  { id: 'startDate', label: 'Start Date', alignRight: false, sort: true },
  { id: 'endDate', label: 'End Date', alignRight: false, sort: true },
  { id: 'noOfProjects', label: 'No. of Projects', alignRight: false, sort: true },
  { id: 'agreementType', label: 'Agreement Type', alignRight: false, sort: true },
  { id: 'noOfReports', label: 'No. of Reports', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'action', label: 'Action', alignRight: true }
];

export default function PartnerList() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  // Query parameters
  const statusParams = searchParams.get('status');
  const pageParam = searchParams.get('page') || 1;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const { masterData } = useSelector((state) => state?.common);
  const partnershipStatus = getLabelObject(masterData, 'dpwf_partnership_status');
  const [open, setOpen] = useState(false);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });
  const [status, setStatus] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [id, setId] = useState(null);

  const { mutate: exportMutate } = useMutation('exportPartners', partnershipApi.exportPartners, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { isLoading, isFetching, refetch } = useQuery(
    ['partnershipRequests', pageParam, rowsParam, searchParam, statusParams, fromDate, toDate],
    () =>
      partnershipApi.partnershipPagination({
        page: +pageParam,
        rows: +rowsParam,
        sort: '',
        payload: {
          keyword: searchParam || '',
          statuses: statusParams ? [statusParams] : [],
          createdDate: {
            fromDate: fromDate ? fDateShortYear(fromDate) : '',
            toDate: toDate ? fDateShortYear(toDate) : ''
          },
          datePattern: getLocaleDateString()
        }
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        setTableRows({ count, data: rows, totalElements });
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
      }
    }
  );

  useEffect(() => {
    if (partnershipStatus) {
      const statusData = [];
      for (const data of partnershipStatus?.values) {
        statusData.push({
          id: data?.code,
          title: data?.label
        });
      }
      setStatus(statusData);
    }
  }, [partnershipStatus]);

  const handleClickOpen = (prop) => {
    setId(prop);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onExport = () => {
    const obj = {
      keyword: searchParam || '',
      statuses: statusParams ? [statusParams] : [],
      createdDate: {
        fromDate: fromDate ? fDateShortYear(fromDate) : '',
        toDate: toDate ? fDateShortYear(toDate) : ''
      },
      datePattern: getLocaleDateString(),
      page: +pageParam,
      rows: +rowsParam
    };
    exportMutate(obj);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'sm'}>
        <GeneralDialog
          onClose={handleClose}
          id={id}
          refetch={refetch}
          endPoint={'assignPartnershipRequestByAdmin'}
          deleteMessage={
            'By selecting this request, you are confirming your ownership and responsibility for its follow-up. Once assigned, it will be removed from the view of other approvers and routed exclusively to you for further action.'
          }
          dialogTitle={'Confirm'}
          btnTitle={'Yes'}
          payload={{
            assignType: 'self'
          }}
          apiType="PARTNER"
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={tableRows}
        isLoading={isLoading || isFetching}
        setId={setId}
        id={setId}
        row={PartnershipRequestsRow}
        totalCountText="Partnership Requests"
        allCount={tableRows?.totalElements}
        handleClickOpen={handleClickOpen}
        isSearch
        filters={[{ name: 'Status', param: 'status', data: status, value: statusParams }]}
        isDatePicker
        setFromDate={setFromDate}
        setToDate={setToDate}
        dateValues={[fromDate, toDate]}
        isExport={true}
        onExport={onExport}
        refetch={refetch}
      />
    </>
  );
}
