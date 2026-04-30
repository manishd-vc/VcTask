'use client';

import { LinearProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import { setInKindContributionRequestData } from 'src/redux/slices/finance';
import * as api from 'src/services';

import FinanceApprovalForm from './financeApprovalForm';
import FinanceContributionDetails from './financeContributionDetails';
import FinanceInformation from './FinanceInformation';
import FinancePageHeader from './financePageHeader';
import RequestDetails from './RequestDetails';

export default function InKindContributionView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const contributionData = useSelector((state) => state?.finance?.inKindContributionRequestData);

  const { isLoading } = useQuery(['financeInKindContribution', id], () => api.getInKindContributionById(id), {
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(setInKindContributionRequestData(data));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response?.data?.message, variant: 'error' }));
    }
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Stack spacing={3}>
      <FinancePageHeader data={contributionData} />
      <RequestDetails />
      <FinanceInformation />
      <FinanceContributionDetails />
      <FinanceApprovalForm />
    </Stack>
  );
}
