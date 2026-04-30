'use client';
import { LinearProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setInKindContributionRequestData } from 'src/redux/slices/beneficiary';
import * as beneficiaryApi from 'src/services/beneficiary';
import ApprovalForm from './approval-form';
import ContributionRequestForm from './contribution-request-form';
import BeneficiaryInformation from './index';
import PageHeader from './page-header';
import RequestDetails from './request-details';
export default function BeneficiaryView() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { isLoading } = useQuery(
    ['inKindContributionRequest', beneficiaryApi.getInKindContributionRequestById, id],
    () => beneficiaryApi.getInKindContributionRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setInKindContributionRequestData(data));
      }
    }
  );

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader />
      <RequestDetails />
      <BeneficiaryInformation />
      <ContributionRequestForm />
      <ApprovalForm />
    </Stack>
  );
}
