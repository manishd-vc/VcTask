// Importing required components from Material UI library for layout and typography
import { Checkbox, FormControlLabel, FormGroup, Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

// Define Step2View component which receives 'data' as a prop
const Step2View = ({ data }) => {
  const { masterData } = useSelector((state) => state?.common);

  const fCurrency = useCurrencyFormatter('AED');
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        transaction Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Donation Value Being Pledged
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.assessment?.donorPledgeResponse?.donationAmount
                ? fCurrency(data?.assessment?.donorPledgeResponse?.donationAmount)
                : '0.00'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Currency
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.assessment?.donorPledgeResponse?.donationCurrency}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Donation Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_donation_donation_method', data?.donationMethod) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
              {getLabelByCode(masterData, 'dpw_foundation_donation_payment_method', data?.userPaymentChannel) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Transaction Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_donation_type', data?.donationType) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign ID/Reference
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.campaignNumericId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Title
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.eventTitle || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Intent Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.createdOn ? fDateWithLocale(data?.createdOn) : '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Special Instructions
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.assessment?.specialInstructions || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Acknowledgment Preferences
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.assessment?.acknowledgementPreference
                ? 'Yes, I/we would like to be publicly acknowledged'
                : 'No, I/we prefer to remain anonymous' || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Tax Receipt
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.assessment?.isTaxReceiptRequired
                ? 'Yes, please send a tax receipt'
                : 'No, a tax receipt is not necessary' || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Disclaimer
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={data?.assessment?.isConsentProvided || false} />}
                disabled
                label={
                  <Typography variant="body2" color="text.secondarydark">
                    I hereby confirm that the above information is accurate and consent to its use for the purposes of
                    managing the donation and fulfilling any legal and regulatory requirements.
                  </Typography>
                }
              />
            </FormGroup>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

Step2View.propTypes = {
  data: PropTypes.shape({
    donorPledgeResponse: PropTypes.shape({
      donationAmount: PropTypes.number,
      donationCurrency: PropTypes.string
    }),
    donationType: PropTypes.string,
    isTaxReceiptRequired: PropTypes.bool,
    isActivityUpdateRequired: PropTypes.bool,
    isConsentProvided: PropTypes.bool,
    userPaymentChannel: PropTypes.string
  }).isRequired
};
// Export the Step2View component to be used elsewhere in the application
export default Step2View;
