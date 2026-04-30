'use client';
import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import LoadingFallback from 'src/components/loadingFallback';
import { setGrantRequestData } from 'src/redux/slices/grant';
import * as grantManagementApi from 'src/services/grantManagement';
import GrantRequestInformation from './grant-request-information';
import GrantSeekerInformation from './grant-seeker-information';
import PageHeader from './page-header';
import RequestApproval from './request-approval';
import RequestDetails from './request-details';

export default function ViewRequest({ isLetter = false, isSignDocument = false }) {
  const { grantId } = useParams();
  const dispatch = useDispatch();
  const [loadingType] = useState(null);

  const { isLoading, refetch } = useQuery(
    ['grantRequest', grantManagementApi.fetchGrantRequestById, grantId],
    () => grantManagementApi.fetchGrantRequestById(grantId),
    {
      enabled: !!grantId,
      onSuccess: (data) => {
        dispatch(setGrantRequestData(data));
      }
    }
  );

  const { data: documentsList } = useQuery(['getGrantDocumentsList', grantId], () =>
    grantManagementApi.getGrantDocumentsList({ entityId: grantId }, { enabled: !!grantId })
  );

  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <>
      <PageHeader refetch={refetch} isLoading={loadingType} isLetter={isLetter} isSignDocument={isSignDocument} />
      <Stack spacing={3}>
        <RequestDetails />
        <GrantSeekerInformation />
        <GrantRequestInformation documentsList={documentsList} />
        <RequestApproval />
      </Stack>
    </>
  );
}
