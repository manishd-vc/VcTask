'use client';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
// mui
import { Box, Grid, Typography } from '@mui/material';
// api
import * as api from 'src/services';
// yup
import * as Yup from 'yup';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { matchIsValidTel } from 'mui-tel-input';
import { useRouter } from 'next-nprogress-bar';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GetUserByEmail from 'src/components/get-user-by-email';
import LoadingFallback from 'src/components/loadingFallback';
import { getDefaultFileValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { onSpotDonationOBJ } from 'src/utils/onSpotUtils';
import CancelDialog from '../../_admin/campaign/cancelDialog';
import ConfirmPayment from '../../_admin/donor/on-spot-donation/ConfirmPayment';
import DonorDetailForm from '../../_admin/donor/on-spot-donation/DonorDetailForm';
import FormActions from '../../_admin/donor/on-spot-donation/FormActions';
import UserFormComponent from '../../_admin/donor/on-spot-donation/UserFormComponent';
import ViewDonorDetails from '../../_admin/donor/on-spot-donation/ViewDonorDetails';
import ViewDonorInfo from '../../_admin/donor/on-spot-donation/ViewDonorInfo';
import { getInitialValues } from './getInitialValues';
OnSpotDonationForm.propTypes = {
  // 'isView' is a boolean to determine if the form is in view-only mode
  isView: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean to determine if the form is in edit mode
  isEdit: PropTypes.bool.isRequired
};

/**
 * OnSpotDonationForm Component
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isView - If true, renders the form in view-only mode.
 * @param {boolean} props.isEdit - If true, renders the form in edit mode.
 * @returns {JSX.Element} - Rendered OnSpotDonationForm component.
 */
export default function OnSpotDonationForm({ isView, isEdit }) {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const { masterData } = useSelector((state) => state?.common);
  const documentTypesData = getLabelObject(masterData, 'dpw_foundation_user_identity');
  const currencyData = getLabelObject(masterData, 'dpw_foundation_currency');
  const genders = getLabelObject(masterData, 'dpw_foundation_user_gender');
  const donationTypeData = getLabelObject(masterData, 'dpw_foundation_donation_type');
  const registeredAs = getLabelObject(masterData, 'dpw_foundation_campaign_register_as');
  const { maxPhotoSizeKB, uploadCount } = getDefaultFileValidation(masterData);

  const [errorPaymentOption, setErrorPaymentOption] = useState(false);
  const [open, setOpen] = useState(false);
  const [showHiddenForm, setShowHiddenForm] = useState(isEdit);
  const [userDetail, setUserDetail] = useState({});
  const [fileDetail, setFileDetail] = useState({});
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formFieldReadOnly, setFormFieldReadOnly] = useState({});
  const [isAmountConfirmed, setIsAmountConfirmed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showUploadError, setShowUploadError] = useState('');
  const handleCloseModal = () => setOpenModal(false);
  const { data: donorData, isLoading: userLoading } = useQuery(
    ['getOnSpotDonorData', params.id],
    () => api.getOnSpotDonorData(params.id),
    {
      onSuccess: (data) => {
        setFormFieldReadOnly({
          accountType: !!data?.accountType,
          firstName: !!data?.firstName,
          lastName: !!data?.lastName,
          mobile: !!data?.mobile,
          gender: !!data?.gender,
          currentCountryOfResidence: !!data?.currentCountryOfResidence,
          state: !!data?.state,
          city: !!data?.city
        });
      },
      enabled: !!params.id,
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  // Mutation for form submission
  const mutationConfig = {
    retry: false,
    onSuccess: (data) => {
      if (data?.data?.paymentUrl) {
        router.push(data.data.paymentUrl);
      } else {
        dispatch(setToastMessage({ message: data.message, variant: 'success' }));
        router.push('/admin/on-the-spot-donation');
      }
    },
    onError: (error) => dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }))
  };

  const { mutate, isLoading } = useMutation(
    isEdit ? api.updateOnSpotFormByAdmin : api.addOnSpotFormByAdmin,
    mutationConfig
  );

  // Form validation schema
  const onSpotSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email')
      .required('Email is required.'),
    accountType: Yup.string().required('Registered As is required.'),
    donationType: Yup.string().required('Donation Type is required.'),
    firstName: Yup.string().required('First Name is required.'),
    lastName: Yup.string().required('Second Name is required.'),
    mobile: Yup.string()
      .required('Mobile number is required')
      .test('is-valid-phone', 'Please enter a valid Mobile number', function (value) {
        if (!value) {
          return true;
        }
        try {
          const isValid = isValidPhoneNumber(value);

          if (!isValid) {
            return this.createError({
              message: 'The Mobile number is not valid.'
            });
          }
          return true;
        } catch (error) {
          return this.createError({
            message: 'Invalid phone number format.'
          });
        }
      }),
    gender: Yup.string().required('Gender is required.'),
    currentCountryOfResidence: Yup.string().required('Country is required.'),
    state: Yup.string().required('State is required.'),
    city: Yup.string().required('City is required.'),
    donationAmount: Yup.number()
      .typeError('Donation Amount must be a number')
      .positive('Donation Amount must be positive')
      .required('Donation Amount is required.'),
    currency: Yup.string().required('Currency is required.'),
    intentDescription: Yup.string().required('Donation Note is required.'),
    documentDetails: Yup.array().of(
      Yup.object().shape({
        documentType: Yup.string()
          .required('Document type is required')
          .test('unique-documentType', 'Each document type must be unique', function (value) {
            const { options } = this;
            const { documentDetails } = options.context;
            const duplicates = documentDetails.filter((doc) => doc.documentType === value);
            return duplicates.length <= 1;
          }),
        documentNumber: Yup.string().required('Document number is required'),
        documentValidity: Yup.date().nullable().required('Document validity is required'),
        documentImageId: Yup.string().required('Document is required')
      })
    ),
    paymentThrough: Yup.string().required('Payment Method is required.')
  });
  const formik = useFormik({
    initialValues: getInitialValues(donorData),
    enableReinitialize: true,
    validationSchema: onSpotSchema,

    onSubmit: (values) => {
      console.log(values);
      const data = {
        ...values,
        donationAmount: Number(values.donationAmount),
        documentDetails: values?.documentDetails
      };
      if (matchIsValidTel(values.mobile)) {
        if (data['mobile']) {
          data['mobile'] = data['mobile'].replace(/\s/g, '');
        }
        mutate(
          isEdit
            ? { ...data, donationAmount: Number(values.donationAmount), pledgeId: donorData.pledgeId }
            : { ...data }
        );
      } else {
        formik.setFieldError('mobile', 'Please enter valid mobile'); // Show error if phone number is invalid
      }
    }
  });

  const { values, handleSubmit } = formik;

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const { data: projectStateData } = useQuery(
    ['getStates', values?.currentCountryOfResidence],
    () => api.getStates(values?.currentCountryOfResidence),
    {
      enabled: !!values?.currentCountryOfResidence, // Only fetch if country is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );
  const { data: citiesData } = useQuery(
    ['getCities', values?.state],
    () => api.getCities(values?.currentCountryOfResidence, values?.state),
    {
      enabled: !!values?.state, // Only fetch if state is selected
      refetchOnWindowFocus: false // Avoid refetching on window focus
    }
  );

  const handleProceed = () => {
    router.back();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResendLink = async () => {
    if (!params?.id) {
      dispatch(setToastMessage({ message: 'Invalid donor ID for resending link.', variant: 'error' }));
      return;
    }

    try {
      const response = await api.resendDonationLink(params.id);
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
    } catch (error) {
      dispatch(
        setToastMessage({
          message: error?.response?.data?.message || 'An error occurred while resending the link.',
          variant: 'error'
        })
      );
    }
  };
  const createFormFieldReadOnlyConfig = (user = {}) => ({
    accountType: !!user.accountType,
    firstName: !!user.firstName,
    lastName: !!user.lastName,
    mobile: !!user.mobile,
    gender: !!user.gender,
    currentCountryOfResidence: !!user.currentCountryOfResidence,
    state: !!user.state,
    city: !!user.city
  });
  const createUserFormValues = (user = {}) => ({
    email: user?.email || '',
    accountType: user?.accountType || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
    currentCountryOfResidence: user?.currentCountryOfResidence || '',
    state: user?.state || '',
    city: user?.city || '',
    donationAmount: user?.donationAmount || '',
    currency: user?.currency || '',
    intentDescription: user?.intentDescription || '',
    documentDetails: user?.documentDetails || [],
    paymentThrough: user?.paymentThrough || ''
  });
  const handleOnChangeEmail = (email) => {
    formik.resetForm();
    setShowHiddenForm(false);
  };
  let title = 'On Site Donation Form';

  if (isView) {
    title = 'On Site Donation';
  } else if (isEdit) {
    title = 'Edit - On Site Donation Form';
  }

  return (
    <>
      {!isView && <CancelDialog open={open} onClose={handleClose} onSubmit={handleProceed} />}
      <FormikProvider value={formik}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Header with Back Button and Action Buttons */}
          <FormActions
            showHiddenForm={showHiddenForm}
            isView={isView}
            isEdit={isEdit}
            isLoading={isLoading}
            setOpen={setOpen}
            setOpenModal={setOpenModal}
            handleResendLink={handleResendLink}
            isAmountConfirmed={isAmountConfirmed}
            fileDetail={fileDetail}
            setErrorPaymentOption={setErrorPaymentOption}
            setShowUploadError={setShowUploadError}
            donorData={donorData}
            handleSubmit={handleSubmit}
          />
          <Grid item xs={12}>
            <Typography variant="h5" color="primary.main" textTransform="uppercase" mb={2}>
              {title}
            </Typography>
          </Grid>
        </Grid>
        {userLoading ? (
          <LoadingFallback />
        ) : (
          <>
            {!isView && (
              <GetUserByEmail
                type="OSD"
                isResetForm={false}
                onEmailChange={handleOnChangeEmail}
                onSuccess={(user) => {
                  formik.setValues({
                    ...formik.values,
                    email: user?.email || '',
                    accountType: user?.accountType || '',
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    mobile: user?.mobile || '',
                    gender: user?.gender || '',
                    currentCountryOfResidence: user?.currentCountryOfResidence || '',
                    state: user?.state || '',
                    city: user?.city || '',
                    donationAmount: user?.donationAmount || '',
                    currency: user?.currency || '',
                    intentDescription: user?.intentDescription || '',
                    documentDetails: user?.documentDetails || [],
                    paymentThrough: user?.paymentThrough || ''
                  });

                  setUserDetail(user);
                  setIsExistingUser(true);
                  setFormFieldReadOnly(createFormFieldReadOnlyConfig(user));
                  setShowHiddenForm(true);
                }}
                onCreateSuccess={(newUser) => {
                  const newValues = createUserFormValues(newUser);
                  formik.setValues(newValues);
                  setUserDetail(newUser);
                  setIsExistingUser(false);
                  setFormFieldReadOnly(createFormFieldReadOnlyConfig(newUser));
                  setShowHiddenForm(true);
                }}
                onFail={(email) => {
                  setShowHiddenForm(false);
                  setUserDetail({});
                  setIsExistingUser(false);
                  formik.setValues({
                    ...formik.values,
                    email: email,
                    accountType: '',
                    firstName: '',
                    lastName: '',
                    mobile: '',
                    confirmEmail: ''
                  });
                }}
              />
            )}
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Box position="relative">
                {isView ? (
                  <ViewDonorInfo donorData={donorData} donationTypeData={donationTypeData} />
                ) : (
                  <>
                    {showHiddenForm ? (
                      <UserFormComponent
                        isEdit={isEdit}
                        isLoading={userLoading}
                        showHiddenForm={showHiddenForm}
                        isExistingUser={isExistingUser}
                        setShowHiddenForm={setShowHiddenForm}
                        setIsExistingUser={setIsExistingUser}
                        setUserDetail={setUserDetail}
                        formFieldReadOnly={formFieldReadOnly}
                        setFormFieldReadOnly={setFormFieldReadOnly}
                        registeredAs={registeredAs}
                        donationTypeData={donationTypeData}
                        setFileDetail={setFileDetail}
                      />
                    ) : (
                      ''
                    )}
                  </>
                )}
                {isView ? (
                  <ViewDonorDetails donorData={donorData} documentTypesData={documentTypesData} genders={genders} />
                ) : (
                  <>
                    {showHiddenForm ? (
                      <DonorDetailForm
                        userLoading={userLoading}
                        isView={isView}
                        isEdit={isEdit}
                        genders={genders}
                        country={country}
                        citiesData={citiesData}
                        currencyData={currencyData}
                        userDetail={userDetail}
                        isExistingUser={isExistingUser}
                        uploadCount={uploadCount}
                        maxPhotoSizeKB={maxPhotoSizeKB}
                        projectStateData={projectStateData}
                        documentTypesData={documentTypesData}
                        setFileDetail={setFileDetail}
                        formFieldReadOnly={formFieldReadOnly}
                        fileDetail={fileDetail}
                        showUploadError={showUploadError}
                        errorPaymentOption={errorPaymentOption}
                        setErrorPaymentOption={setErrorPaymentOption}
                      />
                    ) : (
                      ''
                    )}
                  </>
                )}
              </Box>
            </Form>
            {(values.paymentThrough === onSpotDonationOBJ.paymentLink ||
              (values.paymentThrough === onSpotDonationOBJ.onSitePayment && values.paymentOption !== '')) &&
            openModal ? (
              <ConfirmPayment
                handleSubmit={handleSubmit}
                open={openModal}
                setOpenModal={setOpenModal}
                onClose={handleCloseModal}
                isAmountConfirmed={isAmountConfirmed}
                setIsAmountConfirmed={setIsAmountConfirmed}
              />
            ) : (
              ''
            )}
          </>
        )}
      </FormikProvider>
    </>
  );
}
