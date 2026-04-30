import { Button } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import VolunteerNeedMoreInfo from 'src/components/dialog/VolunteerNeedMoreInfo';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { checkPermissions } from 'src/utils/permissions';
import RejectForm from '../../donor/assessment/rejectForm';
import ApproverAction from './ApproverAction';

export default function StatusActions({ refetch }) {
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [openNeedMoreInfo, setOpenNeedMoreInfo] = useState(false);
  const [stageType, setStageType] = useState(null);
  const [openReject, setOpenReject] = useState(false);

  const approvalStatus = ['IN_PROGRESS_SECURITY', 'IN_PROGRESS_HOD1', 'IN_PROGRESS_HOD2'];

  const handleOpenNeedMoreInfo = (stageType) => {
    setStageType(stageType);
    setOpenNeedMoreInfo(true);
  };

  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const renderApproverAction = () => {
    if (
      approvalStatus.includes(volunteerCampaignData?.status) &&
      checkPermissions(rolesAssign, [
        'volunteer_campaign_security',
        'volunteer_campaign_hod_first_level_review_approval',
        'volunteer_campaign_hod_second_level_review_approval'
      ]) &&
      volunteerCampaignData?.nextApproverId === user?.userId
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

  const volunteerManagerAction = () => {
    if (
      checkPermissions(rolesAssign, ['volunteer_campaign_manage']) &&
      volunteerCampaignData?.assignTo === user?.userId &&
      volunteerCampaignData?.status === 'FEEDBACK_REQUESTED'
    ) {
      return (
        <>
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
  const completeCampaign = () => {
    if (
      checkPermissions(rolesAssign, ['volunteer_campaign_manage']) &&
      volunteerCampaignData?.assignTo === user?.userId &&
      volunteerCampaignData?.status === 'EXPIRED'
    ) {
      return (
        <>
          <Button
            variant="contained"
            color="warning"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={() => router.push(`/admin/volunteer-campaigns/${volunteerCampaignData?.id}/complete`)}
          >
            Complete
          </Button>
        </>
      );
    }
  };

  const { mutate: rejectVolunteerCampaign, isLoading: isRejectLoading } = useMutation(
    volunteerApi.rejectVolunteerCampaign,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message, title: 'Request Rejected', variant: 'success' }));
        setOpenReject(false);
        refetch();
        router.back();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const handleReject = (values) => {
    rejectVolunteerCampaign({
      entityId: volunteerCampaignData?.id,
      payload: {
        content: values.reason
      }
    });
  };

  return (
    <>
      {renderApproverAction()}
      {volunteerManagerAction()}
      {completeCampaign()}
      {openNeedMoreInfo && (
        <VolunteerNeedMoreInfo
          open={openNeedMoreInfo}
          onClose={() => setOpenNeedMoreInfo(false)}
          stageType={stageType}
          data={volunteerCampaignData}
          backTo={'/admin/volunteer-campaigns'}
        />
      )}
      {openReject && (
        <RejectForm
          donationPledgeId={volunteerCampaignData?.volunteerCampaignNumericId}
          open={openReject}
          onClose={() => setOpenReject(false)}
          onSubmit={handleReject}
          isLoading={isRejectLoading}
          type={'volunteer_manager'}
        />
      )}
    </>
  );
}
