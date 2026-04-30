'use client';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { setToastMessage } from 'src/redux/slices/common';
import { setContributionRequestData, setContributionRequestLoading } from 'src/redux/slices/grant';
import { resetStep } from 'src/redux/slices/stepper';
import * as contributionApi from 'src/services/contribution';
import * as yup from 'yup';
import BtnActions from '../my-grants/BtnAction';
import ContributionStepper from './ContributionStepper';

const getInitialValues = (value, defaultValue) => value ?? defaultValue;
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
  bankName: yup.string().required('Bank Name is required').max(255, 'Bank Name must not exceed 255 characters'),
  // .matches(/^[a-zA-Z\s]*$/, 'Bank Name must contain only alphabetic characters'),
  bankAccount: yup.string().required('Account Number is required').max(22, 'Account Number must not exceed 22 digits'),
  // .matches(/^\d+$/, 'Account Number must contain only numeric characters'),
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
  )
});
const fullSchema = step1Schema.concat(step2Schema);
const validationSchemas = [step1Schema, step2Schema];

export default function CreateContribution({ isUpdate }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const { activeStep } = useSelector((state) => state?.stepper);
  const { contributionRequestData } = useSelector((state) => state?.grant);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Core fields
      id: getInitialValues(contributionRequestData?.id, ''),
      contributionUniqueId: getInitialValues(contributionRequestData?.contributionUniqueId, ''),
      userId: getInitialValues(contributionRequestData?.userId, ''),
      email: getInitialValues(contributionRequestData?.email, ''),
      firstName: getInitialValues(contributionRequestData?.firstName, ''),
      lastName: getInitialValues(contributionRequestData?.lastName, ''),

      //step 1
      mobile: getInitialValues(contributionRequestData?.mobile, ''),
      currentCountryOfResidence: getInitialValues(contributionRequestData?.currentCountryOfResidence, ''),
      state: getInitialValues(contributionRequestData?.state, ''),
      city: getInitialValues(contributionRequestData?.city, ''),
      mailingAddress: getInitialValues(contributionRequestData?.mailingAddress, ''),

      // Banking Details
      bankBeneficiaryName: getInitialValues(contributionRequestData?.bankBeneficiaryName, ''),
      bankName: getInitialValues(contributionRequestData?.bankName, ''),
      bankAccount: getInitialValues(contributionRequestData?.bankAccount, ''),
      bankIban: getInitialValues(contributionRequestData?.bankIban, ''),
      bankSwiftCode: getInitialValues(contributionRequestData?.bankSwiftCode, ''),
      accountType: getInitialValues(contributionRequestData?.accountType, ''),

      // Type of Organization
      organizationName: getInitialValues(contributionRequestData?.organizationName, ''),
      organizationRegistrationNumber: getInitialValues(contributionRequestData?.organizationRegistrationNumber, ''),

      // Additional fields
      isAgreedDocImplemented: getInitialValues(contributionRequestData?.isAgreedDocImplemented, false),
      submittedFrom: getInitialValues(contributionRequestData?.submittedFrom, 'normal'),
      assignTo: getInitialValues(contributionRequestData?.assignTo, ''),

      // Document Details
      documentDetails:
        Array.isArray(contributionRequestData?.documentDetails) && contributionRequestData.documentDetails.length > 0
          ? contributionRequestData.documentDetails.map((doc) => ({
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
      requestResource: getInitialValues(contributionRequestData?.requestResource, 'ONLINE'),
      currency: getInitialValues(contributionRequestData?.currency, ''),
      assistanceRequested: getInitialValues(contributionRequestData?.assistanceRequested, ''),
      requestTitle: getInitialValues(contributionRequestData?.requestTitle, ''),
      requestDescription: getInitialValues(contributionRequestData?.requestDescription, ''),
      requestNature: getInitialValues(contributionRequestData?.requestNature, ''),
      estimatedValueInkind: getInitialValues(contributionRequestData?.estimatedValueInkind, 0),
      estimatedValueDonation: getInitialValues(contributionRequestData?.estimatedValueDonation, 0),
      periodFrom: getInitialValues(contributionRequestData?.periodFrom, null),
      periodTo: getInitialValues(contributionRequestData?.periodTo, null),
      frequency: getInitialValues(contributionRequestData?.frequency, ''),
      expectedDateContribution: getInitialValues(contributionRequestData?.expectedDateContribution, null),
      dpWorldEmployeeId: getInitialValues(contributionRequestData?.dpWorldEmployeeId, null),
      dpWorldContactName: getInitialValues(contributionRequestData?.dpWorldContactName, ''),
      dpWorldDesignation: getInitialValues(contributionRequestData?.dpWorldDesignation, ''),
      dpWorldEmail: getInitialValues(contributionRequestData?.dpWorldEmail, ''),
      dpWorldMobile: getInitialValues(contributionRequestData?.dpWorldMobile, ''),
      contributionItems:
        contributionRequestData?.contributionItems?.map((item) => ({
          id: getInitialValues(item?.id, ''),
          itemCode: getInitialValues(item?.itemCode, ''),
          itemName: getInitialValues(item?.itemName, ''),
          itemDescription: getInitialValues(item?.itemDescription, ''),
          requiredUnit: getInitialValues(item?.requiredUnit, ''),
          requiredNumber: getInitialValues(item?.requiredNumber, ''),
          unitRate: getInitialValues(item?.unitRate, ''),
          lineValue: getInitialValues(item?.lineValue, ''),
          type: getInitialValues(item?.type, '')
        })) || []
    },
    validationSchema: validationSchemas[activeStep]
  });

  useQuery(
    ['contributionRequest', contributionApi.fetchContributionRequestById, id],
    () => {
      dispatch(setContributionRequestLoading(true));
      return contributionApi.fetchContributionRequestById(id);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setContributionRequestData(data));
        dispatch(setContributionRequestLoading(false));
      },
      onError: () => {
        dispatch(setContributionRequestLoading(false));
      },
      onSettled: () => {
        dispatch(setContributionRequestLoading(false));
      }
    }
  );

  const { mutate: updateInKindContributionRequest } = useMutation(contributionApi.updateContributionRequest, {
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
      router.push(`/user/in-kind-contribution`);
      dispatch(resetStep());
      resetForm();
      dispatch(setContributionRequestData(null));
    },
    onError: (error) => {
      setLoadingType(null);
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const { values, handleSubmit, setTouched, resetForm } = formik;

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
    router.push(`/user/in-kind-contribution`);
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
          backUrl="/user/in-kind-contribution"
          isSaveAsDraftLoading={loadingType === 'saveAsDraft'}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
        />
        {isUpdate ? (
          <HeaderBreadcrumbs admin heading={'edit in-kind contribution request'} />
        ) : (
          <HeaderBreadcrumbs admin heading={'Create in-kind contribution request'} />
        )}
        <ContributionStepper />
      </Form>
    </FormikProvider>
  );
}
