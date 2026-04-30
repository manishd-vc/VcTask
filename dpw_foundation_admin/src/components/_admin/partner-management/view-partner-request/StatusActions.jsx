import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import PartnershipNeedMoreInfo from 'src/components/dialog/PartnershipNeedMoreInfo';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerManagementApi from 'src/services/partner';
import { checkPermissions } from 'src/utils/permissions';
import RejectForm from '../../donor/assessment/rejectForm';
import ApproverAction from './ApproverAction';

export default function StatusActions({
  refetch,
  handleBack,
  handleCreateDocument,
  isLoading,
  isLetter,
  isSignDocument,
  handleFinalApproval,
  isFinalApprovalLoading
}) {
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [openNeedMoreInfo, setOpenNeedMoreInfo] = useState(false);
  const [stageType, setStageType] = useState(null);
  const [openReject, setOpenReject] = useState(false);

  const showNeedMoreBtn = partnerRequestData?.requestApprovalStages?.[0]?.status !== 'APPROVED';
  const approvalStatus = [
    'IN_PROGRESS_SECURITY',
    'IN_PROGRESS_HOD1',
    'IN_PROGRESS_COMPLIANCE',
    'IN_PROGRESS_HOD2',
    'IN_PROGRESS_DOC_HOD2',
    'IN_PROGRESS_DOC_HOD1',
    'IN_PROGRESS_LEGAL'
  ];
  const showLetter = ['IN_PROGRESS_DOC_CREATION'];

  const isShowLetter =
    showLetter.includes(partnerRequestData?.status) &&
    partnerRequestData?.adminAssignTo === user?.userId &&
    checkPermissions(rolesAssign, ['partner_manage_admin_manage']) &&
    isLetter;
  const handleOpenNeedMoreInfo = (stageType) => {
    setStageType(stageType);
    setOpenNeedMoreInfo(true);
  };
  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const renderApproverAction = () => {
    if (
      approvalStatus.includes(partnerRequestData?.status) &&
      checkPermissions(rolesAssign, [
        'partner_manage_security',
        'partner_manage_hod_first_level_review_approval',
        'partner_manage_compliance',
        'partner_manage_hod_second_level_review_approval',
        'partner_manage_legal'
      ]) &&
      partnerRequestData?.nextApproverId === user?.userId
    ) {
      return (
        <ApproverAction
          refetch={refetch}
          handleOpenNeedMoreInfo={handleOpenNeedMoreInfo}
          handleOpenReject={handleOpenReject}
          isSignDocument={isSignDocument}
        />
      );
    }
  };

  const partnerManagerAction = () => {
    if (
      checkPermissions(rolesAssign, ['partner_manage']) &&
      partnerRequestData?.assignTo === user?.userId &&
      partnerRequestData?.status === 'IN_PROGRESS_ASSESSMENT'
    ) {
      return (
        <>
          {showNeedMoreBtn && (
            <Button
              variant="contained"
              color="warning"
              sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
              onClick={() => handleOpenNeedMoreInfo('PARTNER-MANAGER')}
            >
              Need more info
            </Button>
          )}
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

  const { mutate: rejectPartnershipRequest, isLoading: isRejectLoading } = useMutation(
    partnerManagementApi.rejectPartnershipRequest,
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

  const handleReject = (values) => {
    rejectPartnershipRequest({
      entityId: partnerRequestData?.id,
      payload: {
        approvalStatus: values.status,
        content: values.reason
      }
    });
  };

  const renderLetterAction = () => {
    if (isShowLetter) {
      return (
        <>
          <Button
            variant="outlined"
            color="primary"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={handleBack}
            disabled={isLoading === 'save' || isLoading === 'submit'}
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            variant="outlined"
            color="inherit"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={() => handleCreateDocument('save')}
            disabled={isLoading === 'submit'}
            loading={isLoading === 'save'}
          >
            Save as Draft
          </LoadingButton>
          <LoadingButton
            type="button"
            variant="contained"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={() => handleCreateDocument('submit')}
            disabled={isLoading === 'save'}
            loading={isLoading === 'submit'}
          >
            Submit
          </LoadingButton>
        </>
      );
    }
  };

  const renderSignDocumentAction = () => {
    if (isSignDocument) {
      return (
        <>
          <Button variant="outlined" color="primary" onClick={() => router.back()} disabled={isFinalApprovalLoading}>
            Cancel
          </Button>
          <LoadingButton
            type="button"
            variant="contained"
            disabled={!partnerRequestData?.adminSignPresignedUrl}
            onClick={handleFinalApproval}
            loading={isFinalApprovalLoading}
          >
            Submit
          </LoadingButton>
        </>
      );
    }
  };

  return (
    <>
      {renderLetterAction()}

      {renderApproverAction()}
      {partnerManagerAction()}
      {renderSignDocumentAction()}

      {openNeedMoreInfo && (
        <PartnershipNeedMoreInfo
          open={openNeedMoreInfo}
          onClose={() => setOpenNeedMoreInfo(false)}
          stageType={stageType}
          data={partnerRequestData}
          backTo={'/admin/partnership-request'}
        />
      )}
      {openReject && (
        <RejectForm
          donationPledgeId={partnerRequestData?.partnershipUniqueId}
          open={openReject}
          onClose={() => setOpenReject(false)}
          onSubmit={handleReject}
          isLoading={isRejectLoading}
          type={'partner_manager'}
        />
      )}
    </>
  );
}
