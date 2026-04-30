'use client';

import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, LinearProgress, Paper, Stack, Tooltip, Typography } from '@mui/material';
import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Steppers from 'src/components/stepper/stepper';
import { nextStep, previousStep } from 'src/redux/slices/stepper';
// API
import { useParams, useSearchParams } from 'next/navigation';
import { useMutation } from 'react-query';
import FileUpload from 'src/components/fileUpload';
import { DownloadLetterIcon } from 'src/components/icons';
import TextEditor from 'src/components/textEditor/textEditor';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';
import MediaPreview from '../campaign/steps/emailCampaign/mediaPreview';
import DonationProcess from './donationProcess';
import MoreInfoView from './needInfo';
import IntentDetails from './steps/intentDetails';
import RecordDetails from './steps/recordDetails';
import Step1Form from './steps/step1Form';
import Step2NewForm from './steps/step2NewForm';

// Lazy loading for the form steps (Step1 and Step2)
const Step1 = React.lazy(() => import('./steps/step1'));
const Step2 = React.lazy(() => import('./steps/step2'));

DonationForm.propTypes = {};

const stepCount = 2;

export default function DonationForm({
  checkboxes,
  setCheckboxes,
  type,
  isViewOnly,
  setLatterValues,
  latterValues,
  handleClickAssessmentAnswer,
  handleClickAssessmentAnswerView,
  donorDataRefetch,
  hasAllInfo,
  setHasAllInfo,
  setIsAdvanced,
  setIsDpwEmployee,
  formik,
  step1Field,
  orgFields,
  step2Field,
  profileImg,
  setProfileImg,
  iacadRequired,
  setIacadRequired,
  iacadJustification,
  setIacadJustification
}) {
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const params = useParams();
  const { user } = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isView = searchParams.get('isView');
  const { activeStep } = useSelector((state) => state?.stepper);
  const [tick, setTick] = React.useState({
    0: false,
    1: false,
    2: false
  });
  const handleNext = () => {
    if (hasAllInfo) {
      if (activeStep == 0) {
        manageTickStep1();
      }
      if (activeStep == 1) {
        manageTickStep2();
      }
      dispatch(nextStep());
    } else {
      dispatch(nextStep());
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      dispatch(previousStep());
    }
  };

  const isNeedMoreInfo = ['ASSESSMENT_MORE_INFO_REQUIRED', 'DOCUMENT_MORE_INFO_REQUIRED', 'DONOR_MORE_INFO_REQUIRED'];

  const { mutate, isLoading } = useMutation(api.downloadLetterContent, {
    onSuccess: async (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'letter.pdf'; // you can make this dynamic if needed
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      dispatch(setToastMessage({ message: 'Download successful!', variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: uploadHodSignatureMutate, isLoading: loading } = useMutation(
    'uploadHodSignature',
    api.uploadHodSignature,
    {
      onSuccess: (response) => {
        donorDataRefetch();
        dispatch(setToastMessage({ message: response?.message, title: 'Success' }));
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message: error.response.data.message || error.response.data.detail,
            variant: 'error',
            title: 'Error'
          })
        );
        donorDataRefetch();
      }
    }
  );

  const rejectStatus = [
    'PLEDGE_REJECTED',
    'DONOR_REJECTED',
    'DOCUMENT_REJECTED',
    'ASSESSMENT_REJECTED',
    'ASSESSMENT_IACAD_REJECTED'
  ];
  const rejectStatusDate = (date) => {
    return date ? fDateWithLocale(date) : '-';
  };

  const viewOnlyStatus = [
    'AWAITING_DOCUMENT_CREATION',
    'AWAITING_DOCUMENT_APPROVAL',
    'DOCUMENT_MORE_INFO_REQUIRED',
    'DOCUMENT_REJECTED',
    'AWAITING_DOCUMENT_ACCEPTANCE',
    'PLEDGE_REJECTED',
    'AWAITING_DONOR_INFO',
    'AWAITING_APPROVAL'
  ];

  const wayTwoStepsStatus = [
    'AWAITING_DOCUMENT_CREATION',
    'AWAITING_DOCUMENT_APPROVAL',
    'DOCUMENT_MORE_INFO_REQUIRED',
    'AWAITING_APPROVAL'
  ];

  const isDisabled = viewOnlyStatus.includes(getDonorAdminData?.donorPledgeResponse?.status);

  const showTextEditor = ['AWAITING_DOCUMENT_CREATION', 'DOCUMENT_MORE_INFO_REQUIRED', 'DONOR_MORE_INFO_REQUIRED'];

  const handleFileUploadChange = (files) => {
    handleFileUploadValidation(files, {
      mutate: uploadHodSignatureMutate,
      entityId: params?.id,
      setToastMessage,
      dispatch
    });
  };
  // ---------------------------------
  const manageTickStep1 = async () => {
    try {
      const values = formik?.values;
      const errors = await formik?.validateForm();
      let fieldsToTouch;
      if (getDonorAdminData?.donorPledgeResponse?.donorType === 'Individual') {
        fieldsToTouch = step1Field;
      } else {
        fieldsToTouch = orgFields;
      }
      if (values.isEmployed === 'yes') {
        fieldsToTouch.push('occupation');
      }
      let error = false;
      fieldsToTouch.forEach((field) => {
        if (errors[field]) {
          error = true;
        }
      });
      if (!error) {
        setTick({
          ...tick,
          0: true
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const manageTickStep2 = async () => {
    try {
      const errors = await formik?.validateForm();
      const fieldsToTouch = step2Field;
      let error = false;
      fieldsToTouch.forEach((field) => {
        if (errors[field]) {
          error = true;
        }
      });
      if (!error) {
        setTick({
          ...tick,
          1: true
        });
      }
    } catch (e) {}
  };

  const viewModeOn = isView === 'true';
  return (
    <>
      {viewModeOn && getDonorAdminData?.donorPledgeResponse?.status !== 'WITHDRAWN' && <RecordDetails />}
      {showTextEditor.includes(getDonorAdminData?.donorPledgeResponse?.status) && !viewModeOn && (
        <TextEditor
          setLatterValues={setLatterValues}
          latterValues={latterValues}
          title={
            getDonorAdminData?.donorPledgeResponse?.donationAmount < 50000 ? (
              <Typography variant="subtitle3" color="text.black">
                Draft Acceptance Letter
              </Typography>
            ) : (
              <Typography variant="subtitle3" color="text.black">
                Draft Agreement Letter
              </Typography>
            )
          }
        />
      )}
      {rejectStatus.includes(getDonorAdminData?.donorPledgeResponse?.status) && (
        <Box sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
          <Typography variant="subtitle4" color="text.white">
            Rejection Reason | Rejection Date :{' '}
            {rejectStatusDate(
              getDonorAdminData?.donorPledgeResponse?.hodRejectedOn ||
                getDonorAdminData?.donorPledgeResponse?.assessmentRejectedOn ||
                getDonorAdminData?.donorPledgeResponse?.adminRejectedOn ||
                getDonorAdminData?.donorPledgeResponse?.rejectedOn
            )}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.white">
            {getDonorAdminData?.donorPledgeResponse?.hodNotes ||
              getDonorAdminData?.donorPledgeResponse?.assessmentNotes ||
              getDonorAdminData?.donorPledgeResponse?.notes ||
              getDonorAdminData?.donorPledgeResponse?.rejectedNotes ||
              '-'}
          </Typography>
        </Box>
      )}
      {isNeedMoreInfo.includes(getDonorAdminData?.donorPledgeResponse?.status) && (
        <MoreInfoView
          message={
            getDonorAdminData?.donorPledgeResponse?.assessmentNotes ||
            getDonorAdminData?.donorPledgeResponse?.hodNotes ||
            getDonorAdminData?.donorPledgeResponse?.notes
          }
          attachment={
            getDonorAdminData?.donorPledgeResponse?.assessmentNeedInfoId ||
            getDonorAdminData?.donorPledgeResponse?.hodNeedInfoId ||
            getDonorAdminData?.donorPledgeResponse?.needInfoId ||
            getDonorAdminData?.donorPledgeResponse?.adminNeedInfoId
          }
          fileName={
            getDonorAdminData?.donorPledgeResponse?.assessmentNeedInfoName ||
            getDonorAdminData?.donorPledgeResponse?.hodNeedInfoName ||
            getDonorAdminData?.donorPledgeResponse?.needInfoId ||
            getDonorAdminData?.donorPledgeResponse?.adminNeedInfoName
          }
        />
      )}
      <IntentDetails
        type={type}
        isDisabled={isDisabled}
        hasAllInfo={hasAllInfo}
        setHasAllInfo={setHasAllInfo}
        isView={viewModeOn}
      />
      {(!viewModeOn ||
        (type === 'assessment' &&
          ['AWAITING_APPROVAL', 'ASSESSMENT_MORE_INFO_REQUIRED'].includes(
            getDonorAdminData?.donorPledgeResponse?.status
          ) &&
          getDonorAdminData?.donorPledgeResponse?.assessmentAssignTo == user?.userId)) && (
        <DonationProcess
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          isAssessment={false}
          type={type}
          handleClickAssessmentAnswer={handleClickAssessmentAnswer}
          handleClickAssessmentAnswerView={handleClickAssessmentAnswerView}
          iacadRequired={iacadRequired}
          setIacadRequired={setIacadRequired}
          iacadJustification={iacadJustification}
          setIacadJustification={setIacadJustification}
          isView={isView}
          donorDataRefetch={donorDataRefetch}
        />
      )}
      {(viewModeOn || wayTwoStepsStatus.includes(getDonorAdminData?.donorPledgeResponse?.status) || !hasAllInfo) &&
        getDonorAdminData?.donorPledgeResponse?.status !== 'WITHDRAWN' && (
          <>
            <Step1 isViewOnly={isViewOnly} />
            <Step2 isViewOnly={isViewOnly} />
          </>
        )}

      {hasAllInfo && !viewModeOn && !wayTwoStepsStatus.includes(getDonorAdminData?.donorPledgeResponse?.status) && (
        <Steppers stepCount={stepCount} activeStep={activeStep}>
          {activeStep === 0 ? (
            <Suspense
              fallback={
                <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                  <LinearProgress />
                </Stack>
              }
            >
              <Step1Form
                isViewOnly={isViewOnly}
                data={getDonorAdminData}
                donorType={getDonorAdminData?.accountType}
                setIsAdvanced={setIsAdvanced}
                setIsDpwEmployee={setIsDpwEmployee}
                profileImg={profileImg}
                setProfileImg={setProfileImg}
              />
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                  <LinearProgress />
                </Stack>
              }
            >
              <Step2NewForm data={getDonorAdminData} />
            </Suspense>
          )}
          {/* Step Navigation Buttons */}
          <Stack flexDirection="row" justifyContent="flex-end" gap={1} sx={{ pt: 2 }}>
            <Button
              variant={activeStep === 0 ? 'contained' : 'outlined'}
              color="inherit"
              type="button"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ mr: 1 }}
            >
              Previous
            </Button>
            <LoadingButton
              type="button"
              disabled={activeStep === stepCount - 1}
              variant="contained"
              onClick={handleNext}
            >
              Next
            </LoadingButton>
          </Stack>
        </Steppers>
      )}
      {((viewModeOn && getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetter) ||
        getDonorAdminData?.donorPledgeResponse?.status === 'AWAITING_DOCUMENT_APPROVAL') && (
        <Paper sx={{ p: 3, my: 3 }}>
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="h6" textTransform={'uppercase'} color="text.secondarydark" mb={1}>
              {getDonorAdminData?.donorPledgeResponse?.donationAmount < 50000
                ? 'Acceptance Letter'
                : 'Agreement Letter'}
            </Typography>
            <Tooltip title="Download Document">
              <IconButton onClick={() => mutate(params.id)} disabled={isLoading}>
                <DownloadLetterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Paper>
            <Box className="ql-editor" sx={{ p: 3, mt: 1, color: 'text.secondarydark' }}>
              <div
                dangerouslySetInnerHTML={{ __html: getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetter }}
              ></div>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={'flex-start'}>
              {getDonorAdminData?.hodAgreementSignUrl && (
                <Stack flexDirection={'column'} rowGap={1} alignItems={'center'} justifyContent={'flex-start'} ml={4}>
                  <Box width={120} height={'auto'}>
                    <MediaPreview
                      src={getDonorAdminData?.hodAgreementSignUrl}
                      width={120}
                      height={80}
                      layout="intrinsic"
                      isCloseIcon={false}
                    />
                  </Box>
                  {viewModeOn && (
                    <Typography component={'p'} variant="subtitle4" sx={{ px: 3, my: 1 }} color="text.secondarydark">
                      DPW HOD Signature
                    </Typography>
                  )}
                </Stack>
              )}
              {getDonorAdminData?.userAgreementSignUrl && (
                <Stack flexDirection={'column'} rowGap={1} alignItems={'center'} justifyContent={'center'} mr={4}>
                  <Box width={120} height={'auto'}>
                    <MediaPreview
                      src={getDonorAdminData?.userAgreementSignUrl}
                      width={120}
                      height={80}
                      layout="intrinsic"
                      isCloseIcon={false}
                    />
                  </Box>
                  {viewModeOn && (
                    <Typography component={'p'} variant="subtitle4" sx={{ mb: 3 }} color="text.secondarydark">
                      Donor Signature
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
            {type === 'hod' && !viewModeOn && (
              <>
                {getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetterType === 'AGREEMENT_LETTER' &&
                  getDonorAdminData?.donorPledgeResponse?.status === 'AWAITING_DOCUMENT_APPROVAL' && (
                    <Box sx={{ ml: 3, my: 2 }}>
                      <FileUpload
                        size="small"
                        name={'hodSignature'}
                        buttonText={getDonorAdminData?.hodAgreementSignUrl ? 'Update  Signature' : 'Add Signature '}
                        onChange={(event) => handleFileUploadChange(Array?.from(event?.target?.files))}
                        disabled={loading}
                        typeOfAllowed="imageExtension"
                      />
                    </Box>
                  )}
                {getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetterType === 'AGREEMENT_LETTER' &&
                  getDonorAdminData?.donorPledgeResponse?.status === 'AWAITING_DOCUMENT_APPROVAL' && (
                    <Typography component={'p'} variant="subtitle4" sx={{ px: 3, pb: 2 }} color="text.secondarydark">
                      DPW HOD Signature
                    </Typography>
                  )}
              </>
            )}
          </Paper>
        </Paper>
      )}
    </>
  );
}
