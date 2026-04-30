'use client';

import { Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import { gtmEvents } from 'src/lib/gtmEvents';
import { setDonorAdminData } from 'src/redux/slices/donor';

// API
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import QuestionsAnswerView from '../campaign/questionAnswerView';
import AssessmentApproval from './assessment/assessmentApproval';
import MoreInfo from './assessment/moreInfo';
import RejectForm from './assessment/rejectForm';
import DonationForm from './donationForm';

// Lazy loading for the form steps (Step1 and Step2)

Approve.propTypes = {};

export default function Approve({ type }) {
  const params = useParams();
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState({
    title: '',
    variant: ''
  });
  const router = useRouter();
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [iacadRequired, setIacadRequired] = useState(true);
  const [iacadJustification, setIacadJustification] = useState('');
  const [data, setData] = useState({});
  const [openReject, setOpenReject] = useState(false);
  const [hasAllInfo, setHasAllInfo] = useState(false);
  const [openQuestionAnswer, setOpenQuestionAnswer] = useState(false);
  const { user } = useSelector(({ user }) => user);
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const [checkboxes, setCheckboxes] = useState({
    letterFlowRequired: false,
    assessmentFlowRequired: false,
    directPayment: true // default checked
  });
  const [profileImg, setProfileImg] = useState('');

  useEffect(() => {
    if (getDonorAdminData?.donorPledgeResponse) {
      setHasAllInfo(getDonorAdminData?.donorPledgeResponse?.adminHaveAllInformation);
      setIacadJustification(getDonorAdminData?.donorPledgeResponse?.iacadJustification || '');
      setIacadRequired(getDonorAdminData?.donorPledgeResponse?.iacadRequired);
    }
  }, [getDonorAdminData, setHasAllInfo]);

  // Scroll to top on mount
  useEffect(() => {
    const firstElement = document.getElementById('top-of-page');
    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Fetch form data for the donor
  const { refetch, isLoading } = useQuery(
    ['getAdminDonorFormData', params.id],
    () => api.getAdminDonorFormData({ type: type, id: params.id }),
    {
      enabled: !!params.id,
      onSuccess: (response) => {
        setData(response);
        dispatch(setDonorAdminData(response));
        if (response?.donorPledgeResponse) {
          setCheckboxes({
            letterFlowRequired: response?.donorPledgeResponse?.letterFlowRequired,
            assessmentFlowRequired: response?.donorPledgeResponse?.assessmentFlowRequired,
            directPayment: response?.donorPledgeResponse?.directPayment
          });
        }
      }
    }
  );

  const { mutate: mutateActions, isLoading: moreInfoLoading } = useMutation(api.donorAdminStatusChange, {
    onSuccess: async (response) => {
      const userRoles = Array.isArray(data?.roles) ? data.roles.join(', ') : '';
      gtmEvents.pledgeFormApproved({
        formName: 'Donation Pledge Form',
        donationType: response?.data?.donationType || '',
        pledgeId: response?.data?.donationPledgeId || '', //  FIXED name
        pledgeAmount: response?.data?.pledgeAmount || '', // use pledgeAmount from API
        donationAmount: response?.data?.donationAmount || '', //  use donationAmount from API
        donationCurrency: response?.data?.donationCurrency || '',
        pledgeStatus: response?.data?.status || 'READY_TO_DONATE',
        userId: data?.donorUserId || '',
        userRole: userRoles
      });
      dispatch(
        setToastMessage({
          message: response.message,
          title: currentStatus.title || 'Success',
          variant: currentStatus.variant || 'success'
        })
      );
      // Refetch the donor data after the action
      handleCloseMoreInfo();
      router.back();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const approveStatus = () => {
    switch (type) {
      case 'admin':
        return 'AWAITING_DOCUMENT_CREATION';
      case 'assessment':
        return 'AWAITING_DOCUMENT_CREATION';
      case 'hod':
        return 'AWAITING_DOCUMENT_ACCEPTANCE';
      default:
        return '';
    }
  };

  const handleClickOpenMoreInfo = () => {
    setCurrentStatus({
      title: 'Need more Information',
      variant: 'warning'
    });
    setOpenMoreInfo(true);
  };

  const handleClickOpenReject = () => {
    setCurrentStatus({
      title: 'Rejected',
      variant: 'error'
    });
    setOpenReject(true);
  };
  const handleClickOpenApproval = () => {
    setCurrentStatus({
      title: 'success',
      variant: 'success'
    });
    mutateActions({
      slug: params?.id,
      status: approveStatus(),
      type: type
    });
  };
  const handleCloseQuestionAnswer = () => setOpenQuestionAnswer(false);
  const handleCloseMoreInfo = () => setOpenMoreInfo(false);
  const handleCloseReject = () => setOpenReject(false);
  const handleMoreInfo = (values) => {
    setCurrentStatus({
      title: 'Need more Information',
      variant: 'warning'
    });
    mutateActions({
      slug: params?.id,
      type: type,
      ...values
    });
  };

  const handleReject = (values) => {
    setCurrentStatus({
      title: 'Rejected',
      variant: 'error'
    });
    mutateActions({
      slug: params?.id,
      status: values.status,
      content: values.reason,
      type: type
    });
  };

  const relevantStatuses = ['ASSESSMENT_MORE_INFO_REQUIRED', 'AWAITING_APPROVAL', 'AWAITING_DOCUMENT_APPROVAL'];
  const hasRelevantStatus = relevantStatuses.includes(data?.donorPledgeResponse?.status);
  const isAssignedToUser =
    data?.donorPledgeResponse?.assignTo === user?.userId || data?.donorPledgeResponse?.hodAssignTo === user?.userId;

  return (
    <>
      <Formik enableReinitialize onSubmit={() => {}}>
        {() => (
          <Form id="top-of-page">
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={2}>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<BackArrow />}
                  onClick={() => router.back()} // Navigate back to the previous page
                  sx={{
                    mb: 1,
                    '&:hover': { textDecoration: 'none' }
                  }}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={12} md={10}>
                {hasRelevantStatus && isAssignedToUser && (
                  <AssessmentApproval
                    type={type}
                    handleClickOpenMoreInfo={handleClickOpenMoreInfo}
                    handleClickOpenReject={handleClickOpenReject}
                    handleClickOpenApproval={handleClickOpenApproval}
                  />
                )}
              </Grid>
              {/* Title */}
              <Grid item xs={12}>
                <Typography variant="h5" color={'primary.main'} textTransform="uppercase" my={2}>
                  Donor’s Information
                </Typography>
              </Grid>
            </Grid>
            {isLoading ? (
              <LoadingFallback />
            ) : (
              <DonationForm
                checkboxes={checkboxes}
                setCheckboxes={setCheckboxes}
                type={type}
                isLoading={isLoading}
                isViewOnly
                donorDataRefetch={refetch}
                getDonorAdminData={getDonorAdminData}
                handleClickAssessmentAnswerView={() => setOpenQuestionAnswer(true)}
                hasAllInfo={hasAllInfo}
                setHasAllInfo={setHasAllInfo}
                iacadRequired={iacadRequired}
                setIacadRequired={setIacadRequired}
                iacadJustification={iacadJustification}
                setIacadJustification={setIacadJustification}
                profileImg={profileImg}
                setProfileImg={setProfileImg}
              />
            )}
          </Form>
        )}
      </Formik>
      {openQuestionAnswer && (
        <QuestionsAnswerView
          open={openQuestionAnswer}
          onClose={handleCloseQuestionAnswer}
          questionSet={data?.questionDetailsListResponse}
        />
      )}
      {openMoreInfo && (
        <MoreInfo
          open={openMoreInfo}
          onClose={handleCloseMoreInfo}
          onSubmit={handleMoreInfo}
          isLoading={moreInfoLoading}
          id={params?.id}
          type={type}
        />
      )}
      <RejectForm
        donationPledgeId={data?.donorPledgeResponse?.donationPledgeId}
        open={openReject}
        onClose={handleCloseReject}
        onSubmit={handleReject}
        isLoading={moreInfoLoading}
        type={type}
      />
    </>
  );
}
