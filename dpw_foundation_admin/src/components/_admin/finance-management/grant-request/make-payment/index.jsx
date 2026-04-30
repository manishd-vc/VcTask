'use client';
import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import LoadingFallback from 'src/components/loadingFallback';
import { setGrantRequestData } from 'src/redux/slices/grant';
import * as financeApi from 'src/services/finance';
import PageHeader from './page-header';
import PaymentInfoForm from './payment-info-form';
import RequestDetails from './request-details';
export default function MakeGrantPayment() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loadingType] = useState(null);

  const { isLoading, refetch } = useQuery(
    ['grantRequest', financeApi.fetchGrantRequestById, id],
    () => financeApi.fetchGrantRequestById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setGrantRequestData(data));
      }
    }
  );

  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <>
      <PageHeader refetch={refetch} isLoading={loadingType} />
      <Stack spacing={3}>
        <RequestDetails />
        <PaymentInfoForm />
      </Stack>
    </>
  );
}
