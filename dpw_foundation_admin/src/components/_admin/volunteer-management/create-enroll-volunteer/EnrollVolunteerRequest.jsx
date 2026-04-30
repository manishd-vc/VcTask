'use client';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, IconButton, InputAdornment, Paper, Stack, TextField, useTheme } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CommonStyle, { buttonResponsiveStyle } from 'src/components/common.styles';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow, RightArrowIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import { setVolunteerEnrollmentData, setVolunteerEnrollmentLoading } from 'src/redux/slices/volunteer';
import * as volunteerApi from 'src/services/volunteer';
import * as yup from 'yup';
import CancelDialog from '../../campaign/cancelDialog';
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
  const { id } = useParams();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const styles = CommonStyle(theme);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const { volunteerEnrollmentData } = useSelector((state) => state?.volunteer);
  const { activeStep } = useSelector((state) => state?.stepper);

  useQuery(
    ['volunteerEnrollment', volunteerApi.getVolunteerEnrollmentById, id],
    () => {
      dispatch(setVolunteerEnrollmentLoading(true));
      return volunteerApi.getVolunteerEnrollmentById(id);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setVolunteerEnrollmentData(data));
        dispatch(setVolunteerEnrollmentLoading(false));
      },
      onError: () => {
        dispatch(setVolunteerEnrollmentLoading(false));
      },
      onSettled: () => {
        dispatch(setVolunteerEnrollmentLoading(false));
      }
    }
  );

  const { mutate: updatePartnershipRequest, isLoading } = useMutation(volunteerApi.createUpdateVolunteerEnrollment, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      router.push(`/admin/all-volunteers`);
      dispatch(resetStep());
      dispatch(setVolunteerEnrollmentData(null));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      salutation: getInitialValues(volunteerEnrollmentData?.salutation, ''),
      dob: getInitialValues(volunteerEnrollmentData?.dob, ''),
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
      otherLanguage: getInitialValues(volunteerEnrollmentData?.otherLanguage, []),
      volunteeringArea: getInitialValues(volunteerEnrollmentData?.volunteeringArea, []),
      skillCertifications: getInitialValues(volunteerEnrollmentData?.skillCertifications, []),
      volunteeringSupportDocuments: getInitialValues(volunteerEnrollmentData?.volunteeringSupportDocuments, []),
      volunteerReleaseAccepted: getInitialValues(volunteerEnrollmentData?.volunteerReleaseAccepted, false),
      availability: getInitialValues(volunteerEnrollmentData?.availability, []),
      waiverRequired: getInitialValues(volunteerEnrollmentData?.waiverRequired, false),
      otherVolunteeringArea: getInitialValues(volunteerEnrollmentData?.otherVolunteeringArea, '')
    },
    validationSchema: validationSchemas[activeStep]
  });
  const { values, handleSubmit, setTouched } = formik;

  const handleMainSubmit = async () => {
    try {
      await fullSchema.validate(values, { abortEarly: false });
      const payload = {
        ...values,
        userId: volunteerEnrollmentData?.userId,
        submissionMode: 'submit'
      };
      updatePartnershipRequest({ payload });
      // Trigger final API submit if needed here
    } catch (error) {
      const errorFields = error?.inner?.reduce((acc, err) => {
        acc[err.path] = true;
        return acc;
      }, {});

      const missingFields = error.inner.map((err) => {
        // Try to extract the field label from the message before "is required"
        const match = err.message.match(/^(.*) is required/);
        const fieldName = match ? match[1] : err.path;

        // Transform specific field names to user-friendly labels
        return fieldName === 'dob' ? 'Date of Birth' : fieldName;
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

  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/all-volunteers`);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthsm}>
            <Button
              variant="text"
              color="primary"
              startIcon={<BackArrow />}
              onClick={() => setOpenCancelDialog(true)}
              sx={{
                mb: { xs: 2 },
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
                sx={buttonResponsiveStyle('35%')}
                onClick={() => setOpenCancelDialog(true)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <LoadingButton
                type="button"
                variant="contained"
                sx={buttonResponsiveStyle('25%')}
                onClick={handleMainSubmit}
                loading={isLoading}
              >
                {status === 'ENROLLED' ? 'Submit' : 'Save'}
              </LoadingButton>
            </Stack>
          </Grid>
          <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
        </Grid>
        <HeaderBreadcrumbs heading={status === 'ENROLLED' ? 'Enroll a Volunteer' : 'Create & Enroll Volunteer'} />
        {status !== 'ENROLLED' && (
          <Paper sx={{ p: 3, my: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={false}>
                  <TextField
                    id="email"
                    variant="standard"
                    label="Enter Email ID"
                    required
                    fullWidth
                    value={volunteerEnrollmentData?.email}
                    disabled
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton type="button" disabled={true}>
                            <RightArrowIcon height={35} width={35} />
                          </IconButton>
                        </InputAdornment>
                      ),
                      type: 'email',
                      readOnly: false
                    }}
                  />
                </FieldWithSkeleton>
              </Grid>
            </Grid>
          </Paper>
        )}
        <EnrollVolunteerRequestStepper />
      </Form>
    </FormikProvider>
  );
}
