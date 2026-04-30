'use client';
import { LoadingButton } from '@mui/lab';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import RejectForm from 'src/components/_admin/my-donations/rejectForm';
import { BackArrow, PrintIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerApi from 'src/services/partner';

export default function PageHeader({ isSignDocument, finalSubmit, isSubmitting, handleClickOpenMoreInfo }) {
  const partnerRequestData = useSelector((state) => state?.partner?.partnerRequestData);
  const router = useRouter();
  const [openReject, setOpenReject] = useState(false);
  const dispatch = useDispatch();
  const handleClickOpenReject = () => {
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
  };

  const { mutate: rejectPartnerRequest, isLoading: isRejectLoading } = useMutation(
    'rejectPartnerRequest',
    partnerApi.rejectPartnerRequest,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message, title: 'Request Rejected', variant: 'success' }));
        router.back();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const handleReject = (values) => {
    rejectPartnerRequest({
      entityId: partnerRequestData?.id,
      payload: {
        approvalStatus: values.status,
        content: values.reason
      }
    });
  };

  const signDocumentActions = () => {
    if (partnerRequestData?.status === 'IN_PROGRESS_PARTNER' && isSignDocument) {
      return (
        <>
          <Button variant="outlined" color="primary" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton
            type="button"
            variant="contained"
            disabled={!partnerRequestData?.partnerSignPresignedUrl}
            onClick={finalSubmit}
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </>
      );
    }
  };

  const renderOtherActions = () => {
    if (partnerRequestData?.status === 'IN_PROGRESS_PARTNER' && !isSignDocument) {
      return (
        <>
          <Button
            variant="contained"
            color="warning"
            sx={{ width: { xs: 'auto', sm: 'auto', md: 'auto' } }}
            onClick={() => handleClickOpenMoreInfo('PARTNERSHIP-PARTNER')}
          >
            Need more info
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ width: { xs: 'auto', sm: 'auto', md: 'auto' } }}
            onClick={handleClickOpenReject}
          >
            Reject
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent={'space-between'}
        mb={{ xs: 6, sm: 3 }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          flexDirection="row"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
        >
          <IconButton>
            <PrintIcon />
          </IconButton>
          {signDocumentActions()}
          {renderOtherActions()}
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 5 }}>
        view Partnership Request - {partnerRequestData?.partnershipUniqueId}
      </Typography>
      {openReject && (
        <RejectForm
          donationPledgeId={partnerRequestData?.partnershipUniqueId}
          open={openReject}
          onClose={handleCloseReject}
          onSubmit={handleReject}
          isLoading={isRejectLoading}
          type={'partner_manager'}
        />
      )}
    </>
  );
}
