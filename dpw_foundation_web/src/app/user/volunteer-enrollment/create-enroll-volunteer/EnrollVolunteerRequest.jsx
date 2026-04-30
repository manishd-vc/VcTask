'use client';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, useTheme } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CancelDialog from 'src/components/_admin/my-donations/cancelDialog';
import CommonStyle, { buttonResponsiveStyle } from 'src/components/common.styles';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as volunteerApi from 'src/services/volunteer';
import * as yup from 'yup';
import EnrollVolunteerRequestStepper from './EnrollVolunteerRequestStepper';

const step1Schema = yup.object().shape({
  salutation: yup.string().required('Salutation is required'),
  dob: yup.date().required('Date of Birth is required'),
  gender: yup.string().required('Gender is required'),
  currentCountryOfResidence: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  mailingAddress: yup.string().required('Mailing Address is required'),
  emergencyContactNumber: yup.string().required('Emergency Contact Number is required'),
  homeAddress: yup.string().required('Home Address is required'),
  relationWithEmergencyContact: yup.string().required('Relation with Emergency Contact is required'),
  homePhoneNumber: yup.string().required('Home Phone Number is required'),
  nativeLanguage: yup.string().required('Native Language is required'),
  department: yup.string().when('isDpwEmployee', {
    is: (val) => val === true,
    then: (schema) => schema.required('Department is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  employeeId: yup.string().when('isDpwEmployee', {
    is: (val) => val === true,
    then: (schema) => schema.required('Employee ID is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  companyName: yup.string().when('isDpwEmployee', {
    is: (val) => val === true,
    then: (schema) => schema.required('Company Name is required'),
    otherwise: (schema) => schema.notRequired()
  })
});

const step2Schema = yup.object().shape({
  volunteerCampaignId: yup.string().required('Volunteer Campaign is required')
});
const fullSchema = step1Schema.concat(step2Schema);
const validationSchemas = [step1Schema, step2Schema];
const getInitialValues = (value, defaultValue) => value ?? defaultValue;

export default function EnrollVolunteerRequest() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const styles = CommonStyle(theme);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const { volunteerEnrollmentData, volunteerFormData } = useSelector((state) => state?.profile);
  const { profileData } = useSelector((state) => state?.profile);
  const { activeStep } = useSelector((state) => state?.stepper);

  const { mutate: updatePartnershipRequest, isLoading } = useMutation(volunteerApi.createUpdateVolunteerEnrollment, {
    onSuccess: (response) => {
      setLoadingButton(null);
      if (response.data.status == 'DRAFT') {
        dispatch(
          setToastMessage({
            message: 'Data Successfully Saved As Draft',
            variant: 'warning',
            title: 'Volunteer Enrollment Saved as draft'
          })
        );
      } else {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      }
      router.push(`/user/my-enrolments`);
      dispatch(resetStep());
    },
    onError: (error) => {
      setLoadingButton(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      salutation: getInitialValues(volunteerEnrollmentData?.salutation, ''),
      dob: getInitialValues(volunteerEnrollmentData?.dateOfBirth, null),
      maritalStatus: getInitialValues(volunteerEnrollmentData?.maritalStatus, ''),
      gender: getInitialValues(volunteerEnrollmentData?.gender, ''),
      currentCountryOfResidence: getInitialValues(volunteerEnrollmentData?.currentCountryOfResidence, ''),
      state: getInitialValues(volunteerEnrollmentData?.state, ''),
      city: getInitialValues(volunteerEnrollmentData?.city, ''),
      mailingAddress: getInitialValues(volunteerEnrollmentData?.mailingAddress, ''),
      preferredCommunication: getInitialValues(volunteerEnrollmentData?.preferredCommunication, ''),
      emergencyContactName: getInitialValues(volunteerEnrollmentData?.emergencyContactName, ''),
      emergencyContactNumber: getInitialValues(volunteerEnrollmentData?.emergencyContactNumber, ''),
      homeAddress: getInitialValues(volunteerEnrollmentData?.homeAddress, ''),
      relationWithEmergencyContact: getInitialValues(volunteerEnrollmentData?.relationWithEmergencyContact, ''),
      documentDetails:
        Array.isArray(volunteerEnrollmentData?.documentDetails) && volunteerEnrollmentData.documentDetails.length > 0
          ? volunteerEnrollmentData.documentDetails.map((doc) => ({
              id: doc?.id || '',
              documentType: doc?.documentType || '',
              documentNumber: doc?.documentNumber || '',
              documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
              documentImageId: doc?.documentImageId || '',
              fileName: doc?.fileName || '',
              preSignedUrl: doc?.preSignedUrl || ''
            }))
          : [],
      isDpwEmployee: getInitialValues(volunteerEnrollmentData?.isDpwEmployee, false),
      employeeId: getInitialValues(volunteerEnrollmentData?.employeeId, ''),
      companyName: getInitialValues(volunteerEnrollmentData?.companyName, ''),
      department: getInitialValues(volunteerEnrollmentData?.department, ''),
      dlAvailability: getInitialValues(volunteerEnrollmentData?.dlAvailability, false),
      carAvailability: getInitialValues(volunteerEnrollmentData?.carAvailability, false),
      homePhoneNumber: getInitialValues(volunteerEnrollmentData?.homePhoneNumber, ''),
      volunteerCampaignId: getInitialValues(volunteerEnrollmentData?.volunteerCampaignId, ''),
      nativeLanguage: getInitialValues(volunteerEnrollmentData?.nativeLanguage, ''),
      otherLanguage: getInitialValues(
        Array.isArray(volunteerEnrollmentData?.otherLanguage)
          ? volunteerEnrollmentData.otherLanguage.map((item) => item.code)
          : [],
        []
      ),
      volunteeringArea: getInitialValues(
        Array.isArray(volunteerEnrollmentData?.volunteeringArea)
          ? volunteerEnrollmentData.volunteeringArea.map((item) => item.code)
          : [],
        []
      ),
      skillCertifications: getInitialValues(volunteerEnrollmentData?.skillCertifications, []),
      volunteeringSupportDocuments: getInitialValues(volunteerEnrollmentData?.volunteeringSupportDocuments, []),
      volunteerReleaseAccepted: getInitialValues(volunteerEnrollmentData?.volunteerReleaseAccepted, false),
      waiverRequired: getInitialValues(volunteerEnrollmentData?.volunteerCampaign?.waiverRequired, false),
      otherVolunteeringArea: getInitialValues(volunteerEnrollmentData?.otherVolunteeringArea, '')
    },
    validationSchema: validationSchemas[activeStep]
  });
  const { values, handleSubmit, setTouched } = formik;

  const createPayload = (submissionMode) => ({
    id: volunteerFormData?.id,
    salutation: values.salutation || '',
    dob: values.dob,
    maritalStatus: values.maritalStatus,
    gender: values.gender,
    currentCountryOfResidence: values.currentCountryOfResidence,
    state: values.state,
    city: values.city,
    mailingAddress: values.mailingAddress,
    preferredCommunication: values.preferredCommunication,
    emergencyContactName: values.emergencyContactName,
    emergencyContactNumber: values.emergencyContactNumber,
    homeAddress: values.homeAddress,
    relationWithEmergencyContact: values.relationWithEmergencyContact,
    documentDetails: values.documentDetails || [],
    isDpwEmployee: values.isDpwEmployee,
    employeeId: values.employeeId || '',
    companyName: values.companyName || '',
    department: values.department || '',
    dlAvailability: values.dlAvailability,
    carAvailability: values.carAvailability,
    homePhoneNumber: values.homePhoneNumber,
    volunteerCampaignId: values.volunteerCampaignId,
    nativeLanguage: values.nativeLanguage || '',
    otherLanguage: Array.isArray(values.otherLanguage) ? values.otherLanguage.map((code) => ({ code })) : [],
    volunteeringArea: Array.isArray(values.volunteeringArea) ? values.volunteeringArea.map((code) => ({ code })) : [],
    skillCertifications: values.skillCertifications || [],
    volunteeringSupportDocuments: values.volunteeringSupportDocuments || [],
    volunteerReleaseAccepted: values.volunteerReleaseAccepted,
    waiverRequired: values.waiverRequired,
    otherVolunteeringArea: values.otherVolunteeringArea || '',
    userId: profileData?.id,
    submissionMode
  });

  const handleMainSubmit = async () => {
    try {
      await fullSchema.validate(values, { abortEarly: false });
      setLoadingButton('save');
      updatePartnershipRequest(createPayload('submit'));
    } catch (error) {
      const errorFields = error?.inner?.reduce((acc, err) => {
        acc[err.path] = true;
        return acc;
      }, {});

      const missingFields = error.inner.map((err) => {
        const match = err.message.match(/^(.*) is required/);
        return match ? match[1] : err.path;
      });

      const uniqueFields = [...new Set(missingFields)].join(',  ');

      setTouched(errorFields);
      dispatch(
        setToastMessage({
          message: `Please complete all required fields before submitting. ${uniqueFields}`,
          variant: 'error'
        })
      );
    }
  };

  const handleSaveAsDraft = () => {
    setLoadingButton('draft');
    updatePartnershipRequest(createPayload('draft'));
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.back();
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthsm}>
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
          </Grid>
          <Grid item xs={8} sm={10} md={10} sx={styles.maxWidthsm}>
            <Stack
              justifyContent={{ xs: 'flex-start', sm: 'flex-end', md: 'flex-end' }}
              flexDirection="row"
              alignItems="center"
              gap={2}
              flexWrap="wrap"
            >
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                sx={buttonResponsiveStyle('25%')}
                onClick={() => setOpenCancelDialog(true)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <LoadingButton
                type="button"
                variant="outlined"
                sx={buttonResponsiveStyle('25%')}
                onClick={handleSaveAsDraft}
                loading={loadingButton === 'draft'}
              >
                Save as Draft
              </LoadingButton>
              <LoadingButton
                type="button"
                variant="contained"
                sx={buttonResponsiveStyle('25%')}
                onClick={handleMainSubmit}
                loading={loadingButton === 'save'}
              >
                Save
              </LoadingButton>
            </Stack>
          </Grid>
          <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
        </Grid>
        <HeaderBreadcrumbs admin heading={'Create Enrollment Request'} />
        <EnrollVolunteerRequestStepper />
      </Form>
    </FormikProvider>
  );
}
