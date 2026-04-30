'use client';

import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
// mui
// api
// icons
import { CloseIcon, NextWhiteArrow } from 'src/components/icons';
// Import Yup for schema validation
import * as Yup from 'yup';

import ModalStyle from 'src/components/dialog/dialog.style';
// components
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';

export default function MakeDonationMain({ token }) {
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme); // Apply the modal-specific styles based on the theme
  const dispatch = useDispatch(); // Access Redux dispatch to show toast messages
  const DonationSchema = Yup.object().shape({
    disclaimerAccepted: Yup.boolean().required('Required')
  });
  const [openDisclaimerPopup, setOpenDisclaimerPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const formik = useFormik({
    initialValues: {
      disclaimerAccepted: false
    },
    validationSchema: DonationSchema,
    onSubmit: () => {}
  });
  const { setFieldValue, values } = formik;
  const { mutate: mutateDonate } = useMutation('donation', api.donateNow, {
    onSuccess: (data) => {
      if (data?.data?.paymentFinalUrl) {
        window.location.href = data?.data?.paymentFinalUrl; // open in the same tab
      }
    },

    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: mutateToken } = useMutation('validateToken', api.validateTokenPayment, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      setFieldValue('disclaimerAccepted', true);
      setOpenDisclaimerPopup(false);
      setIsDisabled(true); // Disable the checkbox after successful token validation
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      setFieldValue('disclaimerAccepted', false); // Reset the checkbox if token validation fails
      setOpenDisclaimerPopup(false);
    }
  });

  const handleAccept = () => {
    mutateToken({ token: token });
  };

  return (
    <>
      <Dialog open={openDisclaimerPopup} maxWidth="md">
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Terms & Conditions
        </DialogTitle>
        <IconButton
          sx={style.closeModal} // Apply custom style for the close button
          onClick={() => {
            setOpenDisclaimerPopup(false); // Close the disclaimer popup
            setFieldValue('disclaimerAccepted', false); // Keep unchecked if user closes
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <Typography variant="body1" color="text.secondarydark" component="p">
            By making a donation through the DP World Foundation platform, you acknowledge and agree to the following:
          </Typography>
          <Typography component="ul" my={2} pl={3} color={'text.secondarydark'}>
            <Typography component="li">
              All donations are voluntary and{' '}
              <Typography component="span" variant="subtitle4">
                non-refundable unless stated otherwise under specific campaign terms.
              </Typography>
            </Typography>
            <Typography component="li" variant="subtitle4">
              Your contribution will be allocated to the selected program or, if unspecified, to areas of highest need
              across our focus sectors (Health, Education, and Food).
            </Typography>
            <Typography component="li">
              The Foundation ensures that all funds are used transparently and in alignment with its humanitarian
              mission.
            </Typography>
            <Typography component="li" variant="subtitle4">
              Your payment details will be processed securely and will not be stored by the Foundation.
            </Typography>
            <Typography component="li" variant="subtitle4">
              You will receive an email confirmation and impact report related to your donation.
            </Typography>
          </Typography>
          <Typography variant="body1" color="text.secondarydark" component="p">
            We value your trust and are committed to ensuring that your generosity creates a lasting, measurable impact.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleAccept} variant="contained">
            I AGREE
          </Button>
        </DialogActions>
      </Dialog>
      <Stack>
        <Typography textAlign="center" variant="h5" color={'primary.main'} sx={AuthThemeStyles.authTitle}>
          Make a donation
        </Typography>
      </Stack>
      <FormikProvider value={formik}>
        <FormControlLabel
          control={
            <Checkbox
              name="disclaimerAccepted"
              onChange={(e) => {
                setFieldValue('disclaimerAccepted', e.target.checked); // Update the state based on checkbox value
                setOpenDisclaimerPopup(true); // Open the disclaimer popup when checkbox is checked
              }}
              checked={values.disclaimerAccepted} // Bind the checkbox to the form state
              disabled={isDisabled} // Disable if token is present
            />
          }
          label={
            <span>
              I have read and agreed to the{' '}
              <span
                style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => setFieldValue('disclaimerAccepted', true)} // Optional: make it clickable to open terms
              >
                Terms & Conditions
              </span>
            </span>
          }
        />
        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
          <LoadingButton
            disabled={!values.disclaimerAccepted}
            size="large"
            type="submit"
            variant="contained"
            onClick={() =>
              mutateDonate({
                token: token,
                state: 'EMAIL',
                platform: 'WEB',
                description: ''
              })
            }
            endIcon={<NextWhiteArrow />}
            sx={{ textAlign: 'center' }}
          >
            Donate Now
          </LoadingButton>
        </Stack>
      </FormikProvider>
    </>
  );
}
