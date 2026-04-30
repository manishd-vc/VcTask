import { Button } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PartnershipApproverModal from 'src/components/dialog/partnershipApproverModal';

export default function ApproverAction({ handleOpenNeedMoreInfo, handleOpenReject, isSignDocument }) {
  const [open, setOpen] = useState(false);

  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const showRejectButtonStatus = [
    'IN_PROGRESS_HOD1',
    'IN_PROGRESS_HOD2',
    'IN_PROGRESS_DOC_HOD2',
    'IN_PROGRESS_DOC_HOD1'
  ];

  const showNeedButtonStatus = ['IN_PROGRESS_LEGAL', 'IN_PROGRESS_DOC_HOD2', 'IN_PROGRESS_DOC_HOD1'];

  const renderType = showNeedButtonStatus.includes(partnerRequestData?.status)
    ? 'PARTNERSHIP-DOC-APPROVAL'
    : 'PARTNERSHIP-REQ-APPROVAL';

  const showApproveButton = !isSignDocument && !partnerRequestData?.lastDocApproval;

  return (
    <>
      {!isSignDocument && (
        <Button
          variant="contained"
          color="warning"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
          onClick={() => handleOpenNeedMoreInfo(renderType)}
        >
          Need more info
        </Button>
      )}
      {showRejectButtonStatus.includes(partnerRequestData?.nextStage) &&
        !isSignDocument &&
        ((partnerRequestData?.lastHod &&
          (partnerRequestData?.status == 'IN_PROGRESS_HOD1' || partnerRequestData?.status == 'IN_PROGRESS_HOD2')) ||
          (partnerRequestData?.docLastHod &&
            (partnerRequestData?.status == 'IN_PROGRESS_DOC_HOD1' ||
              partnerRequestData?.status == 'IN_PROGRESS_DOC_HOD2'))) && (
          <Button
            variant="contained"
            color="error"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={handleOpenReject}
          >
            Reject
          </Button>
        )}
      {showApproveButton && (
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="success"
          sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
        >
          Approve
        </Button>
      )}
      {open && <PartnershipApproverModal open={open} onClose={() => setOpen(false)} rowData={partnerRequestData} />}
    </>
  );
}
