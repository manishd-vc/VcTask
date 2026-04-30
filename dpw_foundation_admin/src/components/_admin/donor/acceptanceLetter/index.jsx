'use client';

import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import { Form, Formik, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import { setDonorAdminData } from 'src/redux/slices/donor';
import { resetStep } from 'src/redux/slices/stepper';
import * as Yup from 'yup';

// API
import CommonStyle from 'src/components/common.styles';
import { setSubmittedAssessment, setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fDateTimeStandard } from 'src/utils/formatTime';

import LoadingFallback from 'src/components/loadingFallback';
import QuestionsAnswerView from '../../campaign/questionAnswerView';
import DonationForm from '../donationForm';
import { getValidationSchema, orgFields, step1Field, step2Field } from './validationSchemas';

// Lazy loading for the form steps (Step1 and Step2)

AcceptanceLetter.propTypes = {};

// ----------------------------

export default function AcceptanceLetter({ isCreate, type, data = {} }) {
  const params = useParams();
  const theme = useTheme();
  const styles = CommonStyle(theme);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isView = searchParams.get('isView');
  const [openQuestionAnswer, setOpenQuestionAnswer] = useState(false);
  const router = useRouter();
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const [checkboxes, setCheckboxes] = useState({
    letterFlowRequired: false,
    assessmentFlowRequired: false,
    directPayment: true // default checked
  });
  const [iacadRequired, setIacadRequired] = useState(getDonorAdminData?.donationType === 'GENERAL' ? null : true);
  const [iacadJustification, setIacadJustification] = useState('');
  const [latterValues, setLatterValues] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(getDonorAdminData?.isEmployed ? 'yes' : 'no');
  const [isDpwEmployee, setIsDpwEmployee] = useState(getDonorAdminData?.isDpwEmployee ? 'yes' : 'no');
  const [hasAllInfo, setHasAllInfo] = useState(false);
  const [saveMode, setSaveMode] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  // Check if the donor has been requested for info again
  const getAssessmentValue = (value, defaultValue) => value ?? defaultValue;
  const inital = {
    pledgeId: getAssessmentValue(getDonorAdminData?.donorPledgeResponse?.id, ''),
    gender: getAssessmentValue(getDonorAdminData?.gender?.toLowerCase(), ''),
    mobile: getAssessmentValue(getDonorAdminData?.mobile, ''),
    currentCountryOfResidence: getAssessmentValue(getDonorAdminData?.currentCountryOfResidence, ''),
    state: getAssessmentValue(getDonorAdminData?.state, ''),
    donationAmount: getAssessmentValue(
      getDonorAdminData?.donorPledgeResponse?.pledgeAmount || getDonorAdminData?.donorPledgeResponse?.donationAmount,
      ''
    ),
    donationCurrency: getAssessmentValue(getDonorAdminData?.donorPledgeResponse?.donationCurrency, ''),
    donationMethod: getAssessmentValue(getDonorAdminData?.donorPledgeResponse?.donationMethod, ''),
    isTaxReceiptRequired: getAssessmentValue(getDonorAdminData?.isTaxReceiptRequired, ''),
    isActivityUpdateRequired: getAssessmentValue(getDonorAdminData?.isActivityUpdateRequired, 'true'),
    isConsentProvided: getAssessmentValue(getDonorAdminData?.isConsentProvided, ''),
    consentProvidedOn: getAssessmentValue(getDonorAdminData?.consentProvidedOn, ''),
    paymentOption: getAssessmentValue(getDonorAdminData?.donorPledgeResponse?.paymentOption, ''),

    documentDetails: getAssessmentValue(getDonorAdminData?.documentDetails, [
      {
        documentType: '',
        documentNumber: '',
        documentValidity: null,
        documentImageId: null,
        fileName: ''
      }
    ]),
    dob: getAssessmentValue(getDonorAdminData?.donorPledgeResponse?.dob, ''),
    city: getAssessmentValue(getDonorAdminData?.city, ''),
    mailingAddress: getAssessmentValue(getDonorAdminData?.mailingAddress, ''),
    preferredCommunication: getAssessmentValue(getDonorAdminData?.preferredCommunication, ''),
    emergencyContactName: getAssessmentValue(getDonorAdminData?.emergencyContactName, ''),
    emergencyContactNumber: getAssessmentValue(getDonorAdminData?.emergencyContactNumber, ''),
    acknowledgementPreference: getAssessmentValue(getDonorAdminData?.acknowledgementPreference, ''),
    communicationSubscription: getAssessmentValue(getDonorAdminData?.communicationSubscription, ''),
    isDpwEmployee: getAssessmentValue(getDonorAdminData?.isDpwEmployee, ''),
    employeeId: getAssessmentValue(getDonorAdminData?.employeeId, ''),
    // employer: getAssessmentValue(getDonorAdminData?.employer, ''),
    companyName: getAssessmentValue(getDonorAdminData?.companyName, ''),
    department: getAssessmentValue(getDonorAdminData?.department, ''),
    isGovAffiliate: getAssessmentValue(getDonorAdminData?.isGovAffiliate, ''),
    donationType: getAssessmentValue(getDonorAdminData?.donationType, ''),
    userPaymentChannel: getAssessmentValue(getDonorAdminData?.donorPledgeResponse?.userPaymentChannel, ''),
    specialInstructions: getAssessmentValue(getDonorAdminData?.specialInstructions, ''),
    organizationName: getAssessmentValue(getDonorAdminData?.organizationDetails?.organizationName, ''),
    organizationInfo: getAssessmentValue(getDonorAdminData?.organizationDetails?.organizationInfo, ''),
    designation: getAssessmentValue(getDonorAdminData?.organizationDetails?.designation, ''),
    organizationRegistrationNumber: getAssessmentValue(
      getDonorAdminData?.organizationDetails?.organizationRegistrationNumber,
      ''
    ),
    orgAttachments: getAssessmentValue(getDonorAdminData?.orgAttachments, ''),
    questions: getDonorAdminData?.questionDetailsListResponse?.questions || []
  };

  const assessmentNeedMoreInfoFlow =
    getDonorAdminData?.donorPledgeResponse?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' &&
    getDonorAdminData?.donorPledgeResponse?.adminHaveAllInformation;

  const prepareRequest = (value) => {
    const request = {
      ...value,
      submissionMode: '',
      adminHaveAllInformation: hasAllInfo,
      iacadRequired: getDonorAdminData?.donationType === 'GENERAL' ? iacadRequired : null,
      iacadJustification,
      questionResponseRequest: {
        ...getDonorAdminData?.questionDetailsListResponse
      }
    };
    request['gender'] = request['gender'] ? request['gender'] : null;
    request['consentProvidedOn'] = fDateTimeStandard(new Date().toISOString());
    request['mobile'] = request['mobile'] ? request['mobile'] : null;
    request['isEmployed'] = request['isEmployed'] === 'yes';
    if (profileImg) {
      request['photoFileId'] = profileImg;
    }
    return request;
  };

  const getSubmitBtnLabel = () => {
    if (
      getDonorAdminData?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' ||
      getDonorAdminData?.status === 'AWAITING_APPROVAL' ||
      assessmentNeedMoreInfoFlow
    ) {
      return 'Re-Submit';
    }
    return 'Submit donor Information';
  };

  const formik = useFormik({
    initialValues: inital,
    validationSchema: getValidationSchema(isAdvanced, isDpwEmployee, getDonorAdminData?.accountType),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const value = values;
      const request = prepareRequest(value);
      if (saveMode === true) {
        request['submissionMode'] = 'savePostsubmit';
      } else {
        request['submissionMode'] = 'submit';
      }
      request['letterFlowRequired'] = checkboxes?.letterFlowRequired;
      request['assessmentFlowRequired'] = checkboxes?.assessmentFlowRequired;
      request['directPayment'] = checkboxes?.directPayment;
      mutate(request);
    }
  });

  // Default content for the letter

  const {
    data: defaultContent,
    isLoading: isDefaultContentLoading,
    isFetching: isDefaultContentFetching
  } = useQuery(
    [
      'getLetterDefaultContent',
      type === 'admin' && (params?.id, getDonorAdminData?.donorPledgeResponse?.donationAmount)
    ],
    () =>
      api.getLetterDefaultContent(
        getDonorAdminData?.donorPledgeResponse?.donationAmount < 50000 ? 'ACCEPTANCE_LETTER' : 'AGREEMENT_LETTER'
      ),
    {
      enabled: (type === 'admin' && (!!params?.id || !!getDonorAdminData?.donorPledgeResponse?.donationAmount)) || false
    }
  );

  // Mutation for submitting the form
  const mutationKey = hasAllInfo ? 'adminDonorSubmitAssessmentForm' : 'adminAssessmentForm';
  const mutationFn = hasAllInfo ? api.adminDonorSubmitAssessmentForm : api.adminAssessmentForm;

  const { mutate, isLoading: isSubmitFormLoading } = useMutation(mutationKey, mutationFn, {
    onSuccess: (response) => {
      if (hasAllInfo) {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      } else {
        dispatch(
          setToastMessage({ message: 'Donor information form successfully sent to donor ', variant: 'success' })
        );
      }
      dispatch(setSubmittedAssessment([]));
      dispatch(resetStep());
      router.push(`/admin/donor-admin`);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  // Scroll to top on mount
  useEffect(() => {
    const firstElement = document.getElementById('top-of-page');
    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (
      getDonorAdminData?.letterFlowRequired ||
      getDonorAdminData?.assessmentFlowRequired ||
      getDonorAdminData?.directPayment
    ) {
      setCheckboxes({
        letterFlowRequired: getDonorAdminData?.letterFlowRequired,
        assessmentFlowRequired: getDonorAdminData?.assessmentFlowRequired,
        directPayment: getDonorAdminData?.directPayment
      });
    }

    if (
      getDonorAdminData?.donorPledgeResponse?.iacadRequired ||
      getDonorAdminData?.donorPledgeResponse?.iacadRequired === false ||
      getDonorAdminData?.donorPledgeResponse?.iacadJustification
    ) {
      setIacadRequired(getDonorAdminData?.donorPledgeResponse?.iacadRequired);
      setIacadJustification(getDonorAdminData?.donorPledgeResponse?.iacadJustification || '');
    }
    if (getDonorAdminData?.donorPledgeResponse?.adminHaveAllInformation) {
      setHasAllInfo(getDonorAdminData?.donorPledgeResponse?.adminHaveAllInformation);
    }
  }, [getDonorAdminData]);

  useEffect(() => {
    if (getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetter) {
      setLatterValues(getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetter);
    } else {
      setLatterValues(defaultContent);
    }
  }, [getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetter, defaultContent]);

  // Fetch form data for the donor
  const {
    isLoading: isGetDonorAdminDataLoading,
    refetch,
    isFetching: isGetDonorAdminDataFetching
  } = useQuery(['getAdminDonorFormData', params.id], () => api.getAdminDonorFormData({ type: type, id: params.id }), {
    enabled: !!params.id,
    onSuccess: (response) => {
      dispatch(setDonorAdminData(response));
    }
  });

  const { mutate: acceptanceLetterCreate } = useMutation(api.acceptanceLetterCreate, {
    onSuccess: async (response) => {
      dispatch(setSubmittedAssessment([]));
      router.push(`/admin/donor-admin`);

      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  // Step navigation handlers
  // Validation schema using Yup
  const validationSchema = Yup.object({
    questions: Yup.array().of(
      Yup.object({
        questionType: Yup.string().required('Type is required'),
        questionText: Yup.string().required('Question text is required'),
        options: Yup.array().when('questionType', {
          is: (type) => type === 'radio' || type === 'multipleSelect' || type === 'dropdown',
          then: (schema) => schema.min(2, 'At least two options are required'),
          otherwise: (schema) => schema.notRequired()
        })
      })
    )
  });

  // Form submission handler
  const handleApproveFormSubmit = () => {
    const payload = {
      submissionMode: 'submit',
      pledgeId: params?.id,
      questions: [],
      letterFlowRequired: checkboxes?.letterFlowRequired,
      assessmentFlowRequired: checkboxes?.assessmentFlowRequired,
      directPayment: checkboxes?.directPayment,
      iacadRequired: getDonorAdminData?.donationType === 'GENERAL' ? iacadRequired : null,
      iacadJustification
    };
    mutate(payload);
  };

  const handleSaveAsDraftLatter = (mode) => {
    const payload = {
      content: latterValues,
      letterType:
        getDonorAdminData?.donorPledgeResponse?.donationAmount < 50000 ? 'ACCEPTANCE_LETTER' : 'AGREEMENT_LETTER',
      mode: mode
    };
    acceptanceLetterCreate({ id: params.id, payload: payload });
  };

  const { handleSubmit } = formik;

  const buildTouched = (errors) => {
    const result = {};
    Object.keys(errors).forEach((key) => {
      const errorValue = errors[key];
      if (Array.isArray(errorValue)) {
        result[key] = errorValue.map((item) => (typeof item === 'object' && item !== null ? buildTouched(item) : true));
      } else if (typeof errorValue === 'object' && errorValue !== null) {
        result[key] = buildTouched(errorValue);
      } else {
        result[key] = true;
      }
    });
    return result;
  };

  const handleValidationErrors = (errors) => {
    formik.setTouched(buildTouched(errors));
    dispatch(
      setToastMessage({
        message: 'Please enter all required fields in both steps!',
        variant: 'error',
        title: 'Error'
      })
    );
  };

  const onSubmit = async (isSave = false) => {
    setSaveMode(isSave);
    const errors = await formik.validateForm();

    if (Object.keys(errors).length === 0) {
      formik.submitForm();
    } else {
      handleValidationErrors(errors);
    }
  };
  const handleCloseQuestionAnswer = () => setOpenQuestionAnswer(false);

  return (
    <>
      <Formik
        initialValues={inital}
        validationSchema={
          hasAllInfo ? getValidationSchema(isAdvanced, isDpwEmployee, getDonorAdminData?.accountType) : validationSchema
        }
        enableReinitialize
        onSubmit={hasAllInfo ? handleSubmit : handleApproveFormSubmit}
      >
        {() => (
          <Form id="top-of-page">
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Header with Back Button and Action Buttons */}
              <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthsm}>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<BackArrow />}
                  onClick={() => router.back()} // Navigate back to the previous page
                  sx={{
                    mb: { xs: 3 },
                    '&:hover': { textDecoration: 'none' }
                  }}
                >
                  Back
                </Button>
              </Grid>
              {(getDonorAdminData?.donorPledgeResponse?.status === 'PLEDGE_APPROVED' ||
                (assessmentNeedMoreInfoFlow && !isView)) && (
                <Grid item xs={8} sm={10} md={10} sx={styles.maxWidthsm}>
                  <Stack
                    justifyContent={{ xs: 'flex-start', sm: 'flex-end', md: 'flex-end' }}
                    flexDirection="row"
                    alignItems={'center'}
                    gap={2}
                    flexWrap="wrap"
                  >
                    <Button
                      type="button"
                      variant={'outlined'}
                      color="inherit"
                      sx={(theme) => ({
                        width: 'auto',
                        [theme.breakpoints.down(419.95)]: {
                          width: '100%'
                        },
                        '@media (min-width:420px) and (max-width:599.95px)': {
                          width: '35%'
                        }
                      })}
                      onClick={() => router.push(`/admin/donor-admin`)}
                    >
                      Cancel
                    </Button>
                    {hasAllInfo ? (
                      <LoadingButton
                        type="button"
                        loading={isSubmitFormLoading}
                        onClick={onSubmit}
                        variant="contained"
                        disabled={
                          !iacadRequired &&
                          iacadJustification?.trim() === '' &&
                          getDonorAdminData?.donationType === 'GENERAL'
                        }
                        sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
                      >
                        {getSubmitBtnLabel()}
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        type="submit"
                        loading={isSubmitFormLoading}
                        variant="contained"
                        disabled={
                          !iacadRequired &&
                          iacadJustification?.trim() === '' &&
                          getDonorAdminData?.donationType === 'GENERAL'
                        }
                        sx={(theme) => ({
                          width: 'auto',
                          [theme.breakpoints.down(419.95)]: {
                            width: '100%'
                          },
                          '@media (min-width:420px) and (max-width:599.95px)': {
                            width: '60%'
                          }
                        })}
                      >
                        {getDonorAdminData?.questionDetailsListResponse?.questions
                          ? 'Modify & Re-share'
                          : 'Share with Donor'}
                      </LoadingButton>
                    )}
                  </Stack>
                </Grid>
              )}
              {(getDonorAdminData?.donorPledgeResponse?.status === 'AWAITING_DOCUMENT_CREATION' ||
                getDonorAdminData?.donorPledgeResponse?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' ||
                getDonorAdminData?.donorPledgeResponse?.status === 'DOCUMENT_MORE_INFO_REQUIRED' ||
                getDonorAdminData?.donorPledgeResponse?.status === 'DONOR_MORE_INFO_REQUIRED') &&
                !assessmentNeedMoreInfoFlow &&
                isView !== 'true' && (
                  <Grid item xs={12} md={10}>
                    <Stack
                      justifyContent={{ xs: 'flex-start', sm: 'flex-end', md: 'flex-end' }}
                      flexDirection="row"
                      alignItems={'center'}
                      gap={2}
                      flexWrap="wrap"
                    >
                      <Button
                        type="button"
                        variant={'outlined'}
                        color="inherit"
                        sx={(theme) => ({
                          width: 'auto',
                          [theme.breakpoints.down(419.95)]: {
                            width: '100%'
                          },
                          '@media (min-width:420px) and (max-width:599.95px)': {
                            width: '30%'
                          }
                        })}
                        onClick={() => router.push(`/admin/donor-admin`)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant={'outlined'}
                        color="inherit"
                        sx={(theme) => ({
                          width: 'auto',
                          [theme.breakpoints.down(419.95)]: {
                            width: '100%'
                          },
                          '@media (min-width:420px) and (max-width:599.95px)': {
                            width: '40%'
                          }
                        })}
                        onClick={() => handleSaveAsDraftLatter('save')}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        sx={(theme) => ({
                          width: 'auto',
                          [theme.breakpoints.down(419.95)]: {
                            width: '100%'
                          },
                          '@media (min-width:420px) and (max-width:599.95px)': {
                            width: '25%'
                          }
                        })}
                        onClick={() => handleSaveAsDraftLatter('submit')}
                      >
                        {getDonorAdminData?.donorPledgeResponse?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' ||
                        getDonorAdminData?.donorPledgeResponse?.status === 'DOCUMENT_MORE_INFO_REQUIRED' ||
                        getDonorAdminData?.donorPledgeResponse?.status === 'DONOR_MORE_INFO_REQUIRED'
                          ? 'Re-Submit'
                          : 'Submit'}
                      </Button>
                    </Stack>
                  </Grid>
                )}

              {/* Title */}
              <Grid item xs={12}>
                <Typography variant="h5" color={'primary.main'} textTransform="uppercase" mb={2}>
                  Donor’s Information
                </Typography>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <FormikProvider value={formik}>
        {isGetDonorAdminDataLoading ||
        isGetDonorAdminDataFetching ||
        isDefaultContentFetching ||
        isDefaultContentLoading ? (
          <LoadingFallback />
        ) : (
          <DonationForm
            setIsAdvanced={setIsAdvanced}
            setIsDpwEmployee={setIsDpwEmployee}
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            handleClickAssessmentAnswerView={() => setOpenQuestionAnswer(true)}
            type={type}
            isLoading={isSubmitFormLoading}
            isViewOnly
            isCreate={isCreate}
            setLatterValues={setLatterValues}
            latterValues={latterValues}
            donorDataRefetch={refetch}
            hasAllInfo={hasAllInfo}
            setHasAllInfo={setHasAllInfo}
            getDonorAdminData={getDonorAdminData}
            formik={formik}
            step1Field={step1Field}
            orgFields={orgFields}
            step2Field={step2Field}
            profileImg={profileImg}
            setProfileImg={setProfileImg}
            iacadRequired={iacadRequired}
            setIacadRequired={setIacadRequired}
            setIacadJustification={setIacadJustification}
            iacadJustification={iacadJustification}
          />
        )}
      </FormikProvider>
      {openQuestionAnswer && (
        <QuestionsAnswerView
          open={openQuestionAnswer}
          onClose={handleCloseQuestionAnswer}
          questionSet={getDonorAdminData?.questionDetailsListResponse}
        />
      )}
    </>
  );
}
