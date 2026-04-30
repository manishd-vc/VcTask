import { Box, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { NumericFormat } from 'react-number-format';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { onSpotDonationOBJ } from 'src/utils/onSpotUtils';
export default function PledgeInformation() {
  const { values, errors, touched, getFieldProps, setFieldValue, handleBlur } = useFormikContext();

  const { masterData } = useSelector((state) => state?.common);
  const donationTypeData = getLabelObject(masterData, 'dpw_foundation_donation_type');

  const { userData } = useSelector((state) => state.userByEmail);
  const { organizationName, organizationRegistrationNumber } = userData?.organizationDetails || {};
  const { data: campaignsList } = useQuery(['getCampaign', values?.donationType], () => api.getCampaignListing(), {
    enabled: values?.donationType === onSpotDonationOBJ.eventSpecific, // Only fetch if state is selected
    refetchOnWindowFocus: false // Avoid refetching on window focus
  });
  const isIndividual = userData?.accountType === 'Individual';
  const campaignData =
    campaignsList?.data?.map((campaign) => ({
      code: campaign.campaignId,
      label: campaign.campaignTitle
    })) || [];

  const getFieldError = (touched, errors, fieldName) => {
    return Boolean(touched[fieldName] && errors[fieldName]);
  };

  const donorLabels = {
    firstName: {
      individual: 'First Name',
      organization: 'Organization Contact Person First Name'
    },
    secondName: {
      individual: 'Second Name',
      organization: 'Organization Contact Person Second Name'
    },
    phoneNumber: {
      individual: 'Enter Phone Number',
      organization: 'Enter Organization Contact Person Phone Number'
    },
    email: {
      individual: 'Email ID',
      organization: 'Organization Contact Person Email ID'
    }
  };

  const getLabel = (fieldKey) => {
    return donorLabels[fieldKey]?.[isIndividual ? 'individual' : 'organization'] || '';
  };

  return (
    <Paper sx={{ p: 3, mt: 2, mb: 5 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Donation Pledge
          </Typography>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Registered As
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {userData?.accountType || '-'}
              </Typography>
            </Stack>
          </Grid>
          {!isIndividual && (
            <>
              {organizationName ? (
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Organization Name
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {organizationName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <FieldWithSkeleton error={touched.organizationName && errors.organizationName}>
                    <TextField
                      id="organizationName"
                      variant="standard"
                      label="Enter Organization Name"
                      required
                      {...getFieldProps('organizationName')}
                      fullWidth
                      onBlur={handleBlur('organizationName')}
                      error={getFieldError(touched, errors, 'organizationName')}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}

              {organizationRegistrationNumber ? (
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <Stack direction="column" gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Organization Registration Number
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {organizationRegistrationNumber || '-'}
                    </Typography>
                  </Stack>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <FieldWithSkeleton
                    error={touched.organizationRegistrationNumber && errors.organizationRegistrationNumber}
                  >
                    <TextField
                      id="organizationRegistrationNumber"
                      variant="standard"
                      label="Enter Organization Registration Number"
                      required
                      {...getFieldProps('organizationRegistrationNumber')}
                      fullWidth
                      onBlur={handleBlur('organizationRegistrationNumber')}
                      error={getFieldError(touched, errors, 'organizationRegistrationNumber')}
                    />
                  </FieldWithSkeleton>
                </Grid>
              )}
            </>
          )}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('firstName')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {userData?.firstName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('secondName')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {userData?.lastName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('email')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {userData?.email || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getLabel('phoneNumber')}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {userData?.mobile || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subHeaderLight" component="h5" color={'text.black'} sx={{ pb: 1.5 }}>
            Donation Details
          </Typography>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={12} md={4}>
            <FieldWithSkeleton error={touched.donationType && errors.donationType}>
              <TextFieldSelect
                id="donationType"
                label="Select Donation Type"
                getFieldProps={getFieldProps}
                itemsData={donationTypeData?.values}
                value={values?.donationType}
                required
                error={getFieldError(touched, errors, 'donationType')}
              />
            </FieldWithSkeleton>
          </Grid>

          {values?.donationType === onSpotDonationOBJ.eventSpecific && (
            <Grid item xs={12} md={4}>
              <FieldWithSkeleton error={touched.campaignId && errors.campaignId}>
                <TextFieldSelect
                  id="campaignId"
                  label="Select Campaign/ Project"
                  getFieldProps={getFieldProps}
                  itemsData={campaignData}
                  value={values?.campaignId}
                  required
                  error={getFieldError(touched, errors, 'campaignId')}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          overflowY: 'auto'
                        }
                      }
                    }
                  }}
                />
              </FieldWithSkeleton>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <FieldWithSkeleton error={touched.intentDescription && errors.intentDescription}>
            <TextField
              id="intentDescription"
              variant="standard"
              label="Intent Description (Purpose of Donation)"
              inputProps={{ maxLength: 256 }}
              required
              fullWidth
              {...getFieldProps('intentDescription')}
              error={getFieldError(touched, errors, 'intentDescription')}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} md={4}>
          <FieldWithSkeleton error={touched.donationAmount && errors.donationAmount}>
            <NumericFormat
              label={
                <>
                  Pledge Amount (AED){' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              error={touched.donationAmount && Boolean(errors.donationAmount)}
              onValueChange={({ floatValue }) => {
                setFieldValue('donationAmount', floatValue ?? '');
              }}
              value={values?.donationAmount}
              customInput={TextField}
              thousandSeparator
              variant="standard"
              valueIsNumericString
              fullWidth
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </Paper>
  );
}
