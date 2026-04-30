// Importing required components from Material UI library for layout and typography
import { Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

// Define DonationInfoNext component which receives 'data' as a prop
const DonationInfoNext = ({ data }) => {
  const fCurrency = useCurrencyFormatter(data?.donorPledgeResponse?.donationCurrency);
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Donation Form
      </Typography>
      {/* Grid component used to structure each field of the donation form in a responsive layout */}
      <Grid container spacing={3}>
        {/* For each field of the form, a Grid item is used for layout */}
        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body3" color="text.secondary"></Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.donorPledgeResponse?.donationAmount ? fCurrency(data?.donorPledgeResponse?.donationAmount) : '-'}
            </Typography>
          </Stack>
        </Grid>

        {/* Repeat similar structure for Currency, Donation Type, Receipt, Activity Update, and Disclaimer */}
        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Currency
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.donorPledgeResponse?.donationCurrency ? data?.donorPledgeResponse?.donationCurrency : '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Type of donation being pledged
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.donationType ? data?.donationType : '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Receipt
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.isTaxReceiptRequired ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Would you like to receive activity update
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.isActivityUpdateRequired ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Disclaimer
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.isConsentProvided ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

DonationInfoNext.propTypes = {
  data: PropTypes.shape({
    donorPledgeResponse: PropTypes.shape({
      donationAmount: PropTypes.number,
      donationCurrency: PropTypes.string
    }),
    donationType: PropTypes.string,
    isTaxReceiptRequired: PropTypes.bool,
    isActivityUpdateRequired: PropTypes.bool,
    isConsentProvided: PropTypes.bool
  }).isRequired
};
// Export the DonationInfoNext component to be used elsewhere in the application
export default DonationInfoNext;
