import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { donorStatusColorSchema } from 'src/utils/util';

/**
 * IntentDetails component displays detailed information about the donor intent.
 * It fetches donor data from the Redux store and formats the values for display.
 *
 * @returns {JSX.Element} The component rendering the donor details.
 */
const IntentDetails = () => {
  const { financeDonationData } = useSelector((state) => state?.finance);
  const { masterData } = useSelector((state) => state?.common);

  const fCurrency = useCurrencyFormatter(financeDonationData?.donorPledgeResponse?.donationCurrency);

  return (
    <>
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          Donation Pledge
        </Typography>
        <Grid container spacing={2}>
          {/* {!isView && ( */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Status
              </Typography>
              <Typography
                variant="subtitle4"
                sx={{
                  color: (theme) =>
                    theme.palette[donorStatusColorSchema[financeDonationData?.donorPledgeResponse?.status]]?.main
                }}
              >
                {getLabelByCode(
                  masterData,
                  'dpw_foundation_donor_status',
                  financeDonationData?.donorPledgeResponse?.status
                )}
              </Typography>
            </Stack>
          </Grid>
          {/* )} */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Pledge ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {financeDonationData?.donorPledgeResponse?.donationPledgeId || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Registered As
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {financeDonationData?.donorPledgeResponse?.donorType || '-'}
              </Typography>
            </Stack>
          </Grid>
          {financeDonationData?.donorPledgeResponse?.donorType === 'Organization' && (
            <>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Organization Name
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {financeDonationData?.donorPledgeResponse?.organizationName
                      ? financeDonationData?.donorPledgeResponse?.organizationName
                      : '-'}
                  </Typography>
                </Stack>
              </Grid>
              {/* Organization Registration Number */}
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Organization Registration Number
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {financeDonationData?.donorPledgeResponse?.orgRegistrationNum
                      ? financeDonationData?.donorPledgeResponse?.orgRegistrationNum
                      : '-'}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
          {/* Donor Name */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {financeDonationData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person First Name'
                  : 'First Name'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {financeDonationData?.firstName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {financeDonationData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person Second Name'
                  : 'Second Name'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {financeDonationData?.lastName || '-'}
              </Typography>
            </Stack>
          </Grid>
          {/* Email */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {financeDonationData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person Email ID'
                  : 'Email ID'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {financeDonationData?.donorPledgeResponse?.email || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Number */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {financeDonationData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person Phone Number'
                  : 'Phone Number'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {financeDonationData?.mobile || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5} mb={1}>
              <Typography variant="body3" color="text.secondary">
                Pledge Amount (AED)
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {(financeDonationData?.donorPledgeResponse?.pledgeAmount &&
                  fCurrency(financeDonationData?.donorPledgeResponse?.pledgeAmount)) ||
                  '-'}
              </Typography>
            </Stack>
          </Grid>
          {/* National ID */}
          <Grid item xs={12} sm={12}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Intent Description (Purpose of Donation)
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {financeDonationData?.donorPledgeResponse?.intentDescription || '-'}
              </Typography>
            </Stack>
          </Grid>
          {/* Donation Amount */}
        </Grid>
      </Paper>
    </>
  );
};

export default IntentDetails;
