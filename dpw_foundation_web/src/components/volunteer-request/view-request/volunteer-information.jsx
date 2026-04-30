import { Checkbox, FormControlLabel, Grid, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import SkillCertificationsTable from 'src/components/tables/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/tables/VolunteeringSupportDocumentsTable';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import IdentityDocuments from './IdentityDocuments';
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

export default function VolunteerInformation({ data, enrollmentData }) {
  const { masterData } = useSelector((state) => state?.common);

  const currentCountryOfResidence = data?.currentCountryOfResidence;

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const languages = getLabelObject(masterData, 'dpwf_language');
  const userVolunteering = getLabelObject(masterData, 'dpw_foundation_user_volunteering');

  const getLanguageLabel = (code) => {
    return languages?.values?.find((lang) => lang.code === code)?.label || code;
  };

  const getVolunteeringAreaLabel = (code) => {
    return userVolunteering?.values?.find((area) => area.code === code)?.label || code;
  };
  const { data: projectStateData } = useQuery(
    ['getStates', currentCountryOfResidence],
    () => api.getStates(currentCountryOfResidence),
    {
      enabled: !!currentCountryOfResidence,
      refetchOnWindowFocus: false
    }
  );

  const {
    accountType,
    email,
    firstName,
    lastName,
    phoneNumber,
    salutation,
    dateOfBirth,
    maritalStatus,
    gender,
    state,
    city,
    mailingAddress,
    emergencyContactNumber,
    emergencyContactName,
    homeAddress,
    relationWithEmergencyContact,
    documentDetails,
    isDpwEmployee,
    employeeId,
    companyName,
    department,
    driverLicenceAvailability,
    carAvailability,
    homePhoneNumber,
    skillCertifications,
    volunteeringSupportDocuments
  } = data || {};

  const countryLabel = country?.find((item) => item?.code === currentCountryOfResidence)?.label;
  const stateLabel = projectStateData?.find((item) => item?.code === state)?.label;

  const profileDetails = [
    { label: 'Registered As', value: accountType, textTransform: 'capitalize' },
    { label: 'Email ID', value: email },
    { label: 'First Name', value: firstName, textTransform: 'capitalize' },
    { label: 'Second Name', value: lastName, textTransform: 'capitalize' },
    { label: 'Phone Number', value: phoneNumber },
    {
      label: 'Salutation',
      value: getLabelByCode(masterData, 'dpw_foundation_user_salutation', salutation) || salutation,
      textTransform: 'capitalize'
    },
    { label: 'Date of Birth', value: dateOfBirth ? fDateWithLocale(dateOfBirth) : '-' },
    {
      label: 'Marital Status',
      value: getLabelByCode(masterData, 'dpw_foundation_user_marital_status', maritalStatus) || maritalStatus,
      textTransform: 'capitalize'
    },
    {
      label: 'Gender',
      value: getLabelByCode(masterData, 'dpw_foundation_user_gender', gender) || gender,
      textTransform: 'capitalize'
    },
    { label: 'Country', value: countryLabel || currentCountryOfResidence },
    { label: 'State/Province', value: stateLabel || state },
    { label: 'City', value: city },
    { label: 'Mailing Address', value: mailingAddress },
    {
      label: 'Preferred Communication Mode',
      value: getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', data?.preferredCommunication)
    },
    { label: 'Emergency Contact Name', value: emergencyContactName },
    { label: 'Emergency Contact Number', value: emergencyContactNumber },
    { label: 'Emergency Residential Address', value: homeAddress },
    { label: 'Relation with Emergency Contact', value: relationWithEmergencyContact }
  ];

  const volunteeringInfo = [
    { label: 'Is DPW Group Employee?', value: isDpwEmployee ? 'Yes' : 'No', gridProps: { xs: 12 } },
    { label: 'Employee ID', value: employeeId },
    { label: 'Company', value: companyName },
    { label: 'Department', value: department },
    { label: 'Have Driver License', value: driverLicenceAvailability ? 'Yes' : 'No' },
    { label: 'Has Own Car', value: carAvailability ? 'Yes' : 'No' },
    { label: 'Home Phone', value: homePhoneNumber },
    { label: 'Native Language', value: data?.nativeLanguage ? getLanguageLabel(data.nativeLanguage) : '-' },
    {
      label: 'Other Language Proficiency',
      value: Array.isArray(data?.otherLanguage)
        ? data?.otherLanguage.map((lang) => getLanguageLabel(lang.code)).join(', ')
        : '-'
    },
    {
      label: 'Volunteering areas of interest',
      value: data?.volunteeringArea?.map((area) => getVolunteeringAreaLabel(area.code)).join(', ') || '-'
    },
    {
      label: 'Add area of interest',
      value: data?.otherVolunteeringArea || '-'
    }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform={'uppercase'}>
            Volunteer Information Form
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Profile Details
          </Typography>
        </Grid>
        {profileDetails?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}

        <Grid item xs={12}>
          <IdentityDocuments enrollmentData={{ documentDetails }} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Volunteering Information
          </Typography>
        </Grid>
        {volunteeringInfo?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}

        <Grid item xs={12}>
          <Typography
            component="h4"
            variant="subtitle6"
            color="primary.main"
            sx={{ mb: 2 }}
            textTransform={'uppercase'}
          >
            Skill Certifications
          </Typography>
          <SkillCertificationsTable
            data={skillCertifications}
            isEditable={false}
            showHeader={false}
            showPaper={false}
            maxHeight={440}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            component="h4"
            variant="subtitle6"
            color="primary.main"
            sx={{ mb: 2 }}
            textTransform={'uppercase'}
          >
            Volunteering Supporting Documents
          </Typography>
          <VolunteeringSupportDocumentsTable
            data={volunteeringSupportDocuments}
            isEditable={false}
            showHeader={false}
            showPaper={false}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox name="volunteerReleaseAccepted" checked={data?.volunteerReleaseAccepted || false} disabled />
            }
            label={<span>Volunteer Release and Undertaking</span>}
          />
        </Grid>

        {/* <AvailabilitySection availability={enrollmentData?.availability || []} /> */}
      </Grid>
    </Paper>
  );
}
