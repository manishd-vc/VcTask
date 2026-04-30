import { Button } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import GrantApproverModal from 'src/components/dialog/GrantApproverModal';

export default function ApproverAction({ handleOpenNeedMoreInfo, handleOpenReject, isSignDocument }) {
  const [open, setOpen] = useState(false);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const showRejectButtonStatus = [
    'IN_PROGRESS_HOD1',
    'IN_PROGRESS_HOD2',
    'IN_PROGRESS_DOC_HOD2',
    'IN_PROGRESS_DOC_HOD1'
  ];
  const showApproveButtonStatus = ['IN_PROGRESS_DOC_HOD2', 'IN_PROGRESS_DOC_HOD1', 'IN_PROGRESS_LEGAL'];

  const renderType = showApproveButtonStatus.includes(grantRequestData?.status)
    ? 'GRANT-DOC-APPROVAL'
    : 'GRANT-REQ-APPROVAL';

  const showApproveButton = !isSignDocument && !grantRequestData?.lastDocApproval;

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
      {showRejectButtonStatus.includes(grantRequestData?.nextStage) && !isSignDocument && (
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
      {open && <GrantApproverModal open={open} onClose={() => setOpen(false)} rowData={grantRequestData} />}
    </>
  );
}
