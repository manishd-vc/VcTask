'use client';
import { LinearProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import MoreInfoView from 'src/components/needInfo';
import { setInKindContributionRequestData } from 'src/redux/slices/beneficiary';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getBeneficiaryStatus } from 'src/utils/getBeneficiaryStatus';
import ContributionRequestForm from './contribution-request-form';
import BeneficiaryInformation from './index';
import PageHeader from './page-header';
import RequestDetails from './request-details';
export default function InKindContributionView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);

  const { data: inKindContributionRequestData, isLoading } = useQuery(
    ['inKindContributionRequest', id],
    () => beneficiaryApi.getInKindContributionById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setInKindContributionRequestData(data?.data));
      }
    }
  );

  const {
    status,
    feedbackStatus,
    adminNotes,
    adminNeedInfoFileName,
    adminNeedInfoId,
    approverNotes,
    approverNeedInfoFileName,
    approverNeedInfoId
  } = inKindContributionRequestData || {};

  const chipLabel = useMemo(() => {
    return getBeneficiaryStatus(masterData, status, feedbackStatus);
  }, [masterData, status, feedbackStatus]);

  const needMoreInfoMessage = useMemo(() => {
    if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return approverNotes;
    } else {
      return adminNotes;
    }
  }, [feedbackStatus, approverNotes, adminNotes]);

  const needMoreFileName = useMemo(() => {
    if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return approverNeedInfoFileName;
    } else {
      return adminNeedInfoFileName;
    }
  }, [feedbackStatus, approverNeedInfoFileName, adminNeedInfoFileName]);

  const needMoreAttachment = useMemo(() => {
    if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return approverNeedInfoId;
    } else {
      return adminNeedInfoId;
    }
  }, [feedbackStatus, approverNeedInfoId, adminNeedInfoId]);

  const showNeedMoreInfoBox = status === 'FEEDBACK_REQUESTED' && (approverNotes || adminNotes);

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <Stack spacing={3}>
        <PageHeader />
        <RequestDetails />
        {showNeedMoreInfoBox && (
          <MoreInfoView
            chipLabel={chipLabel}
            message={needMoreInfoMessage}
            fileName={needMoreFileName}
            attachment={needMoreAttachment}
            spacing={false}
          />
        )}
        <BeneficiaryInformation />
        <ContributionRequestForm />
      </Stack>
    </>
  );
}
