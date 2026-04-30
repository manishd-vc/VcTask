'use client';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import ApproveEnrollmentModal from 'src/components/dialog/ApproveEnrollmentModal';
import { BackArrow, PrintIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import RejectForm from '../donor/assessment/rejectForm';
import ViewEnrollmentRequestById from './view-request/viewEnrolmentRequestById';

export default function ViewAllEnrollment() {
  const router = useRouter();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const dispatch = useDispatch();
  const { isLoading: isLoadingEnrollment, data: enrollmentData } = useQuery(
    ['getVolunteerEnrollmentById', id],
    () => volunteerApi.getVolunteerEnrollmentById(id),
    {
      enabled: !!id
    }
  );

  const { mutate, isLoading } = useMutation(volunteerApi.approveVolunteerEnrollment, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      setOpenReject(false);
      router.push(`/admin/all-enrollments`);
    },
    onError: (err) => {
      setOpenReject(false);
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { status, enrollmentNumericId, id: enrollmentId } = enrollmentData || {};

  const handleReject = (values) => {
    const payload = {
      enrollmentId: enrollmentId,
      status: values?.status,
      regretReason: values?.reason
    };
    mutate(payload);
  };

  if (isLoadingEnrollment) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
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
          alignItems={'center'}
        >
          <IconButton width="40px" height="40px">
            <PrintIcon />
          </IconButton>
          {status === 'REQUEST_SUBMITTED' && (
            <>
              <Button variant="contained" color="error" onClick={() => setOpenReject(true)}>
                Regret
              </Button>
              <Button variant="contained" color="success" onClick={() => setOpen(true)}>
                Approve
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <Typography variant="h5" color="primary.main" sx={{ mb: 4 }} textTransform={'uppercase'}>
        View Enrollment Request - {enrollmentNumericId}
      </Typography>
      {open && <ApproveEnrollmentModal open={open} onClose={() => setOpen(false)} enrollmentData={enrollmentData} />}
      {openReject && (
        <RejectForm
          donationPledgeId={enrollmentNumericId}
          open={openReject}
          onClose={() => setOpenReject(false)}
          onSubmit={handleReject}
          isLoading={isLoading}
          type={'enrollment_manager'}
        />
      )}
      <ViewEnrollmentRequestById enrollmentData={enrollmentData} />
    </>
  );
}
