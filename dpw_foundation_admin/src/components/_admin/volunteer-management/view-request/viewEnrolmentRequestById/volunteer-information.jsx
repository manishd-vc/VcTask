'use client';
import { Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelsFromCodes } from 'src/utils/getLabelsFromCodes';
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

export default function VolunteeringInformation({ enrollmentData }) {
  const {
    isDpwEmployee,
    employeeId,
    department,
    driverLicenceAvailability,
    carAvailability,
    companyName,
    homePhoneNumber,
    nativeLanguage,
    otherLanguage,
    volunteeringArea,
    otherVolunteeringArea
  } = enrollmentData || {};
  const { masterData } = useSelector((state) => state?.common);

  const fields = [
    { label: 'Is DPW Group Employee?', value: isDpwEmployee ? 'Yes' : 'No', gridProps: { xs: 12 } },

    { label: 'Employee ID', value: employeeId },
    { label: 'Company', value: companyName },
    { label: 'Department', value: department },
    { label: 'Have Driver License', value: driverLicenceAvailability ? 'Yes' : 'No' },
    { label: 'Has Own Car', value: carAvailability ? 'Yes' : 'No' },
    { label: 'Home Phone', value: homePhoneNumber },
    {
      label: 'Native Language',
      value: getLabelByCode(masterData, 'dpwf_language', nativeLanguage) || '-'
    },
    {
      label: 'Other Language Proficiency',
      value: getLabelsFromCodes(otherLanguage, 'dpwf_language', masterData)
    },
    {
      label: 'Volunteering areas of Interest',
      value: Array.isArray(volunteeringArea)
        ? volunteeringArea
            .map((area) => getLabelByCode(masterData, 'dpw_foundation_user_volunteering', area.code))
            .join(', ')
        : '-'
    },
    {
      label: 'Add Area of Interest',
      value: otherVolunteeringArea
    }
  ];

  return (
    <Grid container spacing={3} pt={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Volunteering Information
        </Typography>
      </Grid>
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
  );
}
