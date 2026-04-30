'use client';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BackArrow, BackDisabledArrow, NextDisabledArrow } from 'src/components/icons';
import Steppers from 'src/components/stepper/stepper';
import { setToastMessage } from 'src/redux/slices/common';
import { nextStep, previousStep, resetStep } from 'src/redux/slices/stepper';
import * as api from 'src/services';
import { removeCommas } from 'src/utils/formatNumber';
import { fDateTimeStandard } from 'src/utils/formatTime';
import * as Yup from 'yup';
import CancelDialog from './cancelDialog';
import IntentDetail from './intentDetail';
import MoreInfo from './moreInfo';
const Step1 = React.lazy(() => import('./steps/step1/step1'));
const Step2 = React.lazy(() => import('./steps/step2'));

const commonFields = {
  documentDetails: Yup.array().of(
    Yup.object().shape({
      documentType: Yup.string()
        .required('Document type is required')
        .test('unique-documentType', 'Each document type must be unique', function (value) {
          const { options } = this;
          const { documentDetails } = options.context;
          const duplicates = documentDetails.filter((doc) => doc.documentType === value);
          return duplicates.length <= 1;
        }),
      documentNumber: Yup.string().required('Document number is required'),
      documentValidity: Yup.date().nullable().required('Document validity is required')
    })
  ),
  mobile: Yup.string().required('Mobile is required'),
  // isEmployed: Yup.string().required('Employed is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  currentCountryOfResidence: Yup.string().required('Country of residence is required'),
  donationAmount: Yup.string().required('Donation amount is required'),
  donationCurrency: Yup.string().required('Donation currency is required'),
  // donationMethod: Yup.string().required('Donation type is required'),
  isTaxReceiptRequired: Yup.string().required('Tax recepit is required'),
  isActivityUpdateRequired: Yup.string().required('Activity updated is required'),
  mailingAddress: Yup.string().required('Mailing Address is required'),
  preferredCommunication: Yup.string().required('Preferred Communication is required')
};

const getValidationSchema = (isAdvanced, isDpwEmployee, donorType) => {
  let advance = {};
  if (isAdvanced == 'yes') {
    advance = {
      occupation: Yup.string().required('Occupation are required')
    };
  }
  let dpwEmp = {};
  if (isDpwEmployee == 'yes') {
    dpwEmp = {
      employeeId: Yup.string().required('EmployeeId are required'),
      companyName: Yup.string().required('Company Name is required'),
      department: Yup.string().required('Department is required')
    };
  }
  const conditionalFields = {
    ...commonFields,
    dob: donorType === 'Individual' ? Yup.string().required('DOB is required') : Yup.string(),
    gender: donorType === 'Individual' ? Yup.string().required('Gender is required') : Yup.string(),
    organizationName:
      donorType !== 'Individual' ? Yup.string().required('Organization Name is required') : Yup.string(),
    organizationInfo:
      donorType !== 'Individual' ? Yup.string().required('Organization Info is required') : Yup.string(),
    emergencyContactNumber:
      donorType === 'Individual' ? Yup.string().required('Emergency Contact Number is required') : Yup.string(),
    designation: donorType !== 'Individual' ? Yup.string().required('Designation is required') : Yup.string(),
    organizationRegistrationNumber:
      donorType !== 'Individual' ? Yup.string().required('Organization Registration Number is required') : Yup.string()
  };
  return Yup.object({
    ...conditionalFields,
    ...advance,
    ...dpwEmp
  });
};

const step1Field = [
  'passportAttachments',
  'mobile',
  'dob',
  'gender',
  'currentCountryOfResidence',
  'state',
  'city',
  'mailingAddress',
  'preferredCommunication',
  'emergencyContactNumber',
  'acknowledgementPreference',
  'isDpwEmployee',
  // 'employeeId',
  // 'employer',
  // 'companyName',
  // 'department',
  'isGovAffiliate'
];

const orgFields = [
  'passportAttachments',
  'mobile',
  'organizationName',
  'organizationInfo',
  'designation',
  'currentCountryOfResidence',
  'state',
  'city',
  'mailingAddress',
  'organizationRegistrationNumber',
  'preferredCommunication',
  'acknowledgementPreference',
  'isDpwEmployee',
  // 'employeeId',
  // 'employer',
  // 'companyName',
  // 'department',
  'isGovAffiliate'
];

const step2Feld = ['donationAmount', 'donationCurrency', 'userPaymentChannel', 'isConsentProvided'];

const DonationForm = ({ data, refetch }) => {
  const dispatch = useDispatch();
  const [saveMode, setSaveMode] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(data?.assessment?.isEmployed ? 'yes' : 'no');
  const [isDpwEmployee, setIsDpwEmployee] = useState(data?.assessment?.isDpwEmployee ? 'yes' : 'no');
  const router = useRouter();
  const [tick, setTick] = useState({
    0: false,
    1: false,
    2: false
  });
  const { activeStep } = useSelector((state) => state?.stepper);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const getAssessmentValue = (value, defaultValue) => value ?? defaultValue;
  const inital = {
    pledgeId: getAssessmentValue(data?.assessment?.donorPledgeResponse?.id, ''),
    gender: getAssessmentValue(data?.assessment?.gender?.toLowerCase(), ''),
    mobile: getAssessmentValue(data?.assessment?.mobile, ''),
    currentCountryOfResidence: getAssessmentValue(data?.assessment?.currentCountryOfResidence, ''),
    state: getAssessmentValue(data?.assessment?.state, ''),
    donationAmount: getAssessmentValue(data?.assessment?.donorPledgeResponse?.donationAmount, ''),
    donationCurrency: getAssessmentValue(data?.assessment?.donorPledgeResponse?.donationCurrency, ''),
    userPaymentChannel: getAssessmentValue(data?.assessment?.donorPledgeResponse?.userPaymentChannel, ''),
    isTaxReceiptRequired: getAssessmentValue(data?.assessment?.isTaxReceiptRequired, ''),
    isActivityUpdateRequired: getAssessmentValue(data?.assessment?.isActivityUpdateRequired, 'true'),
    isConsentProvided: getAssessmentValue(data?.assessment?.isConsentProvided, ''),
    consentProvidedOn: getAssessmentValue(data?.assessment?.consentProvidedOn, ''),
    documentDetails: getAssessmentValue(data?.assessment?.documentDetails, [
      {
        documentType: '',
        documentNumber: '',
        documentValidity: null,
        documentImageId: null,
        fileName: ''
      }
    ]),
    dob: getAssessmentValue(data?.assessment?.donorPledgeResponse?.dob, ''),
    city: getAssessmentValue(data?.assessment?.city, ''),
    mailingAddress: getAssessmentValue(data?.assessment?.mailingAddress, ''),
    preferredCommunication: getAssessmentValue(data?.assessment?.preferredCommunication, ''),
    emergencyContactName: getAssessmentValue(data?.assessment?.emergencyContactName, ''),
    emergencyContactNumber: getAssessmentValue(data?.assessment?.emergencyContactNumber, ''),
    acknowledgementPreference: getAssessmentValue(data?.assessment?.acknowledgementPreference, ''),
    communicationSubscription: getAssessmentValue(data?.assessment?.communicationSubscription, ''),
    isDpwEmployee: getAssessmentValue(data?.assessment?.isDpwEmployee, ''),
    employeeId: getAssessmentValue(data?.assessment?.employeeId, ''),
    companyName: getAssessmentValue(data?.assessment?.companyName, ''),
    department: getAssessmentValue(data?.assessment?.department, ''),
    isGovAffiliate: getAssessmentValue(data?.assessment?.isGovAffiliate, ''),
    donationMethod: getAssessmentValue(data?.donationMethod, ''),
    specialInstructions: getAssessmentValue(data?.assessment?.specialInstructions, ''),
    organizationName: getAssessmentValue(data?.assessment?.organizationDetails?.organizationName, ''),
    organizationInfo: getAssessmentValue(data?.assessment?.organizationDetails?.organizationInfo, ''),
    designation: getAssessmentValue(data?.assessment?.organizationDetails?.designation, ''),
    organizationRegistrationNumber: getAssessmentValue(
      data?.assessment?.organizationDetails?.organizationRegistrationNumber,
      ''
    ),
    orgAttachments: getAssessmentValue(data?.assessment?.orgAttachments, '')
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/user/my-donations`);
  };

  const handleNext = async () => {
    if (activeStep == 0) {
      manageTickStep1();
    }
    if (activeStep == 1) {
      manageTickStep2();
    }
    dispatch(nextStep());
  };

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        manageBothTick();
      }, 1000);
    }
  }, [data]);

  const handleBack = () => {
    if (activeStep > 0) {
      dispatch(previousStep());
    }
  };

  const { mutate, isLoading } = useMutation(api.updateDonor, {
    onSuccess: (result) => {
      dispatch(resetStep());
      router.push('/user/my-donations');

      if (result.data.status == 'AWAITING_DONOR_INFO') {
        dispatch(
          setToastMessage({
            message: result.message,
            variant: 'warning',
            title: 'Saved as draft'
          })
        );
      } else {
        const title = data?.status === 'AWAITING_APPROVAL' ? 'More Information Updated' : 'SUCCESS';
        dispatch(
          setToastMessage({
            message: result.message,
            variant: 'success',
            title
          })
        );
      }
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const formik = useFormik({
    initialValues: inital,
    validationSchema: getValidationSchema(isAdvanced, isDpwEmployee, data?.donorType),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const value = values;
      const request = prepareRequest(value);
      if (saveMode === true) {
        request['submissionMode'] = 'savePostsubmit';
      } else {
        request['submissionMode'] = 'submit';
      }
      mutate(request);
    }
  });

  const saveDraft = () => {
    if (formik) {
      const value = formik.values;
      const request = prepareRequest(value);
      mutate(request);
    }
  };

  const manageTickStep1 = async () => {
    try {
      const values = formik.values;
      const errors = await formik.validateForm();
      let fieldsToTouch;
      if (data?.donorType === 'Individual') {
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
      const errors = await formik.validateForm();
      const fieldsToTouch = step2Feld;
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
    } catch (e) {
      console.log(e);
    }
  };

  const manageBothTick = async () => {
    try {
      const values = formik.values;
      const errors = await formik.validateForm();
      let fieldsToTouchStep1 = [];
      if (values.isEmployed === 'yes') {
        fieldsToTouchStep1.push('occupation');
      }
      let errorStep1 = false;
      fieldsToTouchStep1.forEach((field) => {
        if (errors[field]) {
          errorStep1 = true;
        }
      });
      const fieldsToTouchStep2 = step2Feld;
      let errorStep2 = false;
      fieldsToTouchStep2.forEach((field) => {
        if (errors[field]) {
          errorStep2 = true;
        }
      });
      let stick = {
        ...tick
      };
      if (!errorStep1) {
        stick = {
          ...stick,
          0: true
        };
      }
      if (!errorStep2) {
        stick = {
          ...stick,
          1: true
        };
      }
      setTick(stick);
    } catch (e) {
      console.log(e);
    }
  };

  const prepareRequest = (value) => {
    const request = {
      ...value,
      submissionMode: '',
      questionResponseRequest: {
        ...data?.assessment?.questionDetailsListResponse
      }
    };
    request['donationAmount'] = Number(removeCommas(value.donationAmount));
    request['gender'] = request['gender'] ? request['gender'] : null;
    request['consentProvidedOn'] = fDateTimeStandard(new Date().toISOString());
    request['mobile'] = request['mobile'] ? request['mobile'] : null;
    request['isEmployed'] = request['isEmployed'] === 'yes';
    if (profileImg) {
      request['photoFileId'] = profileImg;
    }
    return request;
  };

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
    console.log('error', errors);
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

  const { handleSubmit } = formik;

  const getSubmitBtnLabel = () => {
    if (data?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' || data?.status === 'AWAITING_APPROVAL') {
      return 'Re-Submit';
    }
    return 'Submit';
  };

  const getButtonProps = () => ({
    variant: activeStep === 0 ? 'contained' : 'outlined',
    disabled: activeStep === 0,
    startIcon: activeStep === 0 ? <BackDisabledArrow /> : <BackArrow />
  });

  // Usage
  const { variant: buttonVariant, disabled: buttonDisabled, startIcon: buttonStartIcon } = getButtonProps();
  const getNextButtonDisabled = () => activeStep === 1;

  const stepsActive = () => {
    return ['Step one', 'Step Two'];
  };

  const stepCount = () => 2;

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={4} md={2}>
          <Button
            sx={{ paddingLeft: 0 }}
            color="primary"
            onClick={() => setOpenCancelDialog(true)}
            startIcon={<BackArrow sx={{ marginRight: '5px' }} />} // or wrap with <Box> if you need more styling
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={12} md={10}>
          <Stack justifyContent={{ sm: 'flex-start', md: 'flex-end' }} flexDirection="row" gap={2} flexWrap="wrap">
            <Button
              onClick={() => {
                setOpenCancelDialog(true);
              }}
              type="button"
              variant={'outlined'}
              color="inherit"
              sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
            >
              Cancel
            </Button>
            {data?.status !== 'AWAITING_APPROVAL' && (
              <Button
                variant="outlined"
                type="button"
                color="inherit"
                onClick={saveDraft}
                sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
              >
                Save as Draft
              </Button>
            )}
            {data?.status !== 'AWAITING_APPROVAL' && (
              <LoadingButton
                type="button"
                loading={isLoading}
                onClick={onSubmit}
                variant="contained"
                sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
              >
                {getSubmitBtnLabel()}
              </LoadingButton>
            )}
          </Stack>
        </Grid>
      </Grid>
      {(data?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' ||
        data?.status === 'DONOR_MORE_INFO_REQUIRED' ||
        data?.status === 'DOCUMENT_MORE_INFO_REQUIRED') && (
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
            data?.assessment?.donorPledgeResponse?.needInfoFileName ||
            data?.assessment?.donorPledgeResponse?.adminNeedInfoName ||
            data?.assessment?.donorPledgeResponse?.hodNeedInfoName
          }
          status={data?.status}
        />
      )}
      <Grid item xs={12}>
        <Typography variant="h5" color={'primary.main'} textTransform="uppercase">
          Donor’s Information
        </Typography>
      </Grid>
      <Paper sx={{ p: 4, mb: 3, mt: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          Donation Pledge
        </Typography>
        <IntentDetail data={data} />
      </Paper>
      <FormikProvider value={formik}>
        <Form noValidate onSubmit={handleSubmit}>
          <Steppers steps={stepsActive()} stepCount={stepCount()} activeStep={activeStep} tick={tick}>
            {activeStep === 0 && (
              <Suspense
                fallback={
                  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                    <LinearProgress />
                  </Stack>
                }
              >
                <Step1
                  setIsAdvanced={setIsAdvanced}
                  setIsDpwEmployee={setIsDpwEmployee}
                  isLoading={isLoading}
                  data={data}
                  donorType={data?.donorType}
                  refetch={refetch}
                  profileImg={profileImg}
                  setProfileImg={setProfileImg}
                />
              </Suspense>
            )}
            {activeStep === 1 && (
              <Suspense
                fallback={
                  <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                    <LinearProgress />
                  </Stack>
                }
              >
                <Step2 data={data} isLoading={isLoading} />
              </Suspense>
            )}
            <Stack flexDirection="row" justifyContent="flex-end" gap={1} sx={{ pt: 2 }}>
              <Button
                variant={buttonVariant}
                color="inherit"
                type="button"
                disabled={buttonDisabled}
                onClick={handleBack}
                sx={{ mr: 1 }}
                startIcon={buttonStartIcon}
              >
                Previous
              </Button>
              <LoadingButton
                endIcon={<NextDisabledArrow />}
                type="button"
                onClick={handleNext}
                disabled={getNextButtonDisabled()}
                loading={isLoading}
                variant="contained"
              >
                Next
              </LoadingButton>
            </Stack>
          </Steppers>
        </Form>
      </FormikProvider>
      <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
    </>
  );
};

DonationForm.propTypes = {
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
      mobile: PropTypes.string,
      isEmployed: PropTypes.bool,
      occupation: PropTypes.string,
      currentCountryOfResidence: PropTypes.string,
      state: PropTypes.string,
      isTaxReceiptRequired: PropTypes.bool,
      isActivityUpdateRequired: PropTypes.bool,
      isConsentProvided: PropTypes.bool,
      consentProvidedOn: PropTypes.string,
      questionDetailsListResponse: PropTypes.shape({
        questions: PropTypes.arrayOf(PropTypes.string)
      }),
      dob: PropTypes.string,
      mailingAddress: PropTypes.string,
      preferredCommunication: PropTypes.string
    })
  }).isRequired
};
export default DonationForm;
