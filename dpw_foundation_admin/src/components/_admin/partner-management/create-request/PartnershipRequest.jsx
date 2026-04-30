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
import { setPartnershipRequestData, setPartnershipRequestLoading } from 'src/redux/slices/partner';
import { resetStep } from 'src/redux/slices/stepper';
import * as partnerManagementApi from 'src/services/partner';
import * as yup from 'yup';
import DocumentSection from '../../grant-management/create-request/DocumentSection';
import VerificationRequiredModal from '../../grant-management/create-request/VerificationRequiredModal';
import BtnActions from './BtnActions';
import PartnerStepper from './PartnerStepper';

const step1Schema = yup.object().shape({
  mobile: yup.string().required('Phone Number is required'),
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

  organizationName: yup
    .string()
    .required('Organization Name is required')
    .max(255, 'Organization Name must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Organization Name must contain only alphanumeric characters'),
  organizationRegistrationNumber: yup
    .string()
    .required('Organization Registration Number is required')
    .max(255, 'Organization Registration Number must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Organization Registration Number must contain only alphanumeric characters'),
  currentCountryOfResidence: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  mailingAddress: yup
    .string()
    .required('Mailing Address is required')
    .max(255, 'Mailing Address must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Mailing Address must contain only alphanumeric characters')
});

const step2Schema = yup.object().shape({
  requestedResource: yup.string().required('Request Source is required'),
  partnershipSector: yup.string().required('Partnership Sector is required'),
  documentType: yup.string().required('Partnership / Agreement Type is required'),
  partnershipTitle: yup
    .string()
    .required('Partnership Title is required')
    .max(255, 'Partnership Title must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Partnership Title must contain only alphanumeric characters'),
  partnershipDescription: yup
    .string()
    .max(255, 'Partnership Description must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Partnership Description must contain only alphanumeric characters'),
  yearsOfExperience: yup.string().required('Years of Experience is required'),
  describePreviousProjects: yup
    .string()
    .max(255, 'Describe Previous Projects must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Describe Previous Projects must contain only alphanumeric characters'),
  startDate: yup.date().required('Start Date for Services is required'),
  endDate: yup.date().required('End Date for Services is required'),
  additionalComments: yup
    .string()
    .max(255, 'Additional Comments must not exceed 255 characters')
    .matches(/^[a-zA-Z0-9\s]*$/, 'Additional Comments must contain only alphanumeric characters'),
  contactPersonEmail: yup.string().when('addNewPartnershipContact', {
    is: (val) => val === true,
    then: (schema) => schema.required('Contact Person Email ID is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  contactPersonName: yup.string().when('addNewPartnershipContact', {
    is: (val) => val === true,
    then: (schema) => schema.required('Contact Person Name is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  contactPersonDesignation: yup.string().when('addNewPartnershipContact', {
    is: (val) => val === true,
    then: (schema) => schema.required('Contact Person Designation is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  contactPhoneNumber: yup.string().when('addNewPartnershipContact', {
    is: (val) => val === true,
    then: (schema) => schema.required('Contact Person Phone Number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  partnerContactId: yup.string().when('addNewPartnershipContact', {
    is: (val) => val === false,
    then: (schema) => schema.required('Contact Person Email ID is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  documents: yup.array().min(1, 'At least one document is required')
});

const step3Schema = yup.object().shape({
  requestApprovalStages: yup
    .array()
    .of(
      yup.object().shape({
        stageName: yup.string().required('Approver Team is required'),
        approverName: yup.string().required('Approver Authority is required')
      })
    )
    .test('validate-request-approval-stages', 'At least one request approval stage is required', (value) => {
      const initialStage = value.filter((stage) => stage.initialStage === 1);
      if (initialStage.length === 0) {
        return this.createError({ message: 'At least one request approval stage is required' });
      }
      return true;
    }),
  documentApprovalStages: yup.array().of(
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

export default function PartnershipRequest() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loadingType, setLoadingType] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { partnershipRequestData, partnershipRequestLoading } = useSelector((state) => state?.partner);
  const { activeStep } = useSelector((state) => state?.stepper);
  useQuery(
    ['partnershipRequest', partnerManagementApi.fetchPartnershipRequestById, id],
    () => {
      dispatch(setPartnershipRequestLoading(true));
      return partnerManagementApi.fetchPartnershipRequestById(id);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setPartnershipRequestData(data));
        dispatch(setPartnershipRequestLoading(false));
      },
      onError: () => {
        dispatch(setPartnershipRequestLoading(false));
      },
      onSettled: () => {
        dispatch(setPartnershipRequestLoading(false));
      }
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      mobile: getInitialValues(partnershipRequestData?.mobile, ''),
      currentCountryOfResidence: getInitialValues(partnershipRequestData?.currentCountryOfResidence, ''),
      state: getInitialValues(partnershipRequestData?.state, ''),
      city: getInitialValues(partnershipRequestData?.city, ''),
      mailingAddress: getInitialValues(partnershipRequestData?.mailingAddress, ''),
      organizationName: getInitialValues(partnershipRequestData?.organizationName, ''),
      organizationRegistrationNumber: getInitialValues(partnershipRequestData?.organizationRegistrationNumber, ''),
      // Banking Details
      bankBeneficiaryName: getInitialValues(partnershipRequestData?.bankBeneficiaryName, ''),
      bankName: getInitialValues(partnershipRequestData?.bankName, ''),
      bankAccount: getInitialValues(partnershipRequestData?.bankAccount, ''),
      bankIban: getInitialValues(partnershipRequestData?.bankIban, ''),
      bankSwiftCode: getInitialValues(partnershipRequestData?.bankSwiftCode, ''),
      accountType: getInitialValues(partnershipRequestData?.accountType, ''),
      // Document Details
      documentDetails:
        Array.isArray(partnershipRequestData?.documentDetails) && partnershipRequestData.documentDetails.length > 0
          ? partnershipRequestData.documentDetails.map((doc) => ({
              id: doc?.id || '',
              documentType: doc?.documentType || '',
              documentNumber: doc?.documentNumber || '',
              documentValidity: doc?.documentValidity ? new Date(doc.documentValidity) : null,
              documentImageId: doc?.documentImageId || '',
              fileName: doc?.fileName || '',
              preSignedUrl: doc?.preSignedUrl || ''
            }))
          : [],

      // step 2
      requestedResource: getInitialValues(partnershipRequestData?.requestedResource, ''),
      partnershipSector: getInitialValues(partnershipRequestData?.partnershipSector, ''),
      documentType: getInitialValues(partnershipRequestData?.documentType, ''),
      partnershipTitle: getInitialValues(partnershipRequestData?.partnershipTitle, ''),
      partnershipDescription: getInitialValues(partnershipRequestData?.partnershipDescription, ''),
      yearsOfExperience: getInitialValues(partnershipRequestData?.yearsOfExperience, ''),
      describePreviousProjects: getInitialValues(partnershipRequestData?.describePreviousProjects, ''),
      startDate: getInitialValues(partnershipRequestData?.startDate, ''),
      endDate: getInitialValues(partnershipRequestData?.endDate, ''),
      totalDuration: getInitialValues(partnershipRequestData?.totalDuration, ''),
      describeSpecificAvailability: getInitialValues(partnershipRequestData?.describeSpecificAvailability, ''),
      additionalComments: getInitialValues(partnershipRequestData?.additionalComments, ''),
      addNewPartnershipContact: getInitialValues(partnershipRequestData?.addNewPartnershipContact, false),

      // Contact Details if addNewPartnershipContact is true
      contactPersonEmail: getInitialValues(partnershipRequestData?.contactPersonEmail, ''),
      contactPersonName: getInitialValues(partnershipRequestData?.contactPersonName, ''),
      contactPersonDesignation: getInitialValues(partnershipRequestData?.contactPersonDesignation, ''),
      contactPhoneNumber: getInitialValues(partnershipRequestData?.contactPhoneNumber, ''),
      isPrimaryContact: getInitialValues(partnershipRequestData?.isPrimaryContact, false),

      // Contact Details if addNewPartnershipContact is false
      partnerContactId: getInitialValues(partnershipRequestData?.partnerContactId, ''),

      //step 3
      requestApprovalStages: transformStages(partnershipRequestData?.requestApprovalStages),
      documentApprovalStages: transformStages(partnershipRequestData?.documentApprovalStages),
      partnerVerificationStatus: getInitialValues(partnershipRequestData?.partnerVerificationStatus)
    },
    validationSchema: validationSchemas[activeStep]
  });
  const { values, handleSubmit, setTouched, resetForm } = formik;

  const { mutate: updatePartnershipRequest } = useMutation(partnerManagementApi.updatePartnershipRequest, {
    onSuccess: (data) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      router.push(`/admin/partnership-request`);
      dispatch(resetStep());
      resetForm();
      dispatch(setPartnershipRequestData(null));
    },
    onError: (error) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const handleMainSubmit = async () => {
    try {
      // Check for expired documents before schema validation
      const areDocumentsValid = DocumentSection.validateDocuments(values.documentDetails);
      if (!areDocumentsValid) {
        setShowVerificationModal(true);
        return; // Stop submission if documents are expired
      }

      await fullSchema.validate(values, { abortEarly: false });
      const payload = {
        ...values,
        submissionMode: 'submit'
      };
      setLoadingType('mainSubmit');
      updatePartnershipRequest({ id, payload });
      // Trigger final API submit if needed here
    } catch (error) {
      const errorFields = error.inner.reduce((acc, err) => {
        acc[err.path] = true;
        return acc;
      }, {});
      console.log('errorFields', errorFields);

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
    updatePartnershipRequest({ id, payload });
  };
  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/admin/partnership-request`);
  };
  const { status, partnershipUniqueId } = partnershipRequestData || {};

  const showEditIcon = status === 'IN_PROGRESS_ASSESSMENT' || status === 'DRAFT';

  const title = showEditIcon ? 'Edit Partnership Request' : 'Create Partnership Request';
  const requestUniqueId = partnershipUniqueId ? ' - ' + partnershipUniqueId : '';

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <BtnActions
          onSubmit={handleMainSubmit}
          handleSaveAsDraft={handleSaveAsDraft}
          isSaveAsDraftLoading={loadingType === 'saveAsDraft'}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
          backUrl={`/admin/partnership-request`}
          handleClose={handleClose}
          handleProceed={handleProceed}
          setOpenCancelDialog={setOpenCancelDialog}
          openCancelDialog={openCancelDialog}
        />
        <HeaderBreadcrumbs heading={title + requestUniqueId} />
        <Paper sx={{ p: 3, my: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton isLoading={partnershipRequestLoading}>
                <TextField
                  id="email"
                  variant="standard"
                  label="Enter Email ID"
                  required
                  fullWidth
                  value={partnershipRequestData?.email || ''}
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
        <PartnerStepper />
        <VerificationRequiredModal open={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      </Form>
    </FormikProvider>
  );
}
