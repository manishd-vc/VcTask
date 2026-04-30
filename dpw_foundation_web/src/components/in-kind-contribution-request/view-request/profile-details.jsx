import { Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';

const FieldDisplay = ({ label, value, textTransform }) => (
  <Grid item xs={12} sm={6}>
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

export default function ProfileDetails() {
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  const { masterData } = useSelector((state) => state?.common);

  const { registeredAs, email, firstName, lastName, mobile, countryName, stateName, city, mailingAddress } =
    inKindContributionRequestData || {};

  const profileFields = [
    {
      label: 'Registered As',
      value: registeredAs ? getLabelByCode(masterData, 'dpw_foundation_campaign_register_as', registeredAs) : '-'
    },
    { label: 'Email ID', value: email },
    { label: 'First Name', value: firstName, textTransform: 'capitalize' },
    { label: 'Second Name', value: lastName, textTransform: 'capitalize' },
    { label: 'Phone Number', value: mobile },
    { label: 'Country', value: countryName },
    { label: 'State/Province', value: stateName },
    { label: 'City', value: city },
    { label: 'Mailing Address', value: mailingAddress }
  ];

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Profile Details
        </Typography>
      </Grid>
      {profileFields?.map((field) => (
        <FieldDisplay
          key={field?.label}
          label={field?.label}
          value={field?.value}
          textTransform={field?.textTransform}
        />
      ))}
    </>
  );
}
