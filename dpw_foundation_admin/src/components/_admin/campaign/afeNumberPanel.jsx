'use client';
import { Box, Button, Chip, Dialog, Paper, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import GeneralDialog from 'src/components/dialog/approval';
import CharitablePO from 'src/components/table/rows/charitablePO';
import Table from 'src/components/table/table';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';
import PurchaseOrderForm from './purchaseOrderForm';

// Table header definition
const TABLE_HEAD = [
  { id: 'purchaseOrderNo', label: 'PO #', alignRight: false, sort: true },
  { id: 'date', label: 'Date', alignRight: false, sort: true },
  { id: 'description', label: 'Description', alignRight: false, sort: true },
  { id: 'poValue', label: 'PO Value', alignRight: false, sort: true },
  { id: 'link', label: 'Uploaded Document', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

AfeNumberPanel.propTypes = {
  // 'data' is an object containing several nested properties
  data: PropTypes.shape({
    campaignTargetRequiredCurrency: PropTypes.string.isRequired, // example: string, adjust based on actual type
    id: PropTypes.string.isRequired, // example: string, adjust based on actual type
    aemNumber: PropTypes.string.isRequired, // example: string, adjust based on actual type
    balanceAmount: PropTypes.number.isRequired, // example: number, adjust based on actual type
    aemFundsAllocated: PropTypes.number.isRequired, // example: number, adjust based on actual type
    aemFundsRequired: PropTypes.number.isRequired, // example: number, adjust based on actual type
    data: PropTypes.shape({
      totalElements: PropTypes.number.isRequired, // example: number, adjust based on actual type
      totalPages: PropTypes.number.isRequired, // example: number, adjust based on actual type
      content: PropTypes.array.isRequired // example: array, adjust based on actual type
    }).isRequired
  }).isRequired,

  // 'dataRefetch' is a function
  dataRefetch: PropTypes.func.isRequired
};

export default function AfeNumberPanel({ data, dataRefetch }) {
  const dispatch = useDispatch();
  const fCurrency = useCurrencyFormatter(data?.campaignTargetRequiredCurrency); // Formatting currency
  const [openAddPO, setOpenAddPO] = useState(false);

  // Toggle for opening and closing the Add PO modal
  const handleClickOpenAddPO = () => setOpenAddPO(true);
  const handleCloseAddPO = () => setOpenAddPO(false);

  // Fetching search parameters from the URL query
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const tabParam = searchParams.get('tab');
  const statusParams = searchParams.get('status');

  // States for modal and table rows
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  // Fetching campaign POs with useQuery, passing necessary params
  const { isLoading, refetch } = useQuery(
    ['campaign', pageParam, searchParam, statusParams, tabParam],
    () => api.getCampaignPOByAdminsByAdmin(+pageParam || 1, searchParam || '', data?.id, '', ''),
    {
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        setTableRows({
          count: count,
          data: rows,
          totalElements: data?.data?.totalElements || 0
        });
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response?.data?.message || 'Error fetching data', variant: 'error' }));
      }
    }
  );

  // Open the modal for actions
  const handleClickOpen = (prop) => () => {
    setOpen(true);
    setId(prop); // Set the ID of the campaign PO
  };

  // Close the modal
  const handleClose = () => setOpen(false);

  // Mutation to add Purchase Order (PO)
  const { mutate: mutateAddPo, isLoading: addPoLoading } = useMutation(api.addPOCampaignByAdmin, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success', title: 'Purchase Order Submitted' }));
      handleCloseAddPO(); // Close the modal on success
      refetch(); // Refetch data to update the table
      dataRefetch(); // Trigger parent data refetch
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response?.data?.message, variant: 'error' }));
    }
  });

  // Handle PO submission
  const handleSubmitPO = (values) => {
    mutateAddPo({
      campaignId: data.id,
      poDate: fDateWithLocale(values.poDate), // Format the PO date
      ...values
    });
  };

  return (
    <>
      <Box sx={{ p: 3, my: 4, bgcolor: 'warning.dark' }}>
        <Chip
          variant="white"
          size="small"
          label={
            <>
              <strong>AFE Number</strong> - {data?.aemNumber || 'N/A'}
            </>
          }
        />
        <Stack
          rowGap={2}
          justifyContent="flex-start"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          flexWrap="wrap"
          sx={{ pt: 2 }}
        >
          <Typography variant="subtitle1" color="text.white">
            Fund Requested :
          </Typography>
          <Typography variant="body2" color="text.white">
            {data?.aemFundsRequired ? fCurrency(data?.aemFundsRequired) : '0.00'}
          </Typography>
          <Box sx={{ px: 2, display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.white">
              |
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.white">
            Fund Allocated :
          </Typography>
          <Typography variant="body2" color="text.white">
            {data?.aemFundsAllocated ? fCurrency(data?.aemFundsAllocated) : '0.00'}
          </Typography>
          <Box sx={{ px: 2, display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.white">
              |
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.white">
            Balance Fund :
          </Typography>
          <Typography variant="body2" color="text.white">
            {data?.balanceAmount ? fCurrency(data?.balanceAmount) : '0.00'}
          </Typography>
        </Stack>
      </Box>
      <Paper sx={{ p: 3, my: 4 }}>
        <Box sx={{ pb: 2 }}>
          <Stack
            gap={3}
            justifyContent="space-between"
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ pb: 1 }}
          >
            <Typography variant="h6" textTransform={'uppercase'} color="text.black">
              Purchase Order Details ({tableRows.data.length})
            </Typography>
            <Button variant="contained" size="small" onClick={handleClickOpenAddPO}>
              Add Purchase Order
            </Button>
          </Stack>
        </Box>
        <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
          <GeneralDialog
            onClose={handleClose}
            id={id}
            refetch={refetch}
            endPoint="deletePOByAdmin"
            type={'Purchase Order deleted'}
            deleteMessage={
              'Are you sure you want to delete this purchase order? Please consider carefully before making irreversible changes.'
            }
          />
        </Dialog>
        <Table
          allCount={tableRows.totalElements}
          totalCountText={''}
          headData={TABLE_HEAD}
          data={tableRows}
          isLoading={isLoading}
          row={CharitablePO}
          setId={setId}
          id={setId}
          isSearch={false}
          handleClickOpen={handleClickOpen}
          isDatePicker={false}
          className="innerTable"
        />
        <PurchaseOrderForm
          open={openAddPO}
          onClose={handleCloseAddPO}
          onSubmit={handleSubmitPO}
          isLoading={addPoLoading}
        />
      </Paper>
    </>
  );
}
