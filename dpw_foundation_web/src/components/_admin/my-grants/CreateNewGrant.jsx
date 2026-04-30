'use client';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { useAuthorizationRedirect } from 'src/hooks/useAuthorizationRedirect';
import { setToastMessage } from 'src/redux/slices/common';
import { setGrantRequestData, setGrantRequestLoading } from 'src/redux/slices/grant';
import { resetStep } from 'src/redux/slices/stepper';
import * as grantManagementApi from 'src/services/grantManagement';
import * as yup from 'yup';
import BtnActions from './BtnAction';
import GrantStepper from './GrantStepper';

const getInitialValues = (value, defaultValue) => value ?? defaultValue;

const step1Schema = yup.object().shape({
  mobile: yup.string().required('Phone Number is required'),
  currentCountryOfResidence: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  mailingAddress: yup.string().required('Mailing Address is required'),
  bankBeneficiaryName: yup.string().required('Beneficiary Name is required'),
  bankName: yup.string().required('Bank Name is required'),
  bankAccount: yup.string().required('Account Number is required'),
  bankIban: yup.string().required('IBAN is required'),
  bankSwiftCode: yup.string().required('SWIFT Code is required'),

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
  })
});
const fullSchema = step1Schema.concat(step2Schema);
const validationSchemas = [step1Schema, step2Schema];

export default function CreateNewGrant({ isUpdate = false }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const { profileData } = useSelector((state) => state.profile);
  const { activeStep } = useSelector((state) => state?.stepper);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const [loadingType, setLoadingType] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  useAuthorizationRedirect({
    condition: !profileData?.firstGrantAccepted,
    redirectTo: '/user/settings',
    deps: [profileData?.firstGrantAccepted]
  });

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
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      router.push(`/user/my-grants`);
      dispatch(resetStep());
      resetForm();
      dispatch(setGrantRequestData(null));
    },
    onError: (error) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

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
          : [],
      //step 2
      requestedResource: getInitialValues(grantRequestData?.requestedResource, 'online'),
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
      dpWorldMobile: getInitialValues(grantRequestData?.dpWorldMobile, '')
    },
    validationSchema: validationSchemas[activeStep]
  });

  const { values, handleSubmit, setTouched, resetForm } = formik;

  const handleSaveAsDraft = () => {
    setLoadingType('saveAsDraft');
    const payload = {
      ...values,
      submissionMode: 'save'
    };
    updateGrantRequest({ id, payload });
  };

  const handleMainSubmit = async () => {
    try {
      await fullSchema.validate(values, { abortEarly: false });
      const payload = {
        ...values,
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

  const title = isUpdate ? 'Edit Grant Request ' + '- ' + grantRequestData?.grantUniqueId : 'Create New Grant Request';
  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    router.push(`/user/my-grants`);
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <BtnActions
          handleClose={handleClose}
          handleProceed={handleProceed}
          setOpenCancelDialog={setOpenCancelDialog}
          openCancelDialog={openCancelDialog}
          onSubmit={handleMainSubmit}
          handleSaveAsDraft={handleSaveAsDraft}
          backUrl="/user/my-grants"
          isSaveAsDraftLoading={loadingType === 'saveAsDraft'}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
        />
        <HeaderBreadcrumbs admin heading={title} />
        <GrantStepper />
      </Form>
    </FormikProvider>
  );
}
