'use client';
import { Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { RightArrowIcon } from 'src/components/icons';
import { setBeneficiaryUserDetails, setBeneficiaryUserDetailsLoading } from 'src/redux/slices/beneficiary';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { extractFieldLabel, setFieldErrorIfEmpty } from 'src/utils/constants';
import * as yup from 'yup';
import BtnActions from '../../grant-management/create-request/BtnActions';
import BeneficiaryProfileDetails from './BeneficiaryProfileDetails';

const beneficiaryUserSchema = yup.object().shape({
  mobile: yup.string().required('Phone Number is required'),
  currentCountryOfResidence: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  mailingAddress: yup.string().required('Mailing Address is required'),
  bankBeneficiaryName: yup
    .string()
    .required('Beneficiary Name is required')
    .max(255, 'Beneficiary Name must not exceed 255 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Beneficiary Name must contain only alphabetic characters'),
  bankName: yup
    .string()
    .required('Bank Name is required')
    .max(255, 'Bank Name must not exceed 255 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Bank Name must contain only alphabetic characters'),
  bankAccount: yup
    .string()
    .required('Account Number is required')
    .max(22, 'Account Number must not exceed 22 digits')
    .matches(/^\d+$/, 'Account Number must contain only numeric characters'),
  bankIban: yup
    .string()
    .required('IBAN is required')
    .max(255, 'IBAN must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'IBAN must contain only alphanumeric characters'),
  bankSwiftCode: yup
    .string()
    .required('SWIFT Code is required')
    .max(255, 'SWIFT Code must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'SWIFT Code must contain only alphanumeric characters'),

  organizationName: yup.string().when('accountType', {
    is: (val) => val === 'Organization',
    then: (schema) => schema.required('Organization Name is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  organizationRegistrationNumber: yup.string().when('accountType', {
    is: (val) => val === 'Organization',
    then: (schema) => schema.required('Organization Registration Number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  documentDetails: yup
    .array()
    .of(
      yup.object().shape({
        documentType: yup.string().required('Identity Document Type is required'),
        documentImageId: yup.string().required('Upload Document is required')
      })
    )
    .min(1, 'Document Details is required')
});

const getInitialValues = (value, defaultValue) => value ?? defaultValue;

export default function BeneficiaryMain() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { beneficiaryUserDetails, beneficiaryUserDetailsLoading } = useSelector((state) => state?.beneficiary);
  const [loadingType, setLoadingType] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      mobile: getInitialValues(beneficiaryUserDetails?.mobile, ''),
      currentCountryOfResidence: getInitialValues(beneficiaryUserDetails?.currentCountryOfResidence, ''),
      state: getInitialValues(beneficiaryUserDetails?.state, ''),
      city: getInitialValues(beneficiaryUserDetails?.city, ''),
      mailingAddress: getInitialValues(beneficiaryUserDetails?.mailingAddress, ''),
      // Banking Details
      bankBeneficiaryName: getInitialValues(beneficiaryUserDetails?.bankBeneficiaryName, ''),
      bankName: getInitialValues(beneficiaryUserDetails?.bankName, ''),
      bankAccount: getInitialValues(beneficiaryUserDetails?.bankAccount, ''),
      bankIban: getInitialValues(beneficiaryUserDetails?.bankIban, ''),
      bankSwiftCode: getInitialValues(beneficiaryUserDetails?.bankSwiftCode, ''),
      accountType: getInitialValues(beneficiaryUserDetails?.accountType, ''),

      // Type of Organization
      organizationName: getInitialValues(beneficiaryUserDetails?.organizationDetails?.organizationName, ''),
      organizationRegistrationNumber: getInitialValues(
        beneficiaryUserDetails?.organizationDetails?.organizationRegistrationNumber,
        ''
      ),
      // Document Details
      documentDetails:
        Array.isArray(beneficiaryUserDetails?.documentDetails) && beneficiaryUserDetails.documentDetails.length > 0
          ? beneficiaryUserDetails.documentDetails.map((doc) => ({
              id: doc?.id || '',
              documentType: doc?.documentType || '',
              documentNumber: doc?.documentNumber || '',
              documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
              documentImageId: doc?.documentImageId || '',
              fileName: doc?.fileName || '',
              preSignedUrl: doc?.preSignedUrl || ''
            }))
          : []
    },
    validationSchema: beneficiaryUserSchema
  });

  const { values, handleSubmit, setTouched, resetForm } = formik;

  useQuery(
    ['getBeneficiary', beneficiaryApi.getBeneficiaryRequestById, id],
    () => {
      dispatch(setBeneficiaryUserDetailsLoading(true));
      return beneficiaryApi.getBeneficiaryRequestById({ userId: id });
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setBeneficiaryUserDetails(data));
        dispatch(setBeneficiaryUserDetailsLoading(false));
      },
      onError: () => {
        dispatch(setBeneficiaryUserDetailsLoading(false));
      },
      onSettled: () => {
        dispatch(setBeneficiaryUserDetailsLoading(false));
      }
    }
  );

  const { mutate } = useMutation(beneficiaryApi.createBeneficiaryByUserId, {
    onSuccess: (data) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      router.push(`/admin/all-beneficiaries`);
      resetForm();
    },
    onError: (error) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const handleMainSubmit = async () => {
    try {
      await beneficiaryUserSchema.validate(values, { abortEarly: false });
      const payload = {
        id: '',
        userId: id,
        ...values
      };
      setLoadingType('mainSubmit');
      mutate(payload);
      // Trigger final API submit if needed here
    } catch (error) {
      const errorFields = error.inner.reduce((acc, err) => {
        acc[err.path] = true;
        return acc;
      }, {});

      // Check if documentDetails is empty and add to error fields
      const isEmptyArray = (arr) => !arr || arr.length === 0;

      if (isEmptyArray(values.documentDetails)) {
        errorFields.documentDetails = true;
      }

      // Add specific validation for document fields when array is not empty
      if (values.documentDetails?.length > 0) {
        values.documentDetails.forEach((doc, index) => {
          setFieldErrorIfEmpty(doc.documentType, `documentDetails.${index}.documentType`, errorFields);
          setFieldErrorIfEmpty(doc.documentImageId, `documentDetails.${index}.documentImageId`, errorFields);
        });
      }

      const missingFields = error.inner.map((err) => extractFieldLabel(err.message, err.path));

      // Add Document Details to missing fields if empty

      if (isEmptyArray(values.documentDetails)) {
        missingFields.push('Document Details');
      }

      const uniqueFields = [...new Set(missingFields)].join(',  ');

      setTouched(errorFields);
      dispatch(
        setToastMessage({
          message: `Please complete all required fields before submitting. ${uniqueFields}`,
          variant: 'error'
        })
      );
    }
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
  };

  const handleProceed = () => {
    router.push(`/admin/all-beneficiaries`);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <BtnActions
          onSubmit={handleMainSubmit}
          backUrl={`/admin/all-beneficiaries`}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
          handleClose={handleClose}
          handleProceed={handleProceed}
          setOpenCancelDialog={setOpenCancelDialog}
          openCancelDialog={openCancelDialog}
          hideSaveAsDraftBtn
        />
        <HeaderBreadcrumbs heading={'Create Beneficiary'} />
        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton isLoading={beneficiaryUserDetailsLoading}>
                <TextField
                  id="email"
                  variant="standard"
                  label="Enter Email ID"
                  required
                  fullWidth
                  value={beneficiaryUserDetails?.email}
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="button" disabled={true}>
                          <RightArrowIcon height={35} width={35} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    type: 'email',
                    readOnly: false
                  }}
                />
              </FieldWithSkeleton>
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
            Beneficiary information form
          </Typography>
          <BeneficiaryProfileDetails />
        </Paper>
      </Form>
    </FormikProvider>
  );
}
