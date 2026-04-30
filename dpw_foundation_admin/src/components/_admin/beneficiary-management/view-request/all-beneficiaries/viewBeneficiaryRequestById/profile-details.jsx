'use client';
import { Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ProfilePicture from 'src/components/_admin/users/profilePicture';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle4"
        color="text.secondarydark"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function ProfileDetails({ beneficiaryData }) {
  const {
    accountType,
    email,
    firstName,
    lastName,
    mobile,
    salutation,
    dob,
    maritalStatus,
    gender,
    countryName,
    stateName,
    city,
    mailingAddress,
    preferredCommunication,
    emergencyContactName,
    emergencyContactNumber,
    homeAddress,
    relationWithEmergencyContact,
    photoFileUrl
  } = beneficiaryData || {};
  const { masterData } = useSelector((state) => state?.common);

  const fields = [
    { label: 'Registered As', value: accountType },
    { label: 'Email ID', value: email },
    { label: 'First Name', value: firstName, textTransform: 'capitalize' },
    { label: 'Second Name', value: lastName, textTransform: 'capitalize' },
    { label: 'Phone Number', value: mobile },
    {
      label: 'Salutation',
      value: getLabelByCode(masterData, 'dpw_foundation_user_salutation', salutation) || '-'
    },
    { label: 'Date of Birth', value: dob ? fDateWithLocale(dob) : '-' },
    {
      label: 'Marital Status',
      value: getLabelByCode(masterData, 'dpw_foundation_user_marital_status', maritalStatus) || '-'
    },
    {
      label: 'Gender',
      value: getLabelByCode(masterData, 'dpw_foundation_user_gender', gender) || '-'
    },
    {
      label: 'Country',
      value: countryName
    },
    {
      label: 'State/Province',
      value: stateName
    },
    { label: 'City', value: city },
    { label: 'Mailing Address', value: mailingAddress },
    {
      label: 'Preferred Communication Mode',
      value: getLabelByCode(masterData, 'dpw_foundation_user_prefer_comm', preferredCommunication) || '-'
    },
    { label: 'Emergency Contact Name', value: emergencyContactName, textTransform: 'capitalize' },
    { label: 'Emergency Contact Number', value: emergencyContactNumber },
    { label: 'Emergency Residential Address', value: homeAddress },
    { label: 'Relation with Emergency Contact', value: relationWithEmergencyContact, textTransform: 'capitalize' }
  ];

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12} md={12} mb={2}>
          <ProfilePicture imageUrl={photoFileUrl} isView />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {fields?.map((field, index) => (
          <FieldDisplay
            key={`${field.label}-${field.value}`}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            color={field?.color}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>
    </>
  );
}
