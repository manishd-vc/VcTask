import { LoadingButton } from '@mui/lab';
import { Button, IconButton, Stack } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GrantNeedMoreInfo from 'src/components/dialog/GrantNeedMoreInfo';
import { PrintIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as grantManagementApi from 'src/services/grantManagement';
import { checkPermissions } from 'src/utils/permissions';
import RejectForm from '../../donor/assessment/rejectForm';
import ApproverAction from './ApproverAction';
import IcadApproverAction from './IcadApproverAction';

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
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [openNeedMoreInfo, setOpenNeedMoreInfo] = useState(false);
  const [stageType, setStageType] = useState(null);
  const [openReject, setOpenReject] = useState(false);

  const showNeedMoreBtn = grantRequestData?.requestApprovalStages?.[0]?.status !== 'APPROVED';

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
    showLetter.includes(grantRequestData?.status) &&
    grantRequestData?.adminAssignTo === user?.userId &&
    checkPermissions(rolesAssign, ['grant_manage_admin_manage']) &&
    isLetter;

  const handleOpenNeedMoreInfo = (stageType) => {
    setStageType(stageType);
    setOpenNeedMoreInfo(true);
  };

  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const renderSecurityApproverAction = () => {
    if (
      grantRequestData?.status === 'IN_PROGRESS_IACAD' &&
      checkPermissions(rolesAssign, ['grant_manage_iacad_operations']) &&
      grantRequestData?.nextApproverId === user?.userId
    ) {
      return <IcadApproverAction refetch={refetch} handleOpenNeedMoreInfo={handleOpenNeedMoreInfo} />;
    }
  };

  const renderApproverAction = () => {
    if (
      approvalStatus.includes(grantRequestData?.status) &&
      checkPermissions(rolesAssign, [
        'grant_manage_security_operations',
        'grant_manage_hod_first_level_review_approval',
        'grant_manage_legal_operations',
        'grant_manage_compliance_operations',
        'grant_manage_hod_second_level_review_approval'
      ]) &&
      grantRequestData?.nextApproverId === user?.userId
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
  const grandManagerAction = () => {
    if (
      checkPermissions(rolesAssign, ['grant_manage']) &&
      grantRequestData?.assignTo === user?.userId &&
      grantRequestData?.status === 'IN_PROGRESS_ASSESSMENT'
    ) {
      return (
        <>
          {showNeedMoreBtn && (
            <Button
              variant="contained"
              color="warning"
              sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
              onClick={() => handleOpenNeedMoreInfo('GRANT-MANAGER')}
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

  const { mutate: rejectGrantRequest, isLoading: isRejectLoading } = useMutation(
    grantManagementApi.rejectGrantRequest,
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
    rejectGrantRequest({
      entityId: grantRequestData?.id,
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
            disabled={!grantRequestData?.adminSignPresignedUrl}
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
    <Stack
      justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
      flexDirection="row"
      gap={2}
      flexWrap="wrap"
      alignItems={'center'}
    >
      <IconButton width="40px" height="40px">
        <PrintIcon />
      </IconButton>
      {renderLetterAction()}
      {renderSecurityApproverAction()}
      {renderApproverAction()}
      {grandManagerAction()}
      {renderSignDocumentAction()}
      {openNeedMoreInfo && (
        <GrantNeedMoreInfo
          open={openNeedMoreInfo}
          onClose={() => setOpenNeedMoreInfo(false)}
          stageType={stageType}
          data={grantRequestData}
          backTo={'/admin/grant-request'}
        />
      )}
      {openReject && (
        <RejectForm
          donationPledgeId={grantRequestData?.grantUniqueId}
          open={openReject}
          onClose={() => setOpenReject(false)}
          onSubmit={handleReject}
          isLoading={isRejectLoading}
          type={'grant_manager'}
        />
      )}
    </Stack>
  );
}
