import { Box, Grid, Link, Paper, Stack, Typography, useTheme } from '@mui/material';

import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
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

export default function GrantSeekerInformation() {
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const { masterData } = useSelector((state) => state?.common);
  const theme = useTheme();
  const styles = {
    ...CommonStyle(theme)
  };
  const {
    accountType,
    email,
    firstName,
    lastName,
    mobile,
    countryName,
    stateName,
    city,
    mailingAddress,
    documentDetails,
    bankBeneficiaryName,
    bankName,
    bankAccount,
    bankIban,
    bankSwiftCode,
    organizationDetails
  } = grantRequestData || {};

  const isIndividual = accountType === 'Individual';

  const profileDetails = [
    { label: 'Registered As', value: accountType },
    { label: isIndividual ? 'Email ID' : 'Organization Contact Person Email ID', value: email },
    {
      label: isIndividual ? 'First Name' : 'Organization Contact Person First Name',
      value: firstName,
      textTransform: 'capitalize'
    },
    {
      label: isIndividual ? 'Second Name' : 'Organization Contact Person Second Name',
      value: lastName,
      textTransform: 'capitalize'
    },
    { label: isIndividual ? 'Phone Number' : 'Organization Contact Person Phone Number', value: mobile },
    ...(!isIndividual
      ? [
          { label: 'Organization Name', value: organizationDetails?.organizationName },
          { label: 'Organization Registration Number', value: organizationDetails?.organizationRegistrationNumber }
        ]
      : []),
    { label: isIndividual ? 'Country' : 'Organization Country Where Registered', value: countryName },
    { label: isIndividual ? 'State/Province' : 'Organization State Where Registered', value: stateName },
    { label: isIndividual ? 'City' : 'Organization City Where Registered', value: city },
    { label: 'Mailing Address', value: mailingAddress }
  ];

  const bankDetails = [
    { label: 'Beneficiary Name', value: bankBeneficiaryName },
    { label: 'Bank Name', value: bankName },
    { label: 'Account Number', value: bankAccount },
    { label: 'IBAN', value: bankIban },
    { label: 'SWIFT Code', value: bankSwiftCode }
  ];

  const renderDocumentFields = (doc) => {
    const { documentType, documentNumber, documentValidity, fileName, preSignedUrl } = doc || {};

    const fields = [
      {
        label: 'Identity Document Type',
        value: documentType ? getLabelByCode(masterData, 'dpw_foundation_user_identity', documentType) : '-'
      },
      { label: 'Document Number', value: documentNumber || '-' },
      { label: 'Document Validity', value: documentValidity ? fDateWithLocale(documentValidity) : '-' }
    ];

    return (
      <Box key={doc?.id} sx={styles.documentCard}>
        <Grid container spacing={2}>
          {fields?.map((field) => (
            <FieldDisplay
              key={field?.label}
              label={field?.label}
              value={field?.value}
              gridProps={{ xs: 12, sm: 6, md: 4 }}
            />
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Document Attachment
              </Typography>
              {preSignedUrl ? (
                <Link
                  href={preSignedUrl || ''}
                  variant="body2"
                  underline="hover"
                  sx={{
                    '&&': {
                      color: 'black',
                      fontWeight: 400
                    }
                  }}
                >
                  {fileName || '-'}
                </Link>
              ) : (
                <Typography variant="subtitle4" color="text.secondarydark">
                  {fileName || '-'}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Grant Seeker Information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            profile details
          </Typography>
        </Grid>
        {profileDetails?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
          />
        ))}
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Identity Documents Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {documentDetails?.length > 0 ? (
            <Stack spacing={2}>{documentDetails?.map((doc) => renderDocumentFields(doc))}</Stack>
          ) : (
            <Box sx={{ bgcolor: 'backgrounds.light', p: 4, width: '100%' }}>
              <Typography color="secondary.darker">No Identity Documents Details</Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Banking information
          </Typography>
        </Grid>
        {bankDetails?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
          />
        ))}
      </Grid>
    </Paper>
  );
}
