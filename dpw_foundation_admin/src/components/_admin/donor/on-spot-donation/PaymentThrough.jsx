import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { onSpotDonationOBJ, RADIO_ONSITE_OPTIONS, RADIO_OPTIONS } from 'src/utils/onSpotUtils';
export default function PaymentThrough({ isEdit, errorPaymentOption, setErrorPaymentOption }) {
  const { errors, touched, setFieldValue, values } = useFormikContext();

  const handleChange = (event) => {
    if (event.target.value === onSpotDonationOBJ.paymentLink) {
      setFieldValue('paymentOption', '');
    }
    setErrorPaymentOption(false);
    setFieldValue('paymentThrough', event.target.value);
  };

  const handlePaymentOptionChange = (event) => {
    setFieldValue('paymentOption', event.target.value);
    setErrorPaymentOption(false);
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="body3" component="p" color="text.secondary">
          Payment through
        </Typography>
        <FormControl component="fieldset" sx={{ mt: 1 }}>
          <RadioGroup
            aria-label="paymentThrough"
            name="paymentThrough"
            value={values?.paymentThrough}
            onChange={handleChange}
          >
            {RADIO_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{ mr: 3 }}
                disabled={isEdit}
              />
            ))}
          </RadioGroup>
          {touched?.paymentThrough && errors?.paymentThrough && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.paymentThrough}
            </Typography>
          )}
        </FormControl>
      </Grid>
      {values?.paymentThrough === onSpotDonationOBJ.onSitePayment ? (
        <Grid item xs={12}>
          <Typography variant="body3" component="p" color="text.secondary">
            Payment Option
          </Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              aria-label="paymentOption"
              name="paymentOption"
              value={values?.paymentOption}
              onChange={handlePaymentOptionChange}
            >
              {RADIO_ONSITE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ mr: 3 }}
                  disabled={isEdit}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {values.paymentThrough === onSpotDonationOBJ.onSitePayment && errorPaymentOption && (
            <Typography variant="body2" color="error">
              Please select payment option
            </Typography>
          )}
        </Grid>
      ) : (
        ''
      )}
    </>
  );
}

PaymentThrough.propTypes = {
  isEdit: PropTypes.boolean,
  errorPaymentOption: PropTypes.bool,
  setErrorPaymentOption: PropTypes.bool
};
