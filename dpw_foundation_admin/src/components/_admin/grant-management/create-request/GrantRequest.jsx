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
import { setToastMessage } from 'src/redux/slices/common';
import { setGrantRequestData, setGrantRequestLoading } from 'src/redux/slices/grant';
import { resetStep } from 'src/redux/slices/stepper';
import * as grantManagementApi from 'src/services/grantManagement';
import * as yup from 'yup';
import BtnActions from './BtnActions';
import GrantStepper from './GrantStepper';

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
  }),
  documentDetails: yup
    .array()
    .min(1, 'At least one identity document is required')
    .of(
      yup.object().shape({
        documentType: yup.string().required('Document Type is required'),
        documentNumber: yup.string().required('Document Number is required'),
        documentValidity: yup.date().required('Document Validity is required'),
        documentImageId: yup.string().required('Document upload is required')
      })
    )
});
const step2Schema = yup.object().shape({
  requestedResource: yup.string().required('Requested Source is required'),
  assistanceType: yup.string().required('Type of Assistance Required is required'),
  amountRequested: yup.string().required('Amount Requested is required'),
  currency: yup.string().required('Currency is required'),
  startDate: yup.date().required('Start Date is required'),
  endDate: yup.date().required('End Date is required'),
  demography: yup.string().required('Demography is required'),
  projectBackground: yup
    .string()
    .required('Background or Details of Project for Which Financial Support Is Required is required'),
  previousSupportDetails: yup.string().when('receivedSupportBefore', {
    is: (val) => val === true,
    then: (schema) => schema.required('Details of Previous Support is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  dpWorldEmployeeId: yup
    .string()
    .max(255, 'Employee ID must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Employee ID must contain only alphanumeric characters'),
  dpWorldContactName: yup
    .string()
    .max(255, 'Name must not exceed 255 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name must contain only alphanumeric characters'),
  dpWorldDesignation: yup
    .string()
    .max(255, 'Designation must not exceed 255 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Designation must contain only alphanumeric characters'),
  dpWorldEmail: yup
    .string()
    .nullable()
    .test('gmail-format', 'Enter valid Email ID', function (value) {
      if (!value) return true; // Allow empty values
      return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
    }),
  documents: yup.array().min(1, 'At least one document is required')
});

const step3Schema = yup.object().shape({
  // requestApprovalStages: yup.array().of(
  //   yup.object().shape({
  //     stageName: yup.string().required('Approver Team is required'),
  //     approverName: yup.string().required('Approver Authority is required')
  //   })
  // ),
  requestApprovalStages: yup.array().when('documentType', {
    is: (val) => val === 'AGREEMENT' || val === 'CONTRIBUTION',
    then: (schema) =>
      schema.of(
        yup.object().shape({
          stageName: yup.string().required('Approver Team is required'),
          approverName: yup.string().required('Approver Authority is required')
        })
      ),
    otherwise: (schema) => schema.notRequired()
  }),
  documentApprovalStages: yup.array().when('documentType', {
    is: (val) => val === 'AGREEMENT' || val === 'CONTRIBUTION',
    then: (schema) =>
      schema.of(
        yup.object().shape({
          stageName: yup.string().required('Approver Team is required'),
          approverName: yup.string().required('Approver Authority is required')
        })
      ),
    otherwise: (schema) => schema.notRequired()
  })
  // documentApprovalStages: yup.array().of(
  //   yup.object().shape({
  //     stageName: yup.string().required('Approver Team is required'),
  //     approverName: yup.string().required('Approver Authority is required')
  //   })
  // )
});

const fullSchema = step1Schema.concat(step2Schema).concat(step3Schema);
const validationSchemas = [step1Schema, step2Schema, step3Schema];

const transformStages = (stages = []) =>
  stages.map((stage, index) => ({
    id: stage.id || '',
    stageName: stage.stageName || '',
    approverName: stage.approverName || '',
    approverId: stage.approverId || '',
    initialStage: stage.initialStage ?? (index === 0 ? 1 : 0),
    sequence: stage.sequence || index + 1
  }));

const getInitialValues = (value, defaultValue) => value ?? defaultValue;

export default function GrantRequest() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { grantRequestData, grantRequestLoading, isFilledAssessmentQuestion } = useSelector((state) => state?.grant);
  const { activeStep } = useSelector((state) => state?.stepper);
  const [loadingType, setLoadingType] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      //step 1
      mobile: getInitialValues(grantRequestData?.mobile, ''),
      currentCountryOfResidence: getInitialValues(grantRequestData?.currentCountryOfResidence, ''),
      state: getInitialValues(grantRequestData?.state, ''),
      city: getInitialValues(grantRequestData?.city, ''),
      mailingAddress: getInitialValues(grantRequestData?.mailingAddress, ''),
      // Banking Details
      bankBeneficiaryName: getInitialValues(grantRequestData?.bankBeneficiaryName, ''),
      bankName: getInitialValues(grantRequestData?.bankName, ''),
      bankAccount: getInitialValues(grantRequestData?.bankAccount, ''),
      bankIban: getInitialValues(grantRequestData?.bankIban, ''),
      bankSwiftCode: getInitialValues(grantRequestData?.bankSwiftCode, ''),
      accountType: getInitialValues(grantRequestData?.accountType, ''),

      // Type of Organization
      organizationName: getInitialValues(grantRequestData?.organizationDetails?.organizationName, ''),
      organizationRegistrationNumber: getInitialValues(
        grantRequestData?.organizationDetails?.organizationRegistrationNumber,
        ''
      ),

      // Document Details
      documentDetails:
        Array.isArray(grantRequestData?.documentDetails) && grantRequestData.documentDetails.length > 0
          ? grantRequestData.documentDetails.map((doc) => ({
              id: doc?.id || '',
              documentType: doc?.documentType || '',
              documentNumber: doc?.documentNumber || '',
              documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
              documentImageId: doc?.documentImageId || '',
              fileName: doc?.fileName || '',
              preSignedUrl: doc?.preSignedUrl || ''
            }))
          : [
              {
                id: '',
                documentType: '',
                documentNumber: '',
                documentValidity: null,
                documentImageId: '',
                fileName: '',
                preSignedUrl: '',
                sequence: 1
              }
            ],
      //step 2
      requestedResource: getInitialValues(grantRequestData?.requestedResource, ''),
      assistanceType: getInitialValues(grantRequestData?.assistanceType, ''),
      amountRequested: getInitialValues(grantRequestData?.amountRequested, ''),
      currency: getInitialValues(grantRequestData?.currency, ''),
      projectBackground: getInitialValues(grantRequestData?.projectBackground, ''),
      startDate: getInitialValues(grantRequestData?.startDate, null),
      endDate: getInitialValues(grantRequestData?.endDate, null),
      totalDuration: getInitialValues(grantRequestData?.totalDuration, ''),
      demography: getInitialValues(grantRequestData?.demography, ''),
      receivedSupportBefore: getInitialValues(grantRequestData?.receivedSupportBefore, false),
      previousSupportDetails: getInitialValues(grantRequestData?.previousSupportDetails, ''),
      dpWorldEmployeeId: getInitialValues(grantRequestData?.dpWorldEmployeeId, ''),
      dpWorldContactName: getInitialValues(grantRequestData?.dpWorldContactName, ''),
      dpWorldDesignation: getInitialValues(grantRequestData?.dpWorldDesignation, ''),
      dpWorldEmail: getInitialValues(grantRequestData?.dpWorldEmail, ''),
      dpWorldMobile: getInitialValues(grantRequestData?.dpWorldMobile, ''),

      //step 3
      grantAssessment: getInitialValues(grantRequestData?.grantAssessment, {}),
      requestApprovalStages: transformStages(grantRequestData?.requestApprovalStages),
      documentType: getInitialValues(grantRequestData?.documentType, 'CONFIRM_EMAIL'),
      documentApprovalStages: transformStages(grantRequestData?.documentApprovalStages)
    },
    validationSchema: validationSchemas[activeStep]
  });
  const { values, handleSubmit, setTouched, resetForm } = formik;

  useQuery(
    ['grantRequest', grantManagementApi.fetchGrantRequestById, id],
    () => {
      dispatch(setGrantRequestLoading(true));
      return grantManagementApi.fetchGrantRequestById(id);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setGrantRequestData(data));
        dispatch(setGrantRequestLoading(false));
      },
      onError: () => {
        dispatch(setGrantRequestLoading(false));
      },
      onSettled: () => {
        dispatch(setGrantRequestLoading(false));
      }
    }
  );
  const { mutate: updateGrantRequest } = useMutation(grantManagementApi.updateGrantRequest, {
    onSuccess: (data) => {
      setLoadingType(null);
      if (data.data.status == 'DRAFT') {
        dispatch(
          setToastMessage({
            message: 'Data Successfully Saved  As Draft',
            variant: 'warning',
            title: 'Grant Request Saved as draft'
          })
        );
      } else {
        dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      }
      router.push(`/admin/grant-request`);
      dispatch(resetStep());
      resetForm();
      dispatch(setGrantRequestData(null));
    },
    onError: (error) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });
  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/grant-request`);
  };
  const handleMainSubmit = async () => {
    try {
      await fullSchema.validate(values, { abortEarly: false });
      if (!isFilledAssessmentQuestion) {
        dispatch(setToastMessage({ message: 'Please fill all the assessment questions', variant: 'error' }));
        return;
      }
      const payload = {
        ...values,
        documentApprovalStages:
          values?.documentType === 'CONFIRM_EMAIL'
            ? grantRequestData?.documentApprovalStages?.filter((stage) => stage.initialStage !== 0)
            : values?.documentApprovalStages,
        submissionMode: 'submit'
      };
      setLoadingType('mainSubmit');
      updateGrantRequest({ id, payload });
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
    updateGrantRequest({ id, payload });
  };

  const title = ['IN_PROGRESS_ASSESSMENT', 'DRAFT'].includes(grantRequestData?.status)
    ? 'Edit Grant Request'
    : 'Create Grant Request';
  const grantUniqueId = grantRequestData?.grantUniqueId ? ' - ' + grantRequestData?.grantUniqueId : '';

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <BtnActions
          onSubmit={handleMainSubmit}
          handleSaveAsDraft={handleSaveAsDraft}
          backUrl={`/admin/grant-request`}
          isSaveAsDraftLoading={loadingType === 'saveAsDraft'}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
          handleClose={handleClose}
          handleProceed={handleProceed}
          setOpenCancelDialog={setOpenCancelDialog}
          openCancelDialog={openCancelDialog}
        />
        <HeaderBreadcrumbs heading={title + grantUniqueId} />
        {!grantRequestData?.grantUniqueId && (
          <Paper sx={{ p: 3, my: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton isLoading={grantRequestLoading}>
                  <TextField
                    id="email"
                    variant="standard"
                    label="Enter Email ID"
                    required
                    fullWidth
                    value={grantRequestData?.email || ''}
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
        )}
        <GrantStepper />
      </Form>
    </FormikProvider>
  );
}
