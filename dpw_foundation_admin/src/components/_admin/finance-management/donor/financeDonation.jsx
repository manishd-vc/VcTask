'use client';

import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import { setFinanceDonationData } from 'src/redux/slices/finance';
import * as finance from 'src/services/finance';

import LoadingFallback from 'src/components/loadingFallback';
import AcceptanceLetter from './AcceptanceLetter';
import DonationForm from './DonationForm';
import FinancePageHeader from './FinancePageHeader';
import IntentDetails from './IntentDetails';
import RecordDetails from './RecordDetails';
import Step2Form from './Step2Form';

export default function FinanceDonation() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const donationData = useSelector((state) => state?.finance?.financeDonationData);

  const { isLoading } = useQuery(['campaignFinanceDonation', id], () => finance.fetchDonationRequestById(id), {
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(setFinanceDonationData(data));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
    }
  });

  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <Stack spacing={3}>
      <FinancePageHeader data={donationData} />
      <RecordDetails />
      <IntentDetails />
      <DonationForm isViewOnly={true} />
      <Step2Form />
      <AcceptanceLetter viewModeOn={true} />
    </Stack>
  );
}
