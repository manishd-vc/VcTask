'use client';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import GetUserByEmail from 'src/components/get-user-by-email';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as partnerManagementApi from 'src/services/partner';
import CancelDialog from '../../campaign/cancelDialog';

export default function CreatePartnershipRequest() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/partnership-request`);
  };

  const { mutate: intentPartnershipRequest, isSuccess } = useMutation(partnerManagementApi.intentPartnershipRequest, {
    onSuccess: (response) => {
      router.push(`/admin/partnership-request/${response?.id}`);
      dispatch(resetStep());
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err?.response?.data?.message, variant: 'error' }));
    }
  });

  return (
    <>
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
      <HeaderBreadcrumbs heading="Create Partnership Request" />
      <GetUserByEmail type="PARTNER_ADMIN" intentGrantRequest={intentPartnershipRequest} isResetForm={isSuccess} />
      <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
    </>
  );
}
