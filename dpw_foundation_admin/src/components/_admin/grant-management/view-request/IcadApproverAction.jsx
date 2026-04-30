import { Button } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import GrantIcadApprover from 'src/components/dialog/GrantIcadApprover';

export default function IcadApproverAction({ refetch, handleOpenNeedMoreInfo }) {
  const [open, setOpen] = useState(false);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  return (
    <>
      <Button
        variant="contained"
        color="warning"
        sx={{ width: { xs: '100%', sm: 'auto', md: 'auto' } }}
        onClick={() => handleOpenNeedMoreInfo('GRANT-REQ-APPROVAL')}
      >
        Need more info
      </Button>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
        sx={{ width: { xs: '100%', sm: 'auto', md: 'auto' } }}
      >
        Submit IACAD Response
      </Button>
      {open && (
        <GrantIcadApprover
          open={open}
          onClose={() => setOpen(false)}
          singleRowData={grantRequestData}
          refetch={refetch}
        />
      )}
    </>
  );
}
