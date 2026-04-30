'use client';
import { Grid, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { RightArrowIcon } from 'src/components/icons';
import { setInKindContributionRequestData, setInKindContributionRequestLoading } from 'src/redux/slices/beneficiary';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import * as beneficiaryApi from 'src/services/beneficiary';
import * as yup from 'yup';
import BtnActions from '../../grant-management/create-request/BtnActions';
import InKindStepper from './InKindStepper';

const step1Schema = yup.object().shape({
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
  })
});

const step2Schema = yup.object().shape({
  requestResource: yup.string().required('Requested Source is required'),
  currency: yup.string().required('Currency is required'),
  assistanceRequested: yup.string().required('Type of Assistance Required is required'),
  requestTitle: yup.string().required('Request Title is required'),
  requestDescription: yup.string().required('Request Description is required'),
  requestNature: yup.string().required('Request Nature is required'),
  estimatedValueInkind: yup.string().when('assistanceRequested', {
    is: (val) => val === 'inkind' || val === 'mixed',
    then: (schema) => schema.required('Estimated Value of In-Kind is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  estimatedValueDonation: yup.string().when('assistanceRequested', {
    is: (val) => val === 'mixed',
    then: (schema) => schema.required('Estimated Value of Donation is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  expectedDateContribution: yup.date().when('requestNature', {
    is: (val) => val === 'one-off',
    then: (schema) => schema.required('Expected Date of Contribution is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  periodFrom: yup.date().when('requestNature', {
    is: (val) => val === 'recurring' || val === 'fixed-period',
    then: (schema) => schema.required('Period From is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  periodTo: yup.date().when('requestNature', {
    is: (val) => val === 'recurring' || val === 'fixed-period',
    then: (schema) => schema.required('Period To is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  contributionItems: yup.array().of(
    yup.object().shape({
      itemCode: yup.string().required('Item Code is required'),
      itemName: yup.string().required('Item Name is required')
    })
  ),
  documents: yup.array().min(1, 'At least one document is required')
});

const step3Schema = yup.object().shape({
  requestApprovalStages: yup.array().of(
    yup.object().shape({
      stageName: yup.string().required('Approver Team is required'),
      approverName: yup.string().required('Approver Authority is required')
    })
  )
});

const fullSchema = step1Schema.concat(step2Schema).concat(step3Schema);
const validationSchemas = [step1Schema, step2Schema, step3Schema];

const getInitialValues = (value, defaultValue) => value ?? defaultValue;

const transformStages = (stages = []) =>
  stages.map((stage, index) => ({
    id: stage.id || '',
    stageName: stage.stageName || '',
    approverName: stage.approverName || '',
    approverId: stage.approverId || '',
    initialStage: stage.initialStage ?? (index === 0 ? 1 : 0),
    sequence: stage.sequence || index + 1
  }));

export default function InKindRequestMain() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { inKindContributionRequestData, inKindContributionRequestLoading } = useSelector(
    (state) => state?.beneficiary
  );
  const { activeStep } = useSelector((state) => state?.stepper);
  const [loadingType, setLoadingType] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      //step 1
      mobile: getInitialValues(inKindContributionRequestData?.mobile, ''),
      currentCountryOfResidence: getInitialValues(inKindContributionRequestData?.currentCountryOfResidence, ''),
      state: getInitialValues(inKindContributionRequestData?.state, ''),
      city: getInitialValues(inKindContributionRequestData?.city, ''),
      mailingAddress: getInitialValues(inKindContributionRequestData?.mailingAddress, ''),
      // Banking Details
      bankBeneficiaryName: getInitialValues(inKindContributionRequestData?.bankBeneficiaryName, ''),
      bankName: getInitialValues(inKindContributionRequestData?.bankName, ''),
      bankAccount: getInitialValues(inKindContributionRequestData?.bankAccount, ''),
      bankIban: getInitialValues(inKindContributionRequestData?.bankIban, ''),
      bankSwiftCode: getInitialValues(inKindContributionRequestData?.bankSwiftCode, ''),
      accountType: getInitialValues(inKindContributionRequestData?.accountType, ''),

      // Type of Organization
      organizationName: getInitialValues(inKindContributionRequestData?.organizationName, ''),
      organizationRegistrationNumber: getInitialValues(
        inKindContributionRequestData?.organizationRegistrationNumber,
        ''
      ),
      // Document Details
      documentDetails:
        Array.isArray(inKindContributionRequestData?.documentDetails) &&
        inKindContributionRequestData.documentDetails.length > 0
          ? inKindContributionRequestData.documentDetails.map((doc) => ({
              id: doc?.id || '',
              documentType: doc?.documentType || '',
              documentNumber: doc?.documentNumber || '',
              documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
              documentImageId: doc?.documentImageId || '',
              fileName: doc?.fileName || '',
              preSignedUrl: doc?.preSignedUrl || ''
            }))
          : [],
      //step 2
      requestResource: getInitialValues(inKindContributionRequestData?.requestResource, ''),
      currency: getInitialValues(inKindContributionRequestData?.currency, ''),
      assistanceRequested: getInitialValues(inKindContributionRequestData?.assistanceRequested, ''),
      requestTitle: getInitialValues(inKindContributionRequestData?.requestTitle, ''),
      requestDescription: getInitialValues(inKindContributionRequestData?.requestDescription, ''),
      requestNature: getInitialValues(inKindContributionRequestData?.requestNature, ''),
      estimatedValueInkind: getInitialValues(inKindContributionRequestData?.estimatedValueInkind, ''),
      estimatedValueDonation: getInitialValues(inKindContributionRequestData?.estimatedValueDonation, ''),
      periodFrom: getInitialValues(inKindContributionRequestData?.periodFrom, null),
      periodTo: getInitialValues(inKindContributionRequestData?.periodTo, null),
      frequency: getInitialValues(inKindContributionRequestData?.frequency, ''),
      expectedDateContribution: getInitialValues(inKindContributionRequestData?.expectedDateContribution, null),
      dpWorldEmployeeId: getInitialValues(inKindContributionRequestData?.dpWorldEmployeeId, ''),
      dpWorldContactName: getInitialValues(inKindContributionRequestData?.dpWorldContactName, ''),
      dpWorldDesignation: getInitialValues(inKindContributionRequestData?.dpWorldDesignation, ''),
      dpWorldEmail: getInitialValues(inKindContributionRequestData?.dpWorldEmail, ''),
      dpWorldMobile: getInitialValues(inKindContributionRequestData?.dpWorldMobile, ''),
      contributionItems:
        inKindContributionRequestData?.contributionItems?.map((item) => ({
          id: getInitialValues(item?.id, ''),
          itemCode: getInitialValues(item?.itemCode, ''),
          itemName: getInitialValues(item?.itemName, ''),
          itemDescription: getInitialValues(item?.itemDescription, ''),
          requiredUnit: getInitialValues(item?.requiredUnit, ''),
          requiredNumber: getInitialValues(item?.requiredNumber, ''),
          unitRate: getInitialValues(item?.unitRate, ''),
          lineValue: getInitialValues(item?.lineValue, ''),
          type: getInitialValues(item?.type, '')
        })) || [],

      //step 3
      requestApprovalStages: transformStages(inKindContributionRequestData?.requestApprovalStages),
      isAgreedDocImplemented: getInitialValues(inKindContributionRequestData?.isAgreedDocImplemented, false)
    },
    validationSchema: validationSchemas[activeStep]
  });

  const { values, handleSubmit, setTouched, resetForm } = formik;

  useQuery(
    ['inKindContributionRequest', beneficiaryApi.getInKindContributionRequestById, id],
    () => {
      dispatch(setInKindContributionRequestLoading(true));
      return beneficiaryApi.getInKindContributionRequestById(id);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setInKindContributionRequestData(data));
        dispatch(setInKindContributionRequestLoading(false));
      },
      onError: () => {
        dispatch(setInKindContributionRequestLoading(false));
      },
      onSettled: () => {
        dispatch(setInKindContributionRequestLoading(false));
      }
    }
  );

  const { mutate: updateInKindContributionRequest } = useMutation(beneficiaryApi.updateInKindContributionRequest, {
    onSuccess: (data) => {
      setLoadingType(null);
      if (data.data.status == 'DRAFT') {
        dispatch(
          setToastMessage({
            message: 'Data Successfully Saved  As Draft',
            variant: 'warning',
            title: 'In Kind Contribution Request Saved as draft'
          })
        );
      } else {
        dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      }
      router.push(`/admin/in-kind-contribution-requests`);
      dispatch(resetStep());
      resetForm();
      dispatch(setInKindContributionRequestData(null));
    },
    onError: (error) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const handleMainSubmit = async () => {
    try {
      await fullSchema.validate(values, { abortEarly: false });
      const payload = {
        ...values,

        submissionMode: 'submit'
      };
      setLoadingType('mainSubmit');
      updateInKindContributionRequest({ id, payload });
      // Trigger final API submit if needed here
    } catch (error) {
      const errorFields = error.inner.reduce((acc, err) => {
        acc[err.path] = true;
        return acc;
      }, {});

      const missingFields = error.inner.map((err) => {
        // Try to extract the field label from the message before "is required"
        const match = err.message.match(/^(.*) is required/);
        return match ? match[1] : err.path;
      });

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

  const handleSaveAsDraft = () => {
    setLoadingType('saveAsDraft');
    const payload = {
      ...values,
      submissionMode: 'save'
    };
    updateInKindContributionRequest({ id, payload });
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/in-kind-contribution-requests`);
  };
  const title = ['IN_PROGRESS_ASSESSMENT', 'DRAFT'].includes(inKindContributionRequestData?.status)
    ? 'Edit In-Kind Contribution Request'
    : 'Create In-Kind Contribution Request';
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <BtnActions
          onSubmit={handleMainSubmit}
          handleSaveAsDraft={handleSaveAsDraft}
          backUrl={`/admin/in-kind-contribution-requests`}
          isSaveAsDraftLoading={loadingType === 'saveAsDraft'}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
          handleClose={handleClose}
          handleProceed={handleProceed}
          setOpenCancelDialog={setOpenCancelDialog}
          openCancelDialog={openCancelDialog}
        />
        <HeaderBreadcrumbs heading={title} />
        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton isLoading={inKindContributionRequestLoading}>
                <TextField
                  id="email"
                  variant="standard"
                  label="Enter Email ID"
                  required
                  fullWidth
                  value={inKindContributionRequestData?.email}
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
        <InKindStepper />
      </Form>
    </FormikProvider>
  );
}
