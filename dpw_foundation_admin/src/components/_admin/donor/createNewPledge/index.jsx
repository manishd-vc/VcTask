'use client';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GetUserByEmail from 'src/components/get-user-by-email';
import PageActions from 'src/components/pageActions';
import { gtmEvents } from 'src/lib/gtmEvents';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { onSpotDonationOBJ } from 'src/utils/onSpotUtils';
import * as Yup from 'yup';
import CancelDialog from '../../campaign/cancelDialog';
import PledgeInformation from './pledge-information';

export default function CreateNewPledge() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { userData, isExistingUser } = useSelector((state) => state.userByEmail);

  const { organizationName, organizationRegistrationNumber } = userData?.organizationDetails || {};
  const isIndividual = userData?.accountType === 'Individual';
  const validationSchema = Yup.object().shape({
    donationType: Yup.string().required('Donation Type is required.'),
    campaignId: Yup.string().when('donationType', {
      is: onSpotDonationOBJ.eventSpecific,
      then: (schema) => schema.required('Campaign/ Project is required.'),
      otherwise: (schema) => schema.notRequired()
    }),
    intentDescription: Yup.string().required('Donation Note is required.'),
    donationAmount: Yup.number()
      .typeError('Donation Amount must be a number')
      .positive('Donation Amount must be positive')
      .required('Donation Amount is required.'),
    ...(!organizationName &&
      !isIndividual && {
        organizationName: Yup.string().required('Organization Name is required')
      }),
    ...(!organizationRegistrationNumber &&
      !isIndividual && {
        organizationRegistrationNumber: Yup.string().required('Organization Registration Number is required')
      })
  });

  const formInitialValues = {
    donationType: '',
    campaignId: '',
    intentDescription: '',
    donationAmount: '',
    organizationName: organizationName || '',
    organizationRegistrationNumber: organizationRegistrationNumber || ''
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let payload = {
        donationAmount: values?.donationAmount,
        intentDescription: values?.intentDescription,
        userId: userData?.id
      };
      if (values?.donationType === onSpotDonationOBJ.eventSpecific) {
        payload.campaignId = values?.campaignId;
      }
      if (userData?.accountType !== 'Individual') {
        payload.organizationName = organizationName || values?.organizationName;
        payload.orgRegistrationNum = organizationRegistrationNumber || values?.organizationRegistrationNumber;
      }
      addPledgeFormByAdmin(payload);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const { handleSubmit, isSubmitting, resetForm } = formik;

  const { mutate: addPledgeFormByAdmin } = useMutation(api.addPledgeFormByAdmin, {
    retry: false,
    onSuccess: (data) => {
      const responseData = data?.data || {}; //  Extract API data safely
      const userRoles = Array.isArray(userData?.roles) ? userData.roles.map((role) => role.name).join(', ') : '';
      gtmEvents.pledgeSubmitted({
        formName: 'Donation Pledge Form',
        donationType: responseData?.donationType || '',
        pledgeId: responseData?.donationPledgeId || '', //  use pledgeId (correct key)
        pledgeAmount: responseData?.pledgeAmount || '', //  use pledgeAmount from backend
        donationAmount: responseData?.donationAmount || '', //  include donateAmount if needed
        donationCurrency: responseData?.donationCurrency || '',
        pledgeStatus: responseData?.status || 'Awaiting Pledge Approval',
        userId: userData?.id || '',
        userRole: userRoles
      });
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      router.push('/admin/donor-admin');
    },
    onError: (error) => dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }))
  });

  const handleOnChangeEmail = (email) => {
    resetForm();
  };

  return (
    <>
      <Box position="relative">
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <PageActions backButtonAction={() => router.back()}>
            <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
              Cancel
            </Button>
            {open && <CancelDialog open={open} onClose={() => setOpen(false)} onSubmit={() => router.back()} />}
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!isExistingUser || isSubmitting}
            >
              Submit
            </LoadingButton>
          </PageActions>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary.main" textTransform="uppercase" mb={2}>
              Create New Pledge
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <GetUserByEmail type="DONOR_ADMIN" onEmailChange={handleOnChangeEmail} />
      {isExistingUser && (
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <PledgeInformation />
          </Form>
        </FormikProvider>
      )}
    </>
  );
}
