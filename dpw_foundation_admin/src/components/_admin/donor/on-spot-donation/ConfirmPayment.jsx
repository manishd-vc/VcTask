import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import { toWords } from 'number-to-words';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import { fNumber, isValidNumber, removeCommaSeparator } from 'src/utils/formatNumber';
import { onSpotDonationOBJ } from 'src/utils/onSpotUtils';

const ConfirmPayment = ({ open, onClose, isAmountConfirmed, setIsAmountConfirmed, handleSubmit, setOpenModal }) => {
  const { values, touched, errors, setFieldValue } = useFormikContext();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (!values.donationAmount) {
      setOpenModal(true);
      return;
    }
    if (!isAmountConfirmed) {
      setError(true);
      return;
    }
    if (values.paymentThrough === onSpotDonationOBJ.onSitePayment && !values.paymentOption) {
      setOpenModal(false);
      return;
    }
    setError(false);
    onClose();
    setIsAmountConfirmed(false);
    handleSubmit();
  };

  const handleCheckboxChange = () => {
    setError(false);
    setIsAmountConfirmed(!isAmountConfirmed);
  };

  const handleClose = () => {
    setError(false);
    setIsAmountConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle sx={{ textTransform: 'uppercase' }} color="primary.main">
        Confirm Payment
      </DialogTitle>
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <FieldWithSkeleton error={touched.donationAmount && errors.donationAmount}>
          <NumericFormat
            label={<>Donation Amount Pledged</>}
            value={values.donationAmount}
            onValueChange={(values) => {
              const { value } = values; // Raw numeric value without formatting
              if (value.length <= 16) {
                setFieldValue('donationAmount', value); // Update only if within limit
                setIsAmountConfirmed(false);
              }
            }}
            customInput={TextField}
            thousandSeparator
            variant="standard"
            fullWidth
            inputProps={{
              maxLength: 16 // Set max length for the raw input
            }}
          />
        </FieldWithSkeleton>
        <FormControlLabel
          sx={{ mt: 2 }}
          control={
            <Checkbox checked={isAmountConfirmed} onChange={handleCheckboxChange} disabled={!values.donationAmount} />
          }
          label={
            <>
              Please confirm that the donor wants to make a cash donation of{' '}
              {values.donationAmount && isValidNumber(values.donationAmount) ? (
                <Typography variant="subtitle4" color="text.secondarydark">
                  {values.currency} {fNumber(values.donationAmount)} &nbsp;(
                  {toWords(removeCommaSeparator(values.donationAmount))})
                </Typography>
              ) : (
                ''
              )}
            </>
          }
        />
        {error && (
          <Typography variant="body2" color="error">
            Please confirm the donation to proceed.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmPayment.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAmountConfirmed: PropTypes.bool.isRequired,
  setIsAmountConfirmed: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setOpenModal: PropTypes.func.isRequired
};

export default ConfirmPayment;
