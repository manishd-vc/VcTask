import { Button } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import BeneficiaryApproverModal from 'src/components/dialog/beneficiaryApproverModal';

export default function ApproverAction({ handleOpenNeedMoreInfo, handleOpenReject }) {
  const [open, setOpen] = useState(false);

  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  // Define statuses where reject button should be shown (HOD levels only)
  const showRejectButtonStatus = ['IN_PROGRESS_HOD1', 'IN_PROGRESS_HOD2'];

  const showNeedButtonStatus = [
    'IN_PROGRESS_SECURITY',
    'IN_PROGRESS_HOD1',
    'IN_PROGRESS_HOD2',
    'IN_PROGRESS_ASSESSMENT',
    'IN_PROGRESS_COMPLIANCE'
  ];

  const renderType = showNeedButtonStatus.includes(inKindContributionRequestData?.status)
    ? 'APPROVER-CONTRIBUTION'
    : 'ADMIN-CONTRIBUTION';

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

      {showRejectButtonStatus.includes(inKindContributionRequestData?.status) &&
        inKindContributionRequestData?.lastHod &&
        (inKindContributionRequestData?.status === 'IN_PROGRESS_HOD1' ||
          inKindContributionRequestData?.status === 'IN_PROGRESS_HOD2') && (
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
        <BeneficiaryApproverModal open={open} onClose={() => setOpen(false)} rowData={inKindContributionRequestData} />
      )}
    </>
  );
}
