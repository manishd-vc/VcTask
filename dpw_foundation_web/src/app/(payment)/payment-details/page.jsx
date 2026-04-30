'use client';

import { Button, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { NextWhiteArrow } from 'src/components/icons';
import { gtmEvents } from 'src/lib/gtmEvents';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import MobilePaymentStatus from './mobile/MobilePaymentStatus';
import WebPaymentStatus from './web/page';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const soTransactionID = searchParams.get('soTransactionID');
  const cepgReferenceNumber = searchParams.get('cepgReferenceNumber');
  const result = searchParams.get('result');
  const message = searchParams.get('message');
  const fiReferenceNumber = searchParams.get('fiReferenceNumber');
  const serviceCost = searchParams.get('serviceCost');
  const processingCharges = searchParams.get('processingCharges');
  const status = searchParams.get('status');
  const paymentInstrument = searchParams.get('paymentInstrument');
  const fiDate = searchParams.get('fiDate');
  const signature = searchParams.get('signature');

  const [showMessage, setShowMessage] = useState('');

  const { data, isLoading } = useQuery(
    [
      'getPaymentMethods',
      soTransactionID,
      cepgReferenceNumber,
      result,
      message,
      fiReferenceNumber,
      serviceCost,
      processingCharges,
      status,
      paymentInstrument,
      fiDate,
      signature
    ],
    () =>
      api.getPaymentMethods({
        soTransactionID,
        cepgReferenceNumber,
        result,
        message,
        fiReferenceNumber,
        serviceCost,
        processingCharges,
        status,
        paymentInstrument,
        fiDate,
        signature
      }),
    {
      enabled: !!soTransactionID,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        const userRoles = Array.isArray(user?.roles) ? user.roles.join(', ') : '';
        const paymentData = response?.data;
        const paymentStatus = paymentData?.paymentStatus;

        // Fire GTM donationComplete event when donation is done
        if (paymentStatus === 'SUCCESS') {
          gtmEvents.donationComplete({
            formName: 'Donation Pledge Form',
            donationType: paymentData?.donationType || 'General',
            pledgeId: paymentData?.pledgeId || '',
            pledgeAmount: paymentData?.pledgeAmount || '',
            donationAmount: paymentData?.donationAmount || '',
            donationCurrency: paymentData?.currency || '',
            pledgeStatus: paymentData?.pledgeStatus || 'Donated',
            userId: user?.userId || '',
            userRole: userRoles
          });
        }
      },
      onError: (error) => {
        setShowMessage(error?.response?.data?.message);
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );
  const platform = data?.data?.paymentPlatform;
  const state = data?.data?.state;

  // Redirect for admin
  useEffect(() => {
    if (platform === 'ADMIN') {
      window.location.href = `${data?.data?.redirectUrl}:3002/dpwfadm/payment-details?${searchParams.toString()}`;
    }
  }, [platform, searchParams]);

  // Show mobile view if platform is mobile
  if (platform === 'MOBILE') {
    return (
      <MobilePaymentStatus
        soTransactionID={soTransactionID}
        paymentStatus={data?.data?.paymentStatus}
        message={data?.message}
      />
    );
  }

  // Only render WebPaymentStatus if platform is 'web'
  if (platform === 'WEB') {
    return (
      <WebPaymentStatus
        isLoading={isLoading}
        paymentStatus={data?.data?.paymentStatus}
        soTransactionID={soTransactionID}
        state={state}
      />
    );
  }

  // Optionally return null or a loader until platform is known
  return isLoading ? (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh" width="100%">
      <CircularProgress />
    </Box>
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
      <Typography variant="h6">{showMessage}</Typography>
      <Button
        size="large"
        variant="contained"
        color="primary"
        endIcon={<NextWhiteArrow />}
        onClick={() => router.push('/auth/login')}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
}
