import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { matchIsValidTel } from 'mui-tel-input';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import CommonStyle from 'src/components/common.styles';
import { BackArrow } from 'src/components/icons';
import { onSpotDonationOBJ } from 'src/utils/onSpotUtils';
import CancelDialog from '../../campaign/cancelDialog';

export default function FormActions({
  showHiddenForm,
  isView,
  isEdit,
  isLoading,
  setOpen,
  setOpenModal,
  handleResendLink,
  isAmountConfirmed,
  setErrorPaymentOption,
  fileDetail,
  setShowUploadError,
  donorData,
  handleSubmit
}) {
  const router = useRouter();
  const { values, errors } = useFormikContext();
  const theme = useTheme();
  const styles = CommonStyle(theme);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  // Determine the submit button text
  const submitText = isView ? 'Resend Donation Link' : 'Submit';

  // Get the appropriate button type based on conditions
  const staticFields = ['campaignId', 'paymentThrough', 'documentDetails', 'paymentOption']; // Define static fields to exclude from validation

  const emptyFields = useMemo(() => {
    return Object.keys(values)
      .filter((key) => !staticFields.includes(key))
      .filter((key) => {
        const value = values[key];
        if (key === 'mobile' && !matchIsValidTel(value)) {
          return true;
        }
        return value === '' || value === null || value === undefined;
      });
  }, [values]);
  const isAnyFieldEmpty = emptyFields.length > 0;
  const getButtonType = () => {
    // Case 1: Any field except static is empty => 'submit'
    if (isAnyFieldEmpty) {
      return 'submit';
    }
    // Case 2: All fields are filled, check additional conditions
    const isConditionMet =
      values.paymentThrough === onSpotDonationOBJ.paymentLink ||
      (values.paymentThrough === onSpotDonationOBJ.onSitePayment && values.paymentOption !== 'Cash');
    // isAmountConfirmed;
    // If the condition is met => 'submit', otherwise => 'button'
    return isConditionMet ? 'submit' : 'button';
  };
  // Handle button actions based on the current view or payment method
  const handleButtonAction = () => {
    if (isView) {
      handleResendLink();
    } else if (Object.keys(errors).length > 0) {
      setOpenModal(false);
    } else if (
      !isAnyFieldEmpty &&
      (values.paymentThrough !== onSpotDonationOBJ.paymentLink ||
        (values.paymentThrough === onSpotDonationOBJ.onSitePayment && values.paymentOption !== ''))
    ) {
      setOpenModal(true);
      setErrorPaymentOption(false);
      setShowUploadError('');
    } else {
      setErrorPaymentOption(true);
      setOpenModal(false);
    }
  };
  const handleClose = () => setOpenCancelDialog(false);

  const goToDonationPage = () => router.push('/admin/on-the-spot-donation');

  return (
    <>
      <Grid item xs={4} sm={2} md={2} sx={styles.maxWidthxs}>
        <Button
          variant="text"
          startIcon={<BackArrow />}
          onClick={goToDonationPage}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Grid>

      <Grid item xs={8} sm={10} md={10} sx={styles.maxWidthxs}>
        <Stack justifyContent={{ xs: 'flex-end' }} flexDirection="row" gap={2} flexWrap="wrap">
          {!isView && showHiddenForm && (
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              sx={styles.maxWidthButton}
              onClick={() => {
                setOpenCancelDialog(true);
              }}
            >
              Cancel
            </Button>
          )}

          {(!isView && showHiddenForm) ||
          (values.paymentThrough !== 'On Site Payment' &&
            isView &&
            donorData?.status &&
            showHiddenForm &&
            donorData?.status === 'DONATION_PENDING') ? (
            <LoadingButton
              // type="button" // Always use type="button" and manually handle what to do
              loading={isLoading}
              onClick={() => {
                if (getButtonType() === 'submit') {
                  handleSubmit(); // Call formik handleSubmit passed as prop
                } else {
                  handleButtonAction();
                }
              }}
              variant="contained"
              sx={styles.maxWidthButton}
            >
              {submitText}
            </LoadingButton>
          ) : (
            ''
          )}
        </Stack>
      </Grid>
      {!isView && <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={goToDonationPage} />}
    </>
  );
}

FormActions.propTypes = {
  showHiddenForm: PropTypes.bool,
  isView: PropTypes.bool,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  handleResendLink: PropTypes.func.isRequired,
  isAmountConfirmed: PropTypes.bool.isRequired,
  setErrorPaymentOption: PropTypes.bool.isRequired,
  fileDetail: PropTypes.object,
  setShowUploadError: PropTypes.func
};
