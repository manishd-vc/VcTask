import { Checkbox, FormControlLabel, FormGroup, Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getMatchingString } from 'src/utils/onSpotUtils';

/**
 * Step2Form component renders the second step of the form, which collects banking details.
 * It also includes logic to display a modal for adding and editing questions, and handles form validation.
 *
 * @returns {JSX.Element} The form for banking details with dynamic question handling.
 */
const Step2Form = () => {
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const { masterData } = useSelector((state) => state?.common);

  const {
    donorPledgeResponse: {
      donationAmount,
      pledgeAmount,
      donationCurrency,
      donationMethod,
      userPaymentChannel,
      eventTitle,
      createdOn,
      donationType,
      campaignNumericId
    } = {},
    specialInstructions,
    isActivityUpdateRequired,
    isTaxReceiptRequired,
    isConsentProvided
  } = getDonorAdminData || {};

  const transactionTypeData = getLabelObject(masterData, 'dpw_foundation_donation_type');
  const transactionType = getMatchingString(transactionTypeData?.values, donationType, 'code');
  const fCurrency = useCurrencyFormatter('AED');
  
  let formattedDonationValue = '0.00';
  if (pledgeAmount) {
    formattedDonationValue = fCurrency(pledgeAmount);
  } else if (donationAmount) {
    formattedDonationValue = fCurrency(donationAmount);
  }
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ mb: 3 }} component={'h3'}>
        Transaction Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Intend Donation Value
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {formattedDonationValue}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Currency
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_currency', donationCurrency) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Donation Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_donation_donation_method', donationMethod) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
              {getLabelByCode(masterData, 'dpw_foundation_donation_payment_method', userPaymentChannel) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Transaction Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {transactionType || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign ID/Reference
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignNumericId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Title
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {eventTitle || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Intent Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(createdOn && fDateWithLocale(createdOn)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Special Instructions
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {specialInstructions || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Acknowledgment Preferences
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {isActivityUpdateRequired
                ? 'Yes, I/we would like to be publicly acknowledged'
                : 'No, I/we prefer to remain anonymous' || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Tax Receipt
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {isTaxReceiptRequired ? 'Yes, please send a tax receipt' : 'No, a tax receipt is not necessary' || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary" mb={2}>
              Disclaimer
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={isConsentProvided || false} />}
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

export default Step2Form;
