'use client';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { gtmEvents } from 'src/lib/gtmEvents';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as Yup from 'yup';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
MakePldege.propTypes = {
  campaignId: PropTypes.string.isRequired, // Ensure campaignId is a string
  handleClose: PropTypes.func.isRequired, // handleClose should be a function
  open: PropTypes.bool.isRequired // open should be a boolean
};

export default function MakePldege({ campaignId, handleClose, open }) {
  const router = useRouter();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const isLoading = false;
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [formInteracted, setFormInteracted] = React.useState(false);
  const { profileData } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.user);
  const handleFormInteraction = () => {
    if (!formInteracted) {
      gtmEvents.formInitiate({ formName: 'Donation Pledge Form' });
      setFormInteracted(true);
    }
  };
  const { mutate } = useMutation(api.makePledge, {
    onSuccess: async (response) => {
      const userRoles = Array.isArray(user?.roles) ? user.roles.join(', ') : '';
      gtmEvents.pledgeSubmitted({
        formName: 'Donation Pledge Form',
        donationType: response?.data?.donationType || '',
        donationPledgeId: response?.data?.donationPledgeId || '',
        pledgeAmount: response?.data?.pledgeAmount || '',
        donationAmount: response?.data?.donationAmount || '', //  include donateAmount if needed
        donationCurrency: response?.data?.donationCurrency || '',
        pledgeStatus: response?.data?.status || 'Awaiting Pledge Approval',
        userId: user?.userId || '',
        userRole: userRoles
      });
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      setLoading(false);
      close();
      router.push(`/user/my-donations`);
    },
    onError: async (err) => {
      const errorMsg = err?.response?.data?.message || 'Something went wrong';

      // GTM Event: Form Error
      gtmEvents.formError({
        formName: 'Donation Pledge Form',
        errorMessage: errorMsg
      });
      dispatch(setToastMessage({ message: errorMsg, variant: 'error' }));
      setLoading(false);
    }
  });

  function removeComma(amount) {
    return amount.replace(/,/g, '');
  }

  const getValidationSchema = (type) => {
    return Yup.object({
      intentDescription: Yup.string().required('Intent Description is required'),
      donationAmount: Yup.string().required('Donation amount is required'),
      ...(type !== 'Individual' && {
        organizationName: Yup.string().required('Organization Name is required'),
        orgRegistrationNum: Yup.string().required('Org Registration Number is required')
      })
    });
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      campaignId: campaignId,
      intentDescription: '',
      donationAmount: '',
      organizationName: user?.organizationName || '',
      orgRegistrationNum: user?.organizationRegistrationNumber || ''
    },
    validationSchema: getValidationSchema(user?.type),

    onSubmit: async (values) => {
      let data = {
        ...values,
        campaignId: campaignId
      };
      data.donationAmount = Number(removeComma(data.donationAmount));
      await mutate(data);
    }
    // }
  });
  const { errors, touched, resetForm, handleSubmit, getFieldProps } = formik;
  const close = () => {
    resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Donation Pledge
      </DialogTitle>
      <IconButton aria-label="close" onClick={close} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <FormikProvider value={formik}>
        <Form noValidate onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <Typography variant="body1" color="text.secondarydark" mb={4}>
              Join Us in Making a Difference
            </Typography>
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body3" color="text.secondary">
                  Registered As
                </Typography>
                <Typography component="p" variant="subtitle4" color="text.secondarydark">
                  {user?.type}
                </Typography>
              </Grid>

              {user?.type !== 'Individual' && (
                <>
                  <Grid item xs={12} sm={3}>
                    {user?.organizationName ? (
                      <>
                        <Typography variant="body3" color="text.secondary">
                          Organization Name
                        </Typography>
                        <Typography component="p" variant="subtitle4" color="text.secondarydark">
                          {user?.organizationName}
                        </Typography>
                      </>
                    ) : (
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        label="Organization Name *"
                        error={touched.organizationName && errors.organizationName}
                      >
                        <TextField
                          id="organizationName"
                          label={
                            <>
                              Organization Name
                              <Box component="span" sx={{ color: 'error.main' }}>
                                &nbsp;*
                              </Box>
                            </>
                          }
                          {...getFieldProps('organizationName')}
                          error={touched.organizationName && Boolean(errors.organizationName)}
                          fullWidth
                          variant="standard"
                          onFocus={handleFormInteraction}
                        />
                      </FieldWithSkeleton>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {user?.organizationRegistrationNumber ? (
                      <>
                        <Typography variant="body3" color="text.secondary">
                          Organization Registration Number
                        </Typography>
                        <Typography component="p" variant="subtitle4" color="text.secondarydark">
                          {user?.organizationRegistrationNumber}
                        </Typography>
                      </>
                    ) : (
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        label="Organization Registration Number"
                        error={touched.orgRegistrationNum && errors.orgRegistrationNum}
                      >
                        <TextField
                          id="orgRegistrationNum"
                          label={
                            <>
                              Organization Registration Number
                              <Box component="span" sx={{ color: 'error.main' }}>
                                &nbsp;*
                              </Box>
                            </>
                          }
                          {...getFieldProps('orgRegistrationNum')}
                          error={touched.orgRegistrationNum && Boolean(errors.orgRegistrationNum)}
                          fullWidth
                          variant="standard"
                          onFocus={handleFormInteraction}
                        />
                      </FieldWithSkeleton>
                    )}
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={3}>
                <Typography variant="body3" color="text.secondary">
                  {user?.type !== 'Individual' ? 'Organization Contact Person First Name' : 'First Name'}
                </Typography>
                <Typography component="p" variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                  {`${user?.firstName || ''}` || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body3" color="text.secondary">
                  {user?.type !== 'Individual' ? 'Organization Contact Person Second Name' : 'Second Name'}
                </Typography>
                <Typography component="p" variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                  {`${user?.lastName || ''}` || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body3" color="text.secondary">
                  {user?.type !== 'Individual' ? 'Organization Contact Person Email ID' : 'Email ID'}
                </Typography>
                <Typography component="p" variant="subtitle4" color="text.secondarydark">
                  {user?.email || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body3" color="text.secondary">
                  {user?.type !== 'Individual' ? ' Organization Contact Person Phone Number' : 'Phone Number'}
                </Typography>
                <Typography component="p" variant="subtitle4" color="text.secondarydark">
                  {user?.phone || '-'}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="subHeaderLight" component="h5" color={'text.black'} sx={{ pb: 1.5 }}>
              Donation Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} px={1} mb={2}>
                <FieldWithSkeleton
                  isLoading={isLoading}
                  label="Intent Description *"
                  error={touched.intentDescription && errors.intentDescription}
                >
                  <TextField
                    id="intentDescription"
                    label={
                      <>
                        Intent Description (Purpose of Donation){' '}
                        <Box component="span" sx={{ color: 'error.main' }}>
                          *
                        </Box>
                      </>
                    }
                    {...getFieldProps('intentDescription')}
                    error={touched.intentDescription && Boolean(errors.intentDescription)}
                    fullWidth
                    variant="standard"
                    onFocus={handleFormInteraction}
                  />
                </FieldWithSkeleton>
              </Grid>
              <Grid item xs={12} sm={4} px={1}>
                <FieldWithSkeleton
                  isLoading={isLoading}
                  label="Enter Donation Amount *"
                  error={touched.donationAmount && errors.donationAmount}
                >
                  <NumericFormat
                    label={
                      <>
                        Pledge Amount (AED){' '}
                        <Box component="span" sx={{ color: 'error.main' }}>
                          *
                        </Box>
                      </>
                    }
                    {...getFieldProps('donationAmount')}
                    error={touched.donationAmount && Boolean(errors.donationAmount)}
                    value={formik.values.donationAmount}
                    customInput={TextField}
                    thousandSeparator
                    variant="standard"
                    fullWidth
                    onFocus={handleFormInteraction}
                  />
                </FieldWithSkeleton>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Submit
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
