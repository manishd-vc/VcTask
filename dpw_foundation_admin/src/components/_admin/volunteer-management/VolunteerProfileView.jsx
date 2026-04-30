'use client';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import IdentityDocuments from 'src/components/_admin/volunteer-management/view-request/viewEnrolmentRequestById/identity-documents';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import VolunteeringInformation from '../users/VolunteeringInformation';
import ProfilePicture from '../users/profilePicture';
const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function VolunteerProfileView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { masterData } = useSelector((state) => state?.common);

  const { data: volunteerData, isLoading } = useQuery(['volunteer', id], () => volunteerApi.getVolunteerById(id), {
    enabled: !!id,
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error?.response?.data?.message || 'Failed to fetch volunteer data',
          variant: 'error'
        })
      );
    }
  });
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const { data: projectStateData } = useQuery(
    ['getStates', volunteerData?.currentCountryOfResidence],
    () => api.getStates(volunteerData?.currentCountryOfResidence),
    {
      enabled: !!volunteerData?.currentCountryOfResidence,
      refetchOnWindowFocus: false
    }
  );

  if (isLoading) {
    return <LoadingFallback />;
  }
  const countryLabel = country?.find((item) => item?.code === volunteerData?.currentCountryOfResidence)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === volunteerData?.state)?.label;
  const profileFields = [
    { label: 'Registered As', value: volunteerData?.accountType },
    { label: 'Email ID', value: volunteerData?.email },
    { label: 'First Name', value: volunteerData?.firstName, textTransform: 'capitalize' },
    { label: 'Second Name', value: volunteerData?.lastName, textTransform: 'capitalize' },
    { label: 'Phone Number', value: volunteerData?.mobile },
    {
      label: 'Salutation',
      value: getLabelByCode(masterData, 'dpw_foundation_user_salutation', volunteerData?.salutation)
    },
    { label: 'Date of Birth', value: volunteerData?.dob ? fDateWithLocale(volunteerData?.dob) : '-' },
    {
      label: 'Marital Status',
      value: getLabelByCode(masterData, 'dpw_foundation_user_marital_status', volunteerData?.maritalStatus)
    },
    { label: 'Gender', value: getLabelByCode(masterData, 'dpw_foundation_user_gender', volunteerData?.gender) },
    { label: 'Country', value: countryLabel || volunteerData?.currentCountryOfResidence },
    { label: 'State/Province', value: stateLabel || volunteerData?.state },
    { label: 'City', value: volunteerData?.city },
    { label: 'Mailing Address', value: volunteerData?.mailingAddress },
    {
      label: 'Preferred Communication Mode',
      value: getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', volunteerData?.preferredCommunication)
    },
    { label: 'Emergency Contact Name', value: volunteerData?.emergencyContactName, textTransform: 'capitalize' },
    { label: 'Emergency Contact Number', value: volunteerData?.emergencyContactNumber },
    { label: 'Emergency Residential Address', value: volunteerData?.homeAddress },
    {
      label: 'Relation with Emergency Contact',
      value: volunteerData?.relationWithEmergencyContact,
      textTransform: 'capitalize'
    }
  ];

  const transformedData = {
    documentDetails: volunteerData?.documentDetails,
    isDpwEmployee: volunteerData?.isDpwEmployee,
    employeeId: volunteerData?.employeeId,
    department: volunteerData?.department,
    driverLicenceAvailability: volunteerData?.dlAvailability === 'true',
    carAvailability: volunteerData?.carAvailability === 'true',
    companyName: volunteerData?.companyName,
    homePhoneNumber: volunteerData?.homePhoneNumber,
    nativeLanguage: volunteerData?.nativeLanguage,
    otherLanguage: volunteerData?.otherLanguage,
    volunteeringArea: volunteerData?.volunteeringArea,
    otherVolunteeringArea: volunteerData?.otherVolunteeringArea,
    skillCertifications: volunteerData?.skillCertifications,
    volunteeringSupportDocuments: volunteerData?.volunteeringSupportDocuments,
    availability: volunteerData?.availability
  };

  const isVolunteer = volunteerData?.isVolunteer === true;

  return (
    <>
      <Box position="relative">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={3}
          spacing={3}
        >
          <Button
            variant="text"
            color="primary"
            startIcon={<BackArrow />}
            onClick={() => router.push('/admin/all-volunteers')}
            sx={{
              mb: { xs: 3 },
              '&:hover': { textDecoration: 'none' }
            }}
          >
            Back
          </Button>
        </Stack>
      </Box>
      <HeaderBreadcrumbs admin heading="Volunteer's Profile" />
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Typography variant="h6" component="h6" color="primary.main" textTransform="uppercase">
              basic details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12} md={12}>
              <ProfilePicture imageUrl={volunteerData?.photoFileUrl} isView />
            </Grid>
          </Grid>
          {profileFields.map((field) => (
            <FieldDisplay
              key={field.label}
              label={field.label}
              value={field.value}
              textTransform={field.textTransform}
            />
          ))}
          {volunteerData?.documentDetails.length > 0 && (
            <Grid item xs={12}>
              <IdentityDocuments enrollmentData={transformedData} />
            </Grid>
          )}
        </Grid>
        {isVolunteer && (
          <>
            <VolunteeringInformation userData={volunteerData} />
          </>
        )}
      </Paper>
    </>
  );
}
