'use client';
import { Stack } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import MoreInfoView from 'src/components/_admin/donor/needInfo';
import LoadingFallback from 'src/components/loadingFallback';
import { setInKindContributionRequestData } from 'src/redux/slices/beneficiary';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getBeneficiaryStatus } from 'src/utils/getBeneficiaryStatus';
import ApprovalForm from './approval-form';
import ContributionRequestForm from './contribution-request-form';
import BeneficiaryInformation from './index';
import PageHeader from './page-header';
import RequestDetails from './request-details';

export default function InKindContributionView() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Check if coming from beneficiary list view
  const isFromBeneficiaryList = searchParams.has('beneficiary-list');
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  const { masterData } = useSelector((state) => state?.common);

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

  const showNeedMoreInfoBox =
    (feedbackStatus === 'FEEDBACK_REQUESTED' || status === 'FEEDBACK_REQUESTED') &&
    (approverNotes || adminNotes) &&
    !(feedbackStatus === 'FEEDBACK_REQUESTED' && status === 'REJECTED');

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader />
      {!isFromBeneficiaryList && <RequestDetails />}
      {!isFromBeneficiaryList && showNeedMoreInfoBox && (
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
      <ApprovalForm />
    </Stack>
  );
}
