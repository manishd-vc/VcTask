'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as financeApi from 'src/services/finance';
import { fDateShortYear, getLocaleDateString } from 'src/utils/formatTime';
import FinanceDonationRow from './financeDonationRow';
import TableWithMultipleFilter from './tableWithMultipleFilter';

const TABLE_HEAD = [
  { id: 'donorNumericId', label: 'ID', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date & Time', alignRight: false, sort: true },
  { id: 'donatedBy', label: 'Donated By', alignRight: false, sort: true },
  { id: 'donationType', label: 'Donation Type', alignRight: false, sort: true },
  { id: 'donationProject', label: 'Donation Project', alignRight: false, sort: true },
  { id: 'country', label: 'Country', alignRight: false, sort: true },
  { id: 'donationAmount', label: 'Donation Amount', alignRight: false, sort: true },
  { id: 'donorType', label: 'Donor Type', alignRight: false, sort: true },
  { id: 'iacadPermit', label: 'IACAD Permit', alignRight: false, sort: true },
  { id: 'receiptVoucher', label: 'Receipt Voucher', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function FinanceDonations() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get('page') || 0;
  const rowsParam = searchParams.get('rowsPerPage') || 10;
  const searchParam = searchParams.get('search');
  const statusParam = searchParams.get('status');
  const idParam = searchParams.get('id');
  const donatedByParam = searchParams.get('donatedBy');
  const projectParam = searchParams.get('project');
  const donationTypeParam = searchParams.get('donationType');
  const donationAmountParam = searchParams.get('donationAmount');
  const donorTypeParam = searchParams.get('donorType');
  const iacadPermitNumberParam = searchParams.get('iacadPermitNumber');
  const receiptVoucherParam = searchParams.get('receiptVoucher');
  const countryParam = searchParams.get('country');

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const { isLoading, isFetching, refetch } = useQuery(
    [
      'financeDonationPagination',
      pageParam,
      rowsParam,
      searchParam,
      statusParam,
      fromDate,
      toDate,
      idParam,
      donatedByParam,
      projectParam,
      donationTypeParam,
      donationAmountParam,
      donorTypeParam,
      iacadPermitNumberParam,
      receiptVoucherParam,
      countryParam
    ],
    () =>
      financeApi.financeDonationPagination({
        page: +pageParam,
        rows: +rowsParam,
        sort: '',
        payload: {
          keyword: searchParam || '',
          statuses: statusParam ? [statusParam] : [],
          createdDate: {
            fromDate: fromDate ? fDateShortYear(fromDate) : '',
            toDate: toDate ? fDateShortYear(toDate) : ''
          },
          datePattern: getLocaleDateString(),
          id: idParam || '',
          donatedBy: donatedByParam || '',
          campaign: projectParam ? [projectParam] : [],
          donationType: donationTypeParam ? [donationTypeParam] : [],
          donorType: donorTypeParam ? [donorTypeParam] : [],
          donationAmount: donationAmountParam ? +donationAmountParam : null,
          iacadPermitId: iacadPermitNumberParam || '',
          receiptVoucher: receiptVoucherParam || '',
          country: countryParam ? [countryParam] : []
        }
      }),
    {
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

  const { mutate: exportMutate } = useMutation('export-finance-donation', financeApi.exportFinanceDonation, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      page: +pageParam,
      rows: +rowsParam,
      sort: '',
      payload: {
        keyword: searchParam || '',
        statuses: statusParam ? [statusParam] : [],
        createdDate: {
          fromDate: fromDate ? fDateShortYear(fromDate) : '',
          toDate: toDate ? fDateShortYear(toDate) : ''
        },
        datePattern: getLocaleDateString(),
        id: idParam || '',
        donatedBy: donatedByParam || '',
        campaign: projectParam ? [projectParam] : [],
        donationType: donationTypeParam ? [donationTypeParam] : [],
        donorType: donorTypeParam ? [donorTypeParam] : [],
        donationAmount: donationAmountParam ? +donationAmountParam : null,
        iacadPermitId: iacadPermitNumberParam || '',
        receiptVoucher: receiptVoucherParam || '',
        country: countryParam ? [countryParam] : []
      }
    };
    exportMutate(obj);
  };

  return (
    <TableWithMultipleFilter
      headData={TABLE_HEAD}
      data={tableRows}
      isLoading={isLoading || isFetching}
      row={FinanceDonationRow}
      totalCountText="All Donations"
      allCount={tableRows?.totalElements}
      setFromDate={setFromDate}
      setToDate={setToDate}
      dateValues={[fromDate, toDate]}
      isExport={true}
      onExport={onExport}
      refetch={refetch}
    />
  );
}
