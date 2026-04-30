import { Button, IconButton, Stack } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import BeneficiaryNeedMoreInfo from 'src/components/dialog/BeneficiaryNeedMoreInfo';
import { PrintIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { checkPermissions } from 'src/utils/permissions';
import RejectForm from '../../donor/assessment/rejectForm';
import ApproverAction from './ApproverAction';
export default function StatusActions({ refetch }) {
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [openNeedMoreInfo, setOpenNeedMoreInfo] = useState(false);
  const [stageType, setStageType] = useState(null);
  const [openReject, setOpenReject] = useState(false);

  const {
    id,
    assistanceRequested,
    inkindItemStatus,
    cashPaymentStatus,
    status,
    nextApproverId,
    contributionUniqueId,
    storeManagerAssignTo,
    assignTo
  } = inKindContributionRequestData || {};

  const approvalStatus = ['IN_PROGRESS_SECURITY', 'IN_PROGRESS_HOD1', 'IN_PROGRESS_COMPLIANCE', 'IN_PROGRESS_HOD2'];

  const handleOpenNeedMoreInfo = (stageType) => {
    setStageType(stageType);
    setOpenNeedMoreInfo(true);
  };

  const { mutate: rejectBeneficiaryRequest, isLoading: isRejectLoading } = useMutation(
    beneficiaryApi.rejectInKindContributionRequest,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message, title: 'Request Rejected', variant: 'success' }));
        setOpenReject(false);
        router.back();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const { mutate: completeRequest, isLoading: isCompleteLoading } = useMutation(
    beneficiaryApi.completeInKindContributionRequest,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message || 'Request completed successfully', variant: 'success' }));
        router.back();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const handleReject = (values) => {
    rejectBeneficiaryRequest({
      entityId: id,
      payload: {
        content: values.reason
      }
    });
  };

  const handleComplete = () => {
    completeRequest({
      slug: id,
      payload: { notes: 'Completed' }
    });
  };

  const renderApproverAction = () => {
    if (
      approvalStatus.includes(status) &&
      checkPermissions(rolesAssign, [
        'contribution_security',
        'contribution_hod_first_level_review_approval',
        'contribution_hod_second_level_review_approval',
        'contribution_compliance',
        'contribution_manage'
      ]) &&
      nextApproverId === user?.userId
    ) {
      return (
        <ApproverAction
          refetch={refetch}
          handleOpenNeedMoreInfo={handleOpenNeedMoreInfo}
          handleOpenReject={handleOpenReject}
        />
      );
    }
  };

  const beneficiaryManagerAction = () => {
    if (
      checkPermissions(rolesAssign, ['contribution_manage']) &&
      assignTo === user?.userId &&
      status === 'IN_PROGRESS_ASSESSMENT'
    ) {
      return (
        <>
          <Button
            variant="contained"
            color="warning"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={() => handleOpenNeedMoreInfo('ADMIN-CONTRIBUTION')}
          >
            Need More Info
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={() => handleOpenReject()}
          >
            Reject
          </Button>
        </>
      );
    }
  };

  const showCompleteButton =
    status === 'APPROVED' &&
    checkPermissions(rolesAssign, ['contribution_manage']) &&
    (assistanceRequested === 'mixed' ? inkindItemStatus === 'Processed' && cashPaymentStatus === 'Processed' : true) &&
    (assistanceRequested === 'inkind' ? inkindItemStatus === 'Processed' : true);

  return (
    <Stack
      justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
      flexDirection="row"
      gap={2}
      flexWrap="wrap"
      alignItems={'center'}
      sx={{ mb: 3 }}
    >
      <IconButton width="40px" height="40px">
        <PrintIcon />
      </IconButton>
      {renderApproverAction()}
      {beneficiaryManagerAction()}
      {storeManagerAssignTo &&
        status === 'APPROVED' &&
        inkindItemStatus !== 'PROCESSED' &&
        inkindItemStatus !== 'Processed' &&
        checkPermissions(rolesAssign, ['contribution_store_manager']) && (
          <Button
            variant="contained"
            color="primary"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={() => router.push(`/admin/in-kind-contribution-requests/${id}/update`)}
          >
            Update InKind Item
          </Button>
        )}
      {showCompleteButton && (
        <Button
          variant="contained"
          color="warning"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          onClick={handleComplete}
          disabled={isCompleteLoading}
        >
          Complete
        </Button>
      )}

      {openNeedMoreInfo && (
        <BeneficiaryNeedMoreInfo
          open={openNeedMoreInfo}
          onClose={() => setOpenNeedMoreInfo(false)}
          stageType={stageType}
          data={inKindContributionRequestData}
          backTo={'/admin/in-kind-contribution-requests'}
        />
      )}
      {openReject && (
        <RejectForm
          donationPledgeId={contributionUniqueId}
          open={openReject}
          onClose={() => setOpenReject(false)}
          onSubmit={handleReject}
          isLoading={isRejectLoading}
          type={'contribution_manage'}
        />
      )}
    </Stack>
  );
}
