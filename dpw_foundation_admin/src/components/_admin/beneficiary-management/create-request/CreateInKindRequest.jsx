'use client';
import { Button, Grid, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import GetUserByEmail from 'src/components/get-user-by-email';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as beneficiaryApi from 'src/services/beneficiary';
import CancelDialog from '../../campaign/cancelDialog';
export default function CreateInKindRequest() {
  const theme = useTheme();
  const styles = CommonStyle(theme);
  const dispatch = useDispatch();
  const router = useRouter();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const { mutate: intentGrantRequest, isSuccess } = useMutation(beneficiaryApi.intentInKindContributionRequest, {
    onSuccess: (response) => {
      router.push(`/admin/in-kind-contribution-requests/${response?.id}`);
      dispatch(resetStep());
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/in-kind-contribution-requests`);
  };
  return (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthsm}>
          <Button
            variant="text"
            color="primary"
            startIcon={<BackArrow />}
            onClick={() => setOpenCancelDialog(true)}
            sx={{
              mb: { xs: 3 },
              '&:hover': { textDecoration: 'none' }
            }}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <HeaderBreadcrumbs heading="Create in-kind contribution request" />
      {openCancelDialog && <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />}
      <GetUserByEmail type="CONTRIBUTION_ADMIN" intentGrantRequest={intentGrantRequest} isResetForm={isSuccess} />
    </>
  );
}
