'use client';

import { Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import { setDonorAdminData } from 'src/redux/slices/donor';

// API
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import QuestionsAnswer from '../../campaign/questionAnswer';
import QuestionsAnswerView from '../../campaign/questionAnswerView';
import DonationForm from '../donationForm';
import AssessmentApproval from './assessmentApproval';
import MoreInfo from './moreInfo';
import RejectForm from './rejectForm';

// Lazy loading for the form steps (Step1 and Step2)

ViewAssessment.propTypes = {};

export default function ViewAssessment({ donorType }) {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [openMoreInfo, setOpenMoreInfo] = useState(false);
  const [data, setData] = useState({});
  const { user } = useSelector(({ user }) => user);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openQuestionAnswer, setOpenQuestionAnswer] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const currentStatus = useRef('');
  const [hasAllInfo, setHasAllInfo] = useState(false);
  const [iacadRequired, setIacadRequired] = useState(true);
  const [iacadJustification, setIacadJustification] = useState('');
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
  const { isLoading, isFetching, refetch } = useQuery(
    ['getAdminDonorFormData', params.id],
    () => api.getAdminDonorFormData({ type: donorType, id: params.id }),
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

  const { mutate: mutateAssessmentStatusChange, isLoading: moreInfoLoading } = useMutation(
    api.donorAssessmentStatusChange,
    {
      onSuccess: async () => {
        const { title, message, varient } = getToastMessage();
        dispatch(
          setToastMessage({
            message: message,
            title: title,
            variant: varient
          })
        );
        handleCloseMoreInfo();
        router.back();
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  const getToastMessage = () => {
    let title = '';
    let message = '';
    let varient = '';
    if (currentStatus.current === 'REJECT') {
      title = 'Rejected';
      message = 'Request rejected in assessment.';
      varient = 'error';
    } else if (currentStatus.current === 'NEED_INFO') {
      title = 'Need more Information';
      message = 'More information requested.';
      varient = 'warning';
    } else if (currentStatus.current === 'APPROVE') {
      title = 'success';
      message = 'Donation request successfully approved.';
      varient = 'success';
    }
    currentStatus.current = '';
    return {
      title,
      message,
      varient
    };
  };

  const { mutate: mutateQuestionsAnswers, isLoading: questionAnswerLoading } = useMutation(api.submitQuestionsAnswer, {
    onSuccess: async () => {
      dispatch(
        setToastMessage({
          message: `Assessment answers successfully saved`,
          title: 'success',
          variant: 'success'
        })
      );
      refetch();
      handleCloseQuestion();
      refetch();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const handleClickOpenMoreInfo = () => {
    setOpenMoreInfo(true);
  };

  const handleClickOpenReject = () => {
    setOpenReject(true);
  };
  const handleClickOpenApproval = () => {
    currentStatus.current = 'APPROVE';
    mutateAssessmentStatusChange({
      slug: params?.id,
      status: 'AWAITING_DOCUMENT_CREATION'
    });
  };
  const handleCloseMoreInfo = () => setOpenMoreInfo(false);
  const handleCloseReject = () => setOpenReject(false);
  const handleCloseQuestion = () => setOpenQuestion(false);
  const handleCloseQuestionAnswer = () => setOpenQuestionAnswer(false);
  const handleMoreInfo = (values) => {
    currentStatus.current = 'NEED_INFO';
    mutateAssessmentStatusChange({
      slug: params?.id,
      ...values
    });
  };

  const handleQuestionAnswer = (values) => {
    mutateQuestionsAnswers(values);
  };

  const handleReject = (values) => {
    currentStatus.current = 'REJECT';
    mutateAssessmentStatusChange({
      slug: params?.id,
      status: values.status,
      content: values.reason
    });
  };

  return (
    <>
      <Formik
        initialValues={{ questions: getDonorAdminData?.questionDetailsListResponse?.questions || [] }}
        enableReinitialize
        onSubmit={() => {}}
      >
        {() => (
          <Form id="top-of-page">
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Header with Back Button and Action Buttons */}
              <Grid item xs={12} md={2}>
                <Button
                  variant="text"
                  startIcon={<BackArrow />}
                  onClick={() => router.back()}
                  sx={{
                    mb: 1,
                    '&:hover': { textDecoration: 'none' }
                  }}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={12} md={10}>
                {(data?.donorPledgeResponse?.status === 'AWAITING_APPROVAL' ||
                  data?.donorPledgeResponse?.status === 'AWAITING_DONOR_INFO') &&
                  data?.donorPledgeResponse?.assessmentAssignTo === user?.userId && (
                    <AssessmentApproval
                      type={donorType}
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
            {isLoading || isFetching ? (
              <LoadingFallback />
            ) : (
              <DonationForm
                checkboxes={checkboxes}
                setCheckboxes={setCheckboxes}
                type={donorType}
                isLoading={isLoading}
                handleClickAssessmentAnswer={() => setOpenQuestion(true)}
                handleClickAssessmentAnswerView={() => setOpenQuestionAnswer(true)}
                hasAllInfo={hasAllInfo}
                setHasAllInfo={setHasAllInfo}
                getDonorAdminData={getDonorAdminData}
                iacadRequired={iacadRequired}
                setIacadRequired={setIacadRequired}
                iacadJustification={iacadJustification}
                setIacadJustification={setIacadJustification}
                profileImg={profileImg}
                setProfileImg={setProfileImg}
                isViewOnly={donorType !== 'admin'}
              />
            )}
          </Form>
        )}
      </Formik>
      {openMoreInfo && (
        <MoreInfo
          open={openMoreInfo}
          onClose={handleCloseMoreInfo}
          onSubmit={handleMoreInfo}
          isLoading={moreInfoLoading}
          id={params?.id}
          type={donorType}
        />
      )}
      <RejectForm
        donationPledgeId={data?.donorPledgeResponse?.donationPledgeId}
        open={openReject}
        onClose={handleCloseReject}
        onSubmit={handleReject}
        isLoading={isLoading}
        type={donorType}
      />

      {openQuestionAnswer && (
        <QuestionsAnswerView
          open={openQuestionAnswer}
          onClose={handleCloseQuestionAnswer}
          questionSet={data?.questionDetailsListResponse}
        />
      )}
      {openQuestion && (
        <QuestionsAnswer
          open={openQuestion}
          onClose={handleCloseQuestion}
          onSubmit={handleQuestionAnswer}
          isLoading={questionAnswerLoading}
          questionSet={data?.questionDetailsListResponse}
        />
      )}
    </>
  );
}
