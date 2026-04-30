import { Button } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import VolunteerCampaignApproverModal from 'src/components/dialog/volunteerCampaignApproverModal';

export default function ApproverAction({ handleOpenNeedMoreInfo, handleOpenReject }) {
  const [open, setOpen] = useState(false);

  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);

  // Define statuses where reject button should be shown (HOD levels only)
  const showRejectButtonStatus = ['IN_PROGRESS_HOD1', 'IN_PROGRESS_HOD2'];

  const showNeedButtonStatus = ['IN_PROGRESS_SECURITY', 'IN_PROGRESS_HOD1', 'IN_PROGRESS_HOD2'];

  const renderType = showNeedButtonStatus.includes(volunteerCampaignData?.status)
    ? 'VOLUNTEER-APPROVAL'
    : 'VOLUNTEER-REQ-APPROVAL';

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
        onClick={() => handleOpenNeedMoreInfo(renderType)}
      >
        Need more info
      </Button>

      {showRejectButtonStatus.includes(volunteerCampaignData?.nextStage) &&
        volunteerCampaignData?.lastHod &&
        (volunteerCampaignData?.status === 'IN_PROGRESS_HOD1' ||
          volunteerCampaignData?.status === 'IN_PROGRESS_HOD2') && (
          <Button
            variant="contained"
            color="error"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={handleOpenReject}
          >
            Reject
          </Button>
        )}

      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="success"
        sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
      >
        Approve
      </Button>
      {open && (
        <VolunteerCampaignApproverModal open={open} onClose={() => setOpen(false)} rowData={volunteerCampaignData} />
      )}
    </>
  );
}
