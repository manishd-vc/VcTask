'use client';

import { Box, Button, Grid, IconButton, LinearProgress, Paper, Stack, Typography } from '@mui/material'; // Material-UI components for layout and UI elements
import { useRouter } from 'next-nprogress-bar'; // Next.js hook for routing and page transitions
import { useParams } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { Suspense, useState } from 'react'; // React dependencies
import { useMutation } from 'react-query'; // React-Query hook for managing server-side mutations
import { useDispatch } from 'react-redux'; // Redux hooks for state management
import { BackArrow } from 'src/components/icons'; // Custom icons for back and next buttons
import { setToastMessage } from 'src/redux/slices/common'; // Redux action for displaying toast messages
import * as api from 'src/services'; // API service functions
import { fDateWithLocale } from 'src/utils/formatTime';
import AcceptanceLetter from './acceptanceLetter';
import ApprovalPanel from './approvalPanel';
import IntentDetail from './intentDetail'; // Component to display detailed intent information
import MoreInfo from './moreInfo';
import MoreInfoForm from './moreInfoForm';
import RecordDetails from './recordDetails';
import RejectForm from './rejectForm';
// Lazy loading of step components for better performance
const Step1View = React.lazy(() => import('./steps/step1View'));
const Step2View = React.lazy(() => import('./steps/step2View'));
// Main component for displaying donation-related information and managing the form steps
const DonationView = ({ data, isAccept, donorDataRefetch }) => {
  const params = useParams();
  const id = params.id;
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const router = useRouter(); // Hook for routing

  const dispatch = useDispatch(); // Dispatch function for Redux actions

  const { mutate: campaignDonorStatusUpdate } = useMutation(
    'campaignDonorStatusUpdate',
    api.campaignDonorStatusUpdate,
    {
      onSuccess: (res) => {
        dispatch(setToastMessage({ message: res?.message, variant: 'success' })); // Show success message
        router.back();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data?.message, variant: 'error' })); // Show error message
      }
    }
  );

  const handleClickOpenMoreInfo = () => {
    setOpenMoreInfo(true);
  };

  const handleClickOpenReject = () => {
    setOpenReject(true);
  };

  const handleClickOpenApproval = () => {
    const payload = {
      id: data?.id,
      status: 'READY_TO_DONATE'
    };
    campaignDonorStatusUpdate(payload);
  };

  const handleCloseMoreInfo = () => {
    setOpenMoreInfo(false);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
  };

  const handleMoreInfo = (values) => {
    const payload = {
      id: data?.id,
      status: values?.status,
      content: values?.content
    };
    campaignDonorStatusUpdate(payload);
  };

  const handleReject = (values) => {
    const payload = {
      id: data?.id,
      status: values?.status,
      content: values?.reason
    };
    campaignDonorStatusUpdate(payload);
  };
  return (
    <>
      {/* Back Button Section */}
      <Grid container spacing={3} sx={{ mb: 3 }} alignItems="center">
        {isAccept ? (
          <>
            <Grid item xs={12} md={2}>
              <Button sx={{ paddingLeft: '0' }} color="primary" onClick={() => router.push(`/user/my-donations`)}>
                <IconButton sx={{ marginRight: '5px' }}>
                  <BackArrow />
                </IconButton>
                Back
              </Button>
            </Grid>
            <ApprovalPanel
              handleClickOpenMoreInfo={handleClickOpenMoreInfo}
              handleClickOpenReject={handleClickOpenReject}
              handleClickOpenApproval={handleClickOpenApproval}
            />
          </>
        ) : (
          <Grid item xs={4} md={2}>
            <Button
              sx={{ paddingLeft: 0 }}
              color="primary"
              onClick={() => {
                router.push(`/user/my-donations`);
              }}
              startIcon={<BackArrow sx={{ marginRight: '5px' }} />}
            >
              Back
            </Button>
          </Grid>
        )}
      </Grid>
      <RecordDetails data={data} />
      {/* Conditional section when assessment requires more information */}
      {(data?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' || data?.status === 'DONOR_MORE_INFO_REQUIRED') && (
        <MoreInfo
          message={
            data?.assessment?.donorPledgeResponse?.assessmentNotes ||
            data?.assessment?.donorPledgeResponse?.hodNotes ||
            data?.assessment?.donorPledgeResponse?.notes
          }
          attachment={
            data?.assessment?.donorPledgeResponse?.assessmentNeedInfoId ||
            data?.assessment?.donorPledgeResponse?.needInfoId ||
            data?.assessment?.donorPledgeResponse?.adminNeedInfoId ||
            data?.assessment?.donorPledgeResponse?.hodNeedInfoId
          }
          fileName={
            data?.assessment?.donorPledgeResponse?.assessmentNeedInfoName ||
            data?.assessment?.donorPledgeResponse?.needInfoName ||
            data?.assessment?.donorPledgeResponse?.adminNeedInfoName ||
            data?.assessment?.donorPledgeResponse?.hodNeedInfoName
          }
          status={data?.status}
        />
      )}
      {[
        'PLEDGE_REJECTED',
        'DONOR_REJECTED',
        'DOCUMENT_REJECTED',
        'ASSESSMENT_REJECTED',
        'ASSESSMENT_IACAD_REJECTED'
      ].includes(data?.status) && (
        <Box sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
          <Typography variant="subtitle4" color="text.white">
            Rejection Reason | Rejection Date :{' '}
            {(() => {
              const donorPledgeResponse = data?.assessment?.donorPledgeResponse;
              const rejectionDate =
                donorPledgeResponse?.adminRejectedOn ||
                donorPledgeResponse?.assessmentRejectedOn ||
                donorPledgeResponse?.hodRejectedOn ||
                donorPledgeResponse?.rejectedOn;
              return rejectionDate ? fDateWithLocale(rejectionDate) : '-';
            })()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.white">
            {data?.assessment?.donorPledgeResponse?.hodNotes ||
              data?.assessment?.donorPledgeResponse?.assessmentNotes ||
              data?.assessment?.donorPledgeResponse?.notes ||
              data?.assessment?.donorPledgeResponse?.rejectedNotes ||
              '-'}
          </Typography>
        </Box>
      )}

      {/* Intent Details Section */}
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          Donation Pledge
        </Typography>
        <IntentDetail data={data} />
      </Paper>
      {data?.status !== 'AWAITING_PLEDGE_APPROVAL' &&
        data?.status !== 'PLEDGE_APPROVED' &&
        data?.status !== 'PLEDGE_REJECTED' &&
        data?.status !== 'WITHDRAWN' && (
          <Suspense
            fallback={
              <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                <LinearProgress />
              </Stack>
            }
          >
            <Step1View data={data?.assessment} type={data?.donorType} />
            <Step2View data={data} />
          </Suspense>
        )}
      {data?.status === 'AWAITING_DOCUMENT_ACCEPTANCE' && data?.acceptanceAgreementLetter && (
        <Paper sx={{ p: 4, mb: 3, mt: 3 }}>
          <AcceptanceLetter data={data} id={id} donorDataRefetch={donorDataRefetch} />
        </Paper>
      )}
      {openMoreInfo && (
        <MoreInfoForm
          open={openMoreInfo}
          onClose={handleCloseMoreInfo}
          onSubmit={handleMoreInfo}
          isLoading={false}
          id={data?.id}
        />
      )}
      <RejectForm
        donationPledgeId={data?.assessment?.donorPledgeResponse?.donationPledgeId}
        open={openReject}
        onClose={handleCloseReject}
        onSubmit={handleReject}
        isLoading={false}
      />
    </>
  );
};

DonationView.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.string,
    assessmentNotes: PropTypes.string,
    assessmentNeedInfoId: PropTypes.string,
    assessment: PropTypes.shape({
      donorPledgeResponse: PropTypes.shape({
        id: PropTypes.string,
        donationAmount: PropTypes.number,
        donationCurrency: PropTypes.string
      }),
      gender: PropTypes.string,
      landlineNumber: PropTypes.string,
      mobile: PropTypes.string,
      isEmployed: PropTypes.bool,
      occupation: PropTypes.string,
      employer: PropTypes.string,
      nationalIdValidity: PropTypes.string,
      passportNo: PropTypes.string,
      passportValidity: PropTypes.string,
      maritalStatus: PropTypes.string,
      spouseGuardianName: PropTypes.string,
      isSpouseGuardianEmployed: PropTypes.bool,
      nationality: PropTypes.string,
      currentCountryOfResidence: PropTypes.string,
      state: PropTypes.string,
      homeStatus: PropTypes.string,
      homeAddress: PropTypes.string,
      assistanceRequested: PropTypes.string,
      passportAttachments: PropTypes.string,
      donationType: PropTypes.string,
      isTaxReceiptRequired: PropTypes.bool,
      isActivityUpdateRequired: PropTypes.bool,
      isConsentProvided: PropTypes.bool,
      consentProvidedOn: PropTypes.string,
      questionDetailsListResponse: PropTypes.shape({
        questions: PropTypes.arrayOf(PropTypes.string)
      })
    })
  }).isRequired
};

export default DonationView;
