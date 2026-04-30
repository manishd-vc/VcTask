'use client';
import { Box, Button, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import Steppers from 'src/components/stepper/stepper';
import { nextStep, previousStep, resetStep } from 'src/redux/slices/stepper';
import * as Yup from 'yup';

const Step1 = React.lazy(() => import('./steps/step1'));
const Step2 = React.lazy(() => import('./steps/step2'));
// api
import { LoadingButton } from '@mui/lab';
import { useParams, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { BackArrow, BackDisabledArrow, NextDisabledArrow } from 'src/components/icons';
import { setCampaignData } from 'src/redux/slices/campaign';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { normalizePartners } from 'src/utils/constants';
import ApprovalEditDialog from './approvalEditDialog';
import ApprovalPanel from './approvelPanel';
import CancelDialog from './cancelDialog';
import ViewCampaign from './ViewCampaign';
import ViewLoginDetails from './viewLoginDetails';
// Validation schema based on active step

const commonFields = {
  campaignType: Yup.string().required('Campaign type is required'),
  campaignTitle: Yup.string().max(50, 'Must be 50 characters or less').required('Campaign name is required'),
  campaignCategory: Yup.string().required('Category is required'),
  campaignCoverage: Yup.string().required('Coverage is required'),
  campaignDescription: Yup.string().max(1000, 'Must be 1000 characters or less').required('Description is required'),
  projectManagerId: Yup.string().required('Campaign supervisor is required'),
  projectManagerName: Yup.string().required('Campaign supervisor is required'),
  startDateTime: Yup.string().required('Campaign start date is required'),
  addressLineOne: Yup.string().required('Campaign address line is required'),
  endDateTime: Yup.string().required('Campaign end date is required'),
  projectCountry: Yup.string().required('Country is required'),
  projectState: Yup.mixed().required('State is required'),
  isVolunteersRequired: Yup.mixed().required('Volunteers selection is required'),
  // contributionType: Yup.mixed().required('Contribution type is required'),
  projectCity: Yup.string().required('City is required'),
  campaignTargetRequired: Yup.number()
    .required('Estimated Funds is required')
    .positive('Value must be a positive number')
    .typeError('Please enter a valid number'),

  campaignProjectSource: Yup.string().required('Project fund source is required'),
  campaignTargetRequiredCurrency: Yup.string().required('Currency is required'),
  // campaignBeneficiaries: Yup.array().of(
  //   Yup.object({
  //     beneficiaryType: Yup.string().required('Beneficiary type is required'),
  //     targetBeneficiaryNo: Yup.number()
  //       .required('Target beneficiary number is required')
  //       .positive('Value must be a positive number')
  //       .typeError('Please enter a valid number'),
  //     targetBeneficiaryDescription: Yup.string().required('Beneficiary description is required')
  //   })
  // ),
  campaignTasks: Yup.array().of(
    Yup.object({
      taskDescription: Yup.string().required('Task is required'),
      assignedDate: Yup.string().required('Assigned Date is required'),
      targetCompletionDate: Yup.string().required('Target Completion Date is required'),
      taskAssigneeId: Yup.mixed().required('Task assignee is required')
    })
  ),

  campaignPartners: Yup.array().of(
    Yup.object({
      partnerId: Yup.string().required('Partner company name is required'),
      userId: Yup.string()
    })
  ),
  isPartnerRequired: Yup.mixed().required('Partner selection is required')
};

const getValidationSchema = (type, isAdvanced, distribution) => {
  const specificFields = {
    CHARITY: {
      // inKindDonateDescription: Yup.string().required('In Kind Description is required'),
      isKindContributionRequired: Yup.mixed().required('In Kind Contribution is required'),
      isSubtaskRequired: Yup.mixed().required('In Sub Task is required'),
      campaignInKindContributions: Yup.array().of(
        Yup.object({
          inKindItem: Yup.string().required('Item is required'),
          inKindItemCode: Yup.string().required('Item code is required'),
          inKindItemDescription: Yup.string().required('Item description is required'),
          inKindUnit: Yup.string().required('Item unit is required'),
          inKindType: Yup.string().required('Item type is required'),
          targetQuantity: Yup.string().required('Quantity is required')
        })
      )
    },
    FUNDCAMP: {
      fundraisingTarget: Yup.number()
        .required('Fundraising Target is required')
        .positive('Value must be a positive number')
        .typeError('Please enter a valid number'),
      fundraisingTargetCurrency: Yup.string().required('Currency is required'),
      appliedMethod: Yup.mixed().required('Applied Method is required'),
      campaignTargets: Yup.array().of(
        Yup.object({
          targetUnit: Yup.string().required('Target unit is required'),
          targetNumber: Yup.number()
            .required('Target number is required')
            .positive('Value must be a positive number')
            .typeError('Please enter a valid number'),
          targetDescription: Yup.string().required('Target description is required')
        })
      ),
      risksInvolved: Yup.array().of(
        Yup.object({
          riskCode: Yup.string().required('Risk code is required'),
          severity: Yup.string().required('Severity is required'),
          likelyhood: Yup.string().required('Likelyhood is required'),
          riskLevel: Yup.string().required('Risk level is required')
        })
      )
    }
  };
  let advance = {};

  if (isAdvanced && isAdvanced === true) {
    advance = {
      noVolunteersRequired: Yup.number().required('No of target volunteers are required'),
      volunteersRequiredDescriptions: Yup.string().required('Volunteers description is required')
    };
  }
  if (distribution && distribution !== 'GE') {
    specificFields['CHARITY'] = {
      ...specificFields['CHARITY'],
      estimatedDistributionValue: Yup.number()
        .typeError('Estimated Distribution must be Numeric')
        .required('Estimated disctribution value is required'),
      targetBeneficiaryNo: Yup.number()
        .typeError('No of beneficiary must be Numeric')
        .required('No of beneficiary is required'),
      beneficiaryType: Yup.string().required('Beneficiary type is required'),
      targetBeneficiaryDescription: Yup.string().required('Target beneficiary description is required'),
      estimatedDistributionStartDate: Yup.string().required('Estimated distributions start date is required'),
      estimatedDistributionEndDate: Yup.string().required('Estimated distributions end date is required')
    };
  }

  return Yup.object({
    ...commonFields,
    ...(specificFields[type] || specificFields.DEFAULT),
    ...advance
  });
};
const stepCount = 2;
AddCampaign.propTypes = {
  // 'isEdit', 'isApprove', 'isView' are booleans indicating the state of the form
  isEdit: PropTypes.bool.isRequired,
  isApprove: PropTypes.bool.isRequired,
  isView: PropTypes.bool.isRequired,

  // 'data' is an object with a 'status' property, which is required
  data: PropTypes.shape({
    status: PropTypes.string.isRequired // Ensure 'status' is a required string
  }).isRequired,

  // 'refetch' is a function, which is required
  refetch: PropTypes.func.isRequired
};

export default function AddCampaign({ isEdit, isApprove, isView, data, refetch, isSupervisor, beneficiaryProject }) {
  const params = useParams();
  const router = useRouter();
  const moduleList = ['CAMPAIGN_PHOTO_ALBUM', 'CAMPAIGN_PHOTO_BANNER'];
  const type = 'CAMPAIGN';
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state) => state?.stepper);
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const { user } = useSelector(({ user }) => user);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openApprovalEditDialog, setApprovalEditDialog] = useState(false);
  const formikRef = useRef();
  const routerWindow = window.location.href;
  const isEditMode = routerWindow.includes('/edit');
  const isViewMode = routerWindow.includes('/view');
  const [isAdvanced, setIsAdvanced] = useState(true);
  const [distribution, setDistribution] = useState('');
  const [saveMode, setSaveMode] = useState(false);
  const [tick, setTick] = useState({
    0: false,
    1: false
  });
  const [loadingState, setLoadingState] = useState(null);

  const isEnabled = () => !!params?.id && isView;

  const { data: campaignMediaList, refetch: mediaListRefetch } = useQuery(
    ['mediaList', type, params?.id, moduleList],
    () => api.getMediaList({ type, moduleList, id: params?.id }),
    {
      enabled: isEnabled()
    }
  );

  const initPartnerObject = {
    partnerId: '',
    userId: ''
  };

  const { mutate, isLoading } = useMutation(api.updateCampaign, {
    onSuccess: (result) => {
      if (openApprovalEditDialog === false) {
        handleProceed();
        if (result.data.status == 'DRAFT') {
          dispatch(
            setToastMessage({
              message: result.message,
              variant: 'warning',
              title: 'Campaign Saved as draft'
            })
          );
        } else {
          const title =
            formikRef?.current?.values?.status === 'NEED_MORE_INFO' ? 'More Information Updated' : 'SUCCESS';

          dispatch(
            setToastMessage({
              message: result.message,
              variant: 'success',
              title
            })
          );
        }
      } else {
        handleCloseApprovalEdit();
        if (result.data.status == 'DRAFT') {
          dispatch(
            setToastMessage({
              message: result.message,
              variant: 'warning',
              title: 'Campaign Saved as draft'
            })
          );
        }
      }
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const manageTick = async () => {
    try {
      const errors = await formikRef.current.validateForm();
      const fieldsToTouch = [
        'campaignType',
        'campaignTitle',
        'campaignCategory',
        'campaignCoverage',
        'campaignDescription',
        'projectManagerId',
        'projectManagerName',
        'startDateTime',
        'addressLineOne',
        'endDateTime',
        'projectCountry',
        'projectState',
        'projectCity',
        'campaignTargetRequired',
        'campaignProjectSource',
        'campaignTargetRequiredCurrency',
        'campaignBeneficiaries',
        'noVolunteersRequired',
        'volunteersRequiredDescriptions',
        'noVolunteersRequired',
        'campaignPartners',
        'fundraisingTarget',
        'fundraisingTargetCurrency'
      ];
      let error = false;
      fieldsToTouch.forEach((field) => {
        if (errors[field]) {
          error = true;
        }
      });
      if (!error) {
        setTick({
          ...tick,
          0: true
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNext = async () => {
    if (activeStep == 0) {
      manageTick();
    }
    dispatch(nextStep()); // Move to the next step
  };

  const handleBack = () => {
    if (activeStep > 0) {
      dispatch(previousStep());
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetStep());
    };
  }, []);

  useEffect(() => {
    if (campaignUpdateData?.status === 'APPROVED' || campaignUpdateData?.status === 'ONGOING') {
      setApprovalEditDialog(true);
    }
  }, [campaignUpdateData?.status]);

  useEffect(() => {
    if (campaignUpdateData?.isPartnerRequired === null) {
      setIsAdvanced(true);
      formikRef.current.setFieldValue('campaignPartners', [{ ...initPartnerObject }]);
    } else if (campaignUpdateData?.isPartnerRequired) {
      setIsAdvanced(campaignUpdateData?.isPartnerRequired);
      let campaignPartnersObj = campaignUpdateData?.campaignPartners.map((item) => {
        return {
          ...item,
          organizationName: item?.partnerCompanyName,
          email: item?.contactEmail,
          phoneNumber: item?.contactNumber
        };
      });
      formikRef.current.setFieldValue(
        'campaignPartners',
        campaignUpdateData?.campaignPartners.length ? campaignPartnersObj : [initPartnerObject]
      );
    } else {
      setIsAdvanced(true);
      formikRef.current.setFieldValue('campaignPartners', []);
    }

    if (campaignUpdateData?.isKindContributionRequired === false) {
      formikRef.current.setFieldValue('campaignInKindContributions', []);
    }
    if (campaignUpdateData?.isSubtaskRequired === false) {
      formikRef.current.setFieldValue('campaignTasks', []);
    }
    setDistribution(campaignUpdateData?.campaignCategory);
    if (campaignUpdateData?.isRiskAssessmentRequired === false) {
      formikRef.current.setFieldValue('risksInvolved', []);
    }
    formikRef.current.setFieldError('campaignPartners', null);
  }, [campaignUpdateData]);

  const handleClose = () => {
    setOpenCancelDialog(false);
  };

  const handleCloseApprovalEdit = () => {
    setApprovalEditDialog(false);
  };
  const handleProceed = () => {
    dispatch(setCampaignData(null));
    router.back();
  };

  const handleDraft = () => {
    if (formikRef.current) {
      const value = formikRef.current.values;
      if (!value.campaignTitle || value.campaignTitle.trim().length === 0) {
        dispatch(setToastMessage({ message: 'Campaign name is required', variant: 'error' }));
        return 0;
      }

      value['submissionMode'] = 'DRAFT';
      if (value['isVolunteersRequired']) {
        value['isVolunteersRequired'] = Boolean(value['isVolunteersRequired']);
        value['isVolunteersRequired'] = Boolean(value['isVolunteersRequired']);
      }

      for (const element of value['campaignTasks']) {
        element['taskAssigneeId'] = element['taskAssigneeId']?.id;
      }
      if (value['isRiskAssessmentRequired']) {
        value['isRiskAssessmentRequired'] = Boolean(value['isRiskAssessmentRequired']);
      }
      if (value['campaignType'] === 'CHARITY') {
        value['appliedMethod'] = 'Test';
        value['risksInvolved'] = [];
      }
      if (value?.campaignPartners?.length) {
        value.campaignPartners = normalizePartners(value.campaignPartners);
      }
      mutate({ id: params?.id, payload: value });
    }
  };

  const handleSubmit = async (isSave = false) => {
    setSaveMode(isSave);
    const errors = await formikRef.current.validateForm();
    console.log('errors', errors);

    if (Object.keys(errors).length === 0) {
      formikRef.current.submitForm();
    } else {
      const touched = buildTouched(errors);
      formikRef.current.setTouched(touched);

      dispatch(
        setToastMessage({
          message: 'Please enter all required fields in both steps!',
          variant: 'error',
          title: 'Error'
        })
      );
    }
  };

  const buildTouched = (errors) => {
    const result = {};
    Object.keys(errors).forEach((key) => {
      const errorValue = errors[key];
      if (Array.isArray(errorValue)) {
        result[key] = errorValue.map((item) => handleErrorValue(item));
      } else {
        result[key] = handleErrorValue(errorValue);
      }
    });
    return result;
  };

  const handleErrorValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return buildTouched(value);
    }
    return true;
  };

  useEffect(() => {
    if (campaignMediaList) {
      const banner = campaignMediaList?.filter((item) => item.moduleType === 'CAMPAIGN_PHOTO_BANNER');
      const projectDoc = campaignMediaList?.filter((item) => item.moduleType === 'CAMPAIGN_PROJECT_DOC');
      const campaignPhotoAlbum = campaignMediaList?.filter((item) => item.moduleType === 'CAMPAIGN_PHOTO_ALBUM');
      formikRef.current.setFieldValue('campaignAttachments', projectDoc);
      formikRef.current.setFieldValue('campaignPhotoAlbum', campaignPhotoAlbum);
      formikRef.current.setFieldValue('attachThumbnail', banner?.length > 0 ? banner[0] : []);
    }
  }, [campaignMediaList]);

  const submitData = (values) => {
    const value = JSON.parse(JSON.stringify(values));

    if (value?.campaignPartners.length) {
      value.campaignPartners = normalizePartners(value.campaignPartners);
    }

    value['submissionMode'] = saveMode ? 'savePostsubmit' : 'SUBMIT';
    value['status'] = 'PENDING_APPROVAL';
    value['focusAreaSector'] = 'SUBMIT';
    if (value['isVolunteersRequired']) {
      value['isVolunteersRequired'] = Boolean(value['isVolunteersRequired']);
    }
    if (value['isKindContributionRequired']) {
      value['isKindContributionRequired'] = Boolean(value['isKindContributionRequired']);
    }
    if (value['isSubtaskRequired']) {
      value['isSubtaskRequired'] = Boolean(value['isSubtaskRequired']);
    }
    if (value['isRiskAssessmentRequired']) {
      value['isRiskAssessmentRequired'] = Boolean(value['isRiskAssessmentRequired']);
    }

    if (value['campaignType'] === 'CHARITY') {
      value['appliedMethod'] = 'Test';
      value['risksInvolved'] = [];
    }

    for (const element of value['campaignTasks']) {
      element['taskAssigneeId'] = element['taskAssigneeId']?.id;
    }
    if (value['isToPublicallyPublish'] === true) {
      if (
        value['isPublishOnIacadApprove'] === false &&
        (!value['publishStartDateTime'] || !value['publishEndDateTime'])
      ) {
        dispatch(
          setToastMessage({ message: 'Please select publically publish start and end date', variant: 'warning' })
        );
        return;
      } else {
        mutate({ id: params?.id, payload: value });
      }
    } else {
      mutate({ id: params?.id, payload: value });
    }
  };

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const download = (fileId) => {
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };

  useEffect(() => {
    if (campaignUpdateData) {
      setTimeout(() => {
        manageTick();
      }, 1000);
    }
  }, [campaignUpdateData]);

  useEffect(() => {
    const firstElement = document.getElementById('top-of-page');
    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const canApprove =
    isApprove &&
    (campaignUpdateData?.status === 'PENDING_APPROVAL' || campaignUpdateData?.status === 'NEED_MORE_INFO') &&
    campaignUpdateData?.assignTo === user?.userId;

  const renderApprovalPanel = () => {
    if (canApprove && !isSupervisor) {
      return <ApprovalPanel data={campaignUpdateData} />;
    }

    return (
      <Grid item xs={12} md={2}>
        <Button
          variant="text"
          startIcon={<BackArrow />}
          onClick={() => (isView ? handleProceed() : setOpenCancelDialog(true))}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>
      </Grid>
    );
  };

  const getCampaignTitle = () => {
    const campaignId = formikRef?.current?.values?.campaignNumericId || 'N/A';
    const campaignTitle = formikRef?.current?.values?.campaignTitle;

    if (isEditMode) {
      return `Edit Campaign - ID : ${campaignId}`;
    }
    if (isApprove) {
      return `${campaignTitle} - ID : ${campaignId}`;
    }
    if (isViewMode) {
      return `${campaignTitle}- ID : ${campaignId}`;
    }
    if (campaignUpdateData?.campaignType === 'CHARITY') {
      return 'Create New Charitable Project';
    } else {
      return 'Create New Fundraising Campaign';
    }
  };

  const buttonVariant = activeStep === 0 ? 'contained' : 'outlined';
  const buttonDisabled = activeStep === 0;
  const buttonStartIcon = activeStep === 0 ? <BackDisabledArrow /> : <BackArrow />;

  const getInitialValues = (value, defaultValue) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value : defaultValue;
    }
    return value != null ? value : defaultValue;
  };
  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={{
          campaignNumericId: getInitialValues(campaignUpdateData?.campaignNumericId, ''),
          campaignTitle: getInitialValues(campaignUpdateData?.campaignTitle, ''),
          campaignType: getInitialValues(campaignUpdateData?.campaignType, ''),
          appliedMethod: getInitialValues(campaignUpdateData?.appliedMethod, ''),
          campaignDescription: getInitialValues(campaignUpdateData?.campaignDescription, ''),
          campaignCategory: getInitialValues(campaignUpdateData?.campaignCategory, ''),
          estimatedDistributionDescription: getInitialValues(campaignUpdateData?.estimatedDistributionDescription, ''),
          estimatedDistributionValue: getInitialValues(campaignUpdateData?.estimatedDistributionValue, ''),
          estimatedDistributionStartDate: getInitialValues(campaignUpdateData?.estimatedDistributionStartDate, ''),
          estimatedDistributionEndDate: getInitialValues(campaignUpdateData?.estimatedDistributionEndDate, ''),
          beneficiaryType: getInitialValues(campaignUpdateData?.beneficiaryType, ''),
          targetBeneficiaryNo: getInitialValues(campaignUpdateData?.targetBeneficiaryNo, ''),
          targetBeneficiaryDescription: getInitialValues(campaignUpdateData?.targetBeneficiaryDescription, ''),
          totalDistributionValue: getInitialValues(campaignUpdateData?.totalDistributionValue, ''),
          totalBeneficiaryNo: getInitialValues(campaignUpdateData?.totalBeneficiaryNo, ''),
          campaignCoverage: getInitialValues(campaignUpdateData?.campaignCoverage, ''),
          projectManagerId: getInitialValues(campaignUpdateData?.projectManagerId, ''),
          projectManagerName: getInitialValues(campaignUpdateData?.projectManagerName, ''),
          campaignRef: getInitialValues(campaignUpdateData?.campaignRef, ''),
          startDateTime: getInitialValues(campaignUpdateData?.startDateTime, ''),
          addressLineOne: getInitialValues(campaignUpdateData?.addressLineOne, ''),
          addressLineTwo: getInitialValues(campaignUpdateData?.addressLineTwo, ''),
          endDateTime: getInitialValues(campaignUpdateData?.endDateTime, ''),
          projectCountry: getInitialValues(campaignUpdateData?.projectCountry, ''),
          projectState: getInitialValues(campaignUpdateData?.projectState, ''),
          status: getInitialValues(campaignUpdateData?.status, ''),
          projectCity: getInitialValues(campaignUpdateData?.projectCity, ''),
          campaignProjectSource: getInitialValues(campaignUpdateData?.campaignProjectSource, ''),
          campaignTargetRequired: getInitialValues(campaignUpdateData?.campaignTargetRequired, ''),
          campaignTargetRequiredCurrency: getInitialValues(campaignUpdateData?.campaignTargetRequiredCurrency, ''),
          isVolunteersRequired: getInitialValues(campaignUpdateData?.isVolunteersRequired, true),
          noVolunteersRequired: getInitialValues(campaignUpdateData?.noVolunteersRequired, ''),
          volunteersRequiredDescriptions: getInitialValues(campaignUpdateData?.volunteersRequiredDescriptions, ''),
          contributionType: getInitialValues(campaignUpdateData?.contributionType, ''),
          totalFundTarget: getInitialValues(campaignUpdateData?.totalFundTarget, 0),
          isToPublicallyPublish: getInitialValues(campaignUpdateData?.isToPublicallyPublish, true),
          isRiskAssessmentRequired: getInitialValues(campaignUpdateData?.isRiskAssessmentRequired, true),
          isPublishOnIacadApprove: getInitialValues(campaignUpdateData?.isPublishOnIacadApprove, false),
          isSubtaskRequired: getInitialValues(campaignUpdateData?.isSubtaskRequired, true),
          isPartnerRequired: getInitialValues(campaignUpdateData?.isPartnerRequired, true),
          publishStartDateTime: getInitialValues(campaignUpdateData?.publishStartDateTime, null),
          publishEndDateTime: getInitialValues(campaignUpdateData?.publishEndDateTime, null),
          photoAlbumLink: getInitialValues(campaignUpdateData?.photoAlbumLink, ''),
          fundraisingTarget: getInitialValues(campaignUpdateData?.fundraisingTarget, ''),
          fundraisingTargetCurrency: getInitialValues(campaignUpdateData?.fundraisingTargetCurrency, ''),
          distributions: getInitialValues(
            campaignUpdateData?.distributions?.map((beneficiaries) => ({
              id: getInitialValues(beneficiaries?.id, ''),
              distributionCategory: getInitialValues(beneficiaries?.distributionCategory, ''),
              estimatedDistributionValue: getInitialValues(beneficiaries?.estimatedDistributionValue, ''),
              distributionDescription: getInitialValues(beneficiaries?.distributionDescription, ''),
              distributionSource: getInitialValues(beneficiaries?.distributionSource, ''),
              distributionStartTime: getInitialValues(beneficiaries?.distributionStartTime, ''),
              distributionEndTime: getInitialValues(beneficiaries?.distributionEndTime, ''),
              beneficiaryType: getInitialValues(beneficiaries?.beneficiaryType, ''),
              targetBeneficiaryNo: getInitialValues(beneficiaries?.targetBeneficiaryNo, ''),
              targetBeneficiaryDescription: getInitialValues(beneficiaries?.targetBeneficiaryDescription, '')
            })),
            []
          ),
          // campaignBeneficiaries: getInitialValues(
          //   campaignUpdateData?.campaignBeneficiaries?.map((beneficiaries) => ({
          //     beneficiaryType: getInitialValues(beneficiaries?.beneficiaryType, ''),
          //     targetBeneficiaryNo: getInitialValues(beneficiaries?.targetBeneficiaryNo, ''),
          //     targetBeneficiaryDescription: getInitialValues(beneficiaries?.targetBeneficiaryDescription, '')
          //   })),
          //   []
          // ),
          campaignTargets: getInitialValues(
            campaignUpdateData?.campaignTargets?.map((target) => ({
              id: getInitialValues(target?.id, ''),
              targetUnit: getInitialValues(target?.targetUnit, ''),
              targetDescription: getInitialValues(target?.targetDescription, ''),
              targetNumber: getInitialValues(target?.targetNumber, ''),
              achievedNumber: getInitialValues(target?.achievedNumber, ''),
              achievedValue: getInitialValues(target?.achievedValue, ''),
              remarks: getInitialValues(target?.remarks, ''),
              successRate: getInitialValues(target?.successRate, '')
            })),
            []
          ),
          campaignTasks: getInitialValues(
            campaignUpdateData?.campaignTasks?.map((tasks) => ({
              id: getInitialValues(tasks?.id, ''),
              taskDescription: getInitialValues(tasks?.taskDescription, ''),
              taskMeasure: getInitialValues(tasks?.taskMeasure, ''),
              assignedDate: getInitialValues(tasks?.assignedDate, ''),
              targetCompletionDate: getInitialValues(tasks?.targetCompletionDate, ''),
              taskAssigneeId: getInitialValues(tasks?.taskAssigneeId, '')
            })),
            [{ taskDescription: '', taskMeasure: '', taskAssigneeId: '', assignedDate: '', targetCompletionDate: '' }]
          ),
          risksInvolved: getInitialValues(
            campaignUpdateData?.risksInvolved?.map((tasks) => ({
              id: getInitialValues(tasks?.id, ''),
              riskCode: getInitialValues(tasks?.riskCode, ''),
              severity: getInitialValues(tasks?.severity, ''),
              likelyhood: getInitialValues(tasks?.likelyhood, ''),
              riskLevel: getInitialValues(tasks?.riskLevel, ''),
              riskDescription: getInitialValues(tasks?.riskDescription, ''),
              controlMeasure: getInitialValues(tasks?.controlMeasure, '')
            })),
            [{ riskCode: '', severity: '', likelyhood: '', riskLevel: '', riskDescription: '', controlMeasure: '' }]
          ),
          campaignPartners: getInitialValues(
            campaignUpdateData?.campaignPartners?.map((partner) => ({
              partnerId: getInitialValues(partner?.partnerId, ''),
              userId: getInitialValues(partner?.userId, '')
            })),
            [{ ...initPartnerObject }]
          ),
          attachThumbnail: getInitialValues(campaignUpdateData?.attachThumbnail, []),
          emailId: getInitialValues(campaignUpdateData?.emailId, ''),
          subject: getInitialValues(campaignUpdateData?.subject, ''),
          body: getInitialValues(campaignUpdateData?.body, ''),
          bannerFileId: getInitialValues(campaignUpdateData?.bannerFileId, ''),
          sendOn: getInitialValues(campaignUpdateData?.sendOn, null),
          // emailLinkOne: getInitialValues(campaignUpdateData?.emailLinkOne, ''),
          sendCondition: getInitialValues(campaignUpdateData?.sendCondition, ''),
          sendImmidiately: getInitialValues(campaignUpdateData?.sendImmidiately, ''),
          sendAutomatically: getInitialValues(campaignUpdateData?.sendAutomatically, true),
          emailRecipients: getInitialValues(
            campaignUpdateData?.emailRecipients?.map((emailInfo) => ({
              emailId: getInitialValues(emailInfo?.emailId, ''),
              emailGroupId: getInitialValues(emailInfo?.emailGroupId, '')
            })),
            []
          ),
          attachments: getInitialValues(campaignUpdateData?.attachments, []),
          inKindDonateDescription: getInitialValues(campaignUpdateData?.inKindDonateDescription, ''),
          isKindContributionRequired: getInitialValues(campaignUpdateData?.isKindContributionRequired, true),
          campaignInKindContributions: getInitialValues(
            campaignUpdateData?.campaignInKindContributions?.map((tasks) => ({
              inKindItem: getInitialValues(tasks?.inKindItem, ''),
              inKindItemCode: getInitialValues(tasks?.inKindItemCode, ''),
              inKindItemDescription: getInitialValues(tasks?.inKindItemDescription, ''),
              inKindUnit: getInitialValues(tasks?.inKindUnit, ''),
              inKindType: getInitialValues(tasks?.inKindType, ''),
              targetQuantity: getInitialValues(tasks?.targetQuantity?.toString(), '')
            })),
            [
              {
                inKindItem: '',
                targetQuantity: '',
                inKindItemCode: '',
                inKindItemDescription: '',
                inKindUnit: '',
                inKindType: ''
              }
            ]
          ),
          campaignObjectives: getInitialValues(
            campaignUpdateData?.campaignObjectives?.map((tasks) => ({
              objectiveTitle: getInitialValues(tasks?.objectiveTitle, ''),
              objectiveTarget: getInitialValues(tasks?.objectiveTarget?.toString(), '')
            })),
            []
          ),
          emailIds: [],
          bannerImage: getInitialValues(campaignUpdateData?.bannerImage, null),
          campaignAttachments: getInitialValues(campaignUpdateData?.campaignAttachments, []),
          campaignPhotoAlbum: getInitialValues(campaignUpdateData?.campaignPhotoAlbum, []),
          hasCampaignEmail: getInitialValues(campaignUpdateData?.hasCampaignEmail, '')
        }}
        enableReinitialize
        validationSchema={getValidationSchema(formikRef?.current?.values?.campaignType, isAdvanced, distribution)}
        onSubmit={submitData}
      >
        {() => {
          return (
            <Form id="top-of-page">
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {renderApprovalPanel()}
                {isEdit && (
                  <Grid item xs={12} md={10}>
                    <Stack
                      justifyContent={{ sm: 'flex-start', md: 'flex-end' }}
                      flexDirection="row"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <Button
                        onClick={() => {
                          setOpenCancelDialog(true);
                        }}
                        type="button"
                        variant={'outlined'}
                        color="inherit"
                        sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
                      >
                        Cancel
                      </Button>
                      {campaignUpdateData?.status !== 'PENDING_APPROVAL' ? (
                        <>
                          <LoadingButton
                            variant="outlined"
                            type="button"
                            color="inherit"
                            loading={isLoading && loadingState === 'DRAFT'}
                            onClick={() => {
                              setLoadingState('DRAFT');
                              handleDraft();
                            }}
                            sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
                          >
                            Save as Draft
                          </LoadingButton>
                          <LoadingButton
                            type="button"
                            onClick={() => {
                              setLoadingState('SUBMIT');
                              handleSubmit();
                            }}
                            loading={isLoading && loadingState === 'SUBMIT'}
                            disabled={isLoading && loadingState === 'DRAFT'}
                            variant="contained"
                            sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
                          >
                            {data?.status === 'NEED_MORE_INFO' ? 'Re-Submit' : 'Submit'}
                          </LoadingButton>
                        </>
                      ) : (
                        <LoadingButton
                          type="button"
                          onClick={() => {
                            setLoadingState('SAVE');
                            handleSubmit(true);
                          }}
                          loading={isLoading && loadingState === 'SAVE'}
                          variant="contained"
                          sx={{ width: { xs: '100%', sm: '30%', md: 'auto' } }}
                        >
                          Save
                        </LoadingButton>
                      )}
                    </Stack>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="h5" color={'primary.main'} textTransform="uppercase">
                    {getCampaignTitle()}
                  </Typography>
                </Grid>
              </Grid>
              {isView && <ViewLoginDetails />}
              {data?.status === 'NEED_MORE_INFO' && (
                <Box sx={{ p: 3, mb: 4, bgcolor: 'warning.main' }}>
                  <Chip color="info" label="Need more information" size="small" />
                  <Typography variant="body2" color="text.black" sx={{ mt: 1.5 }}>
                    {campaignUpdateData?.notes}
                  </Typography>
                  {campaignUpdateData?.needInfoId && (
                    <>
                      <Typography component="p" variant="subtitle4" color="text.black" sx={{ pt: 2 }}>
                        Download Attachment
                      </Typography>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          download(campaignUpdateData?.needInfoId);
                        }}
                        role="link"
                        style={{
                          textDecorationLine: 'underline',
                          color: '#0F0F19',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        tabIndex="0"
                        aria-label="Download Attachment"
                      >
                        {campaignUpdateData?.fileName}
                      </button>
                    </>
                  )}
                </Box>
              )}
              {isView ? (
                <ViewCampaign
                  isSupervisor={isSupervisor}
                  refetchCampaignApi={refetch}
                  isApproval={
                    isApprove &&
                    campaignUpdateData?.status === 'Completed' &&
                    campaignUpdateData?.assignTo === user?.userId
                  }
                  beneficiaryProject={beneficiaryProject}
                />
              ) : (
                <>
                  {/* <CreateForm isEdit={isEdit} isCreate={true} setOpenCancelDialog={setOpenCancelDialog} /> */}

                  <Steppers stepCount={stepCount} activeStep={activeStep} tick={tick}>
                    {activeStep === 0 ? (
                      <Suspense
                        fallback={
                          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                            <LinearProgress />
                          </Stack>
                        }
                      >
                        <Step1
                          mediaListRefetch={mediaListRefetch}
                          isEdit={isEdit}
                          isApprove={isApprove}
                          onDistribution={setDistribution}
                          setIsAdvanced={setIsAdvanced}
                        />
                      </Suspense>
                    ) : (
                      <Suspense
                        fallback={
                          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
                            <LinearProgress />
                          </Stack>
                        }
                      >
                        <Step2 isEdit={isEdit} isApprove={isApprove} />
                      </Suspense>
                    )}
                    <Stack flexDirection="row" justifyContent="flex-end" gap={1} sx={{ pt: 2 }}>
                      <Button
                        variant={buttonVariant}
                        color="inherit"
                        type="button"
                        disabled={buttonDisabled}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        startIcon={buttonStartIcon}
                      >
                        Previous
                      </Button>
                      <LoadingButton
                        endIcon={<NextDisabledArrow />}
                        type="button"
                        onClick={handleNext}
                        disabled={activeStep === stepCount - 1}
                        loading={isLoading}
                        variant="contained"
                      >
                        Next
                      </LoadingButton>
                    </Stack>
                  </Steppers>
                </>
              )}
            </Form>
          );
        }}
      </Formik>

      {!isView && <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />}
      {!isView && openApprovalEditDialog && (
        <ApprovalEditDialog
          open={openApprovalEditDialog}
          onClose={() => {
            router.back();
            setApprovalEditDialog(false);
          }}
          onSubmit={handleDraft}
          row={campaignUpdateData}
          isView={isView}
        />
      )}
    </>
  );
}
