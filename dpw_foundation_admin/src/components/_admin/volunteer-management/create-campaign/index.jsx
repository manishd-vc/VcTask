'use client';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { setToastMessage } from 'src/redux/slices/common';
import { resetStep } from 'src/redux/slices/stepper';
import { setExistingCampaignData, setVolunteerCampaignData } from 'src/redux/slices/volunteer';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import * as yup from 'yup';
import BtnActions from '../../partner-management/create-request/BtnActions';
import CampaignStepper from './CampaignStepper';

const step1Schema = yup.object().shape({
  existingCampaignId: yup.string().when('createNewCampaign', {
    is: (val) => val === false,
    then: (schema) => schema.required('Campaign/Project is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  eventType: yup.string().required('Event Type is required'),
  volunteerCampaignTitle: yup.string().required('Campaign Title is required'),
  startDateTime: yup.string().required('Start Date is required'),
  endDateTime: yup.string().required('End Date is required'),
  volunteerCampaignDescription: yup.string().required('Campaign Description is required'),
  region: yup.string().required('Region is required'),
  organizationName: yup.string().required('Organization Name is required'),
  addressLineOne: yup.string().required('Address Line 1 is required'),
  addressLineTwo: yup.string(),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  noOfVolunteersRequired: yup.string().required('No of Volunteers is required'),
  enrollmentStartDateTime: yup.string().required('Enrollment Start Date is required'),
  enrollmentEndDateTime: yup.string().required('Enrollment End Date is required'),
  targetVolunteeringHrs: yup.string(),
  customCriteria: yup.array().of(yup.object()).required('Custom Criteria is required'),
  waiverRequired: yup.boolean().required('Waiver required is required'),
  waiverFormContent: yup.string().when('waiverRequired', {
    is: true,
    then: (schema) => schema.required('Waiver form content is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  genderRequired: yup.string(),
  fromAge: yup.string(),
  toAge: yup.string()
});

const step2Schema = yup.object().shape({
  isRiskAssessmentRequired: yup.boolean().required('Risk assessment required is required'),
  riskAssessments: yup.array().when('isRiskAssessmentRequired', {
    is: (val) => val === true,
    then: (schema) =>
      schema
        .of(
          yup.object().shape({
            riskCode: yup.string().required('Risk code is required'),
            //riskDescription: yup.string().required('Risk description is required'),
            severity: yup.string().required('Severity is required'),
            likelyhood: yup.string().required('Likelyhood is required'),
            riskLevel: yup.string().required('Risk level is required')
            //controlMeasure: yup.string().required('Control measure is required')
          })
        )
        .min(1, 'At least one risk assessment is required when risk assessment is enabled'),
    otherwise: (schema) => schema.notRequired()
  }),
  isSubtaskRequired: yup.boolean().required('Subtask required is required'),
  campaignTasks: yup.array().when('isSubtaskRequired', {
    is: (val) => val === true,
    then: (schema) =>
      schema.of(
        yup.object().shape({
          taskDescription: yup.string().required('Task Description is required'),
          taskMeasure: yup.string().required('Task Measure is required'),
          assignedDate: yup.string().required('Assigned Date is required'),
          targetCompletionDate: yup.string().required('Target Completion Date is required'),
          taskAssigneeId: yup.string().required('Task Assignee id is required')
        })
      ),
    // .min(1, 'At least one task is required when subtask is enabled'),
    otherwise: (schema) => schema.notRequired()
  }),
  milestones: yup.array().of(
    yup.object().shape({
      milestoneDescription: yup.string().required('Milestone description is required'),
      unit: yup.string().required('Unit is required'),
      targetNumber: yup.string().required('Target number is required')
    })
  ),
  publishOnPublicWebsite: yup.boolean().required('Publish on public website is required'),
  publishStartDateTime: yup.string().when('publishOnPublicWebsite', {
    is: true,
    then: (schema) => schema.required('Publish start date time is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  publishEndDateTime: yup.string().when('publishOnPublicWebsite', {
    is: true,
    then: (schema) => schema.required('Publish end date time is required'),
    otherwise: (schema) => schema.notRequired()
  })
});

const step3Schema = yup.object().shape({
  approvalStages: yup
    .array()
    .of(
      yup.object().shape({
        stageName: yup.string().required('Approver Team is required'),
        approverName: yup.string().required('Approver Authority is required')
      })
    )
    .test('validate-approval-stages', 'At least one approval stage is required', (value) => {
      const initialStage = value?.filter((stage) => stage?.initialStage === 1);
      if (initialStage?.length === 0) {
        return this.createError({ message: 'At least one approval stage is required' });
      }
      return true;
    })
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

const getInitialValues = (value, defaultValue) => value || defaultValue;

// Helper function to create step 1 initial values
const createStep1InitialValues = (volunteerCampaignData, existingCampaignData) => ({
  createNewCampaign: getInitialValues(volunteerCampaignData?.createNewCampaign, false),
  existingCampaignId: getInitialValues(volunteerCampaignData?.existingCampaignId || existingCampaignData?.id, ''),
  eventType: getInitialValues(volunteerCampaignData?.eventType, ''),
  coverImageId: getInitialValues(volunteerCampaignData?.coverImageId, null),
  volunteerCampaignTitle: getInitialValues(
    volunteerCampaignData?.volunteerCampaignTitle || existingCampaignData?.campaignTitle,
    ''
  ),
  startDateTime: getInitialValues(volunteerCampaignData?.startDateTime || existingCampaignData?.startDateTime, null),
  endDateTime: getInitialValues(volunteerCampaignData?.endDateTime || existingCampaignData?.endDateTime, null),
  volunteerCampaignDescription: getInitialValues(
    volunteerCampaignData?.volunteerCampaignDescription || existingCampaignData?.campaignDescription,
    ''
  ),
  region: volunteerCampaignData?.region || '',
  organizationName: getInitialValues(
    volunteerCampaignData?.organizationName || existingCampaignData?.organizationName,
    ''
  ),
  addressLineOne: getInitialValues(volunteerCampaignData?.addressLineOne || existingCampaignData?.addressLineOne, ''),
  addressLineTwo: getInitialValues(volunteerCampaignData?.addressLineTwo || existingCampaignData?.addressLineTwo, ''),
  country: getInitialValues(volunteerCampaignData?.country || existingCampaignData?.projectCountry, ''),
  state: getInitialValues(volunteerCampaignData?.state || existingCampaignData?.projectState, ''),
  city: getInitialValues(volunteerCampaignData?.city || existingCampaignData?.projectCity, ''),
  noOfVolunteersRequired: getInitialValues(volunteerCampaignData?.noOfVolunteersRequired, ''),
  enrollmentStartDateTime: getInitialValues(volunteerCampaignData?.enrollmentStartDateTime, null),
  enrollmentEndDateTime: getInitialValues(volunteerCampaignData?.enrollmentEndDateTime, null),
  targetVolunteeringHrs: getInitialValues(volunteerCampaignData?.targetVolunteeringHrs, ''),
  genderRequired: getInitialValues(volunteerCampaignData?.genderRequired, ''),
  volunteersRequiredCount: getInitialValues(volunteerCampaignData?.volunteersRequiredCount, ''),
  minimumHoursRequired: getInitialValues(volunteerCampaignData?.minimumHoursRequired, ''),
  fromAge: getInitialValues(volunteerCampaignData?.fromAge, ''),
  toAge: getInitialValues(volunteerCampaignData?.toAge, ''),
  nationalityRequired: getInitialValues(volunteerCampaignData?.nationalityRequired, []),
  languageRequired: getInitialValues(volunteerCampaignData?.languageRequired, []),
  customCriteria: getInitialValues(volunteerCampaignData?.customCriteria, []),
  waiverRequired: getInitialValues(volunteerCampaignData?.waiverRequired, false),
  waiverFormContent: getInitialValues(volunteerCampaignData?.waiverFormContent, '')
});

// Helper function to create step 2 initial values
const createStep2InitialValues = (volunteerCampaignData, initialRiskAssessments, initialCampaignTasks) => ({
  isRiskAssessmentRequired: getInitialValues(volunteerCampaignData?.isRiskAssessmentRequired, true),
  riskAssessments: initialRiskAssessments,
  isSubtaskRequired: getInitialValues(volunteerCampaignData?.isSubtaskRequired, true),
  campaignTasks: initialCampaignTasks,
  milestones:
    volunteerCampaignData?.milestones?.map((milestone) => ({
      milestoneDescription: getInitialValues(milestone?.milestoneDescription, ''),
      unit: getInitialValues(milestone?.unit, ''),
      targetNumber: getInitialValues(milestone?.targetNumber, ''),
      milestoneUniqueId: getInitialValues(milestone?.milestoneUniqueId, ''),
      id: getInitialValues(milestone?.id, '')
    })) || [],
  publishOnPublicWebsite: getInitialValues(volunteerCampaignData?.publishOnPublicWebsite, false),
  publishStartDateTime: getInitialValues(volunteerCampaignData?.publishStartDateTime, null),
  publishEndDateTime: getInitialValues(volunteerCampaignData?.publishEndDateTime, null)
});

export default function CreateCampaign({ isEdit = false }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const { activeStep } = useSelector((state) => state?.stepper);
  const [loadingType, setLoadingType] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const { volunteerCampaignData, existingCampaignData } = useSelector((state) => state?.volunteer);
  const initialRiskAssessments =
    volunteerCampaignData?.riskAssessments?.length > 0
      ? volunteerCampaignData?.riskAssessments?.map((risk) => ({
          riskCode: getInitialValues(risk?.riskCode, ''),
          riskDescription: getInitialValues(risk?.riskDescription, ''),
          severity: getInitialValues(risk?.severity, ''),
          likelyhood: getInitialValues(risk?.likelyhood, ''),
          riskLevel: getInitialValues(risk?.riskLevel, ''),
          controlMeasure: getInitialValues(risk?.controlMeasure, '')
        }))
      : [
          {
            riskCode: '',
            riskDescription: '',
            severity: '',
            likelyhood: '',
            riskLevel: '',
            controlMeasure: ''
          }
        ];

  const initialCampaignTasks =
    volunteerCampaignData?.campaignTasks?.length > 0
      ? volunteerCampaignData?.campaignTasks?.map((task) => ({
          taskDescription: getInitialValues(task?.taskDescription, ''),
          taskMeasure: getInitialValues(task?.taskMeasure, 'Unit'),
          assignedDate: getInitialValues(task?.assignedDate, ''),
          targetCompletionDate: task?.targetCompletionDate || '',
          taskAssigneeId: getInitialValues(task?.taskAssigneeId, '')
        }))
      : [
          {
            taskDescription: '',
            taskMeasure: 'Unit',
            assignedDate: '',
            targetCompletionDate: '',
            taskAssigneeId: ''
          }
        ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...createStep1InitialValues(volunteerCampaignData, existingCampaignData),
      ...createStep2InitialValues(volunteerCampaignData, initialRiskAssessments, initialCampaignTasks),
      approvalStages: transformStages(getInitialValues(volunteerCampaignData?.approvalStages, []))
    },
    validationSchema: validationSchemas[activeStep]
  });
  const { values, handleSubmit, setTouched, resetForm } = formik;

  useQuery(
    ['volunteerCampaign', volunteerApi.fetchVolunteerCampaignById, id],
    () => volunteerApi.fetchVolunteerCampaignById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setVolunteerCampaignData(data));
      }
    }
  );

  useQuery(['getCampaign', values.existingCampaignId], () => api.getCampaignById(values.existingCampaignId), {
    enabled: !!values.existingCampaignId,
    onSuccess: (data) => {
      dispatch(setExistingCampaignData(data));
    }
  });

  const { mutate: updateVolunteerForm } = useMutation('updateVolunteerForm', volunteerApi.updateVolunteerForm, {
    onSuccess: (response) => {
      if (response.data.status == 'DRAFT') {
        dispatch(
          setToastMessage({
            message: 'Data Successfully Saved  As Draft',
            variant: 'warning',
            title: 'Volunteer Campaign Saved as draft'
          })
        );
      } else {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      }
      dispatch(resetStep());
      resetForm();
      dispatch(setVolunteerCampaignData(response?.data));
      dispatch(setExistingCampaignData(null));
      router.push(`/admin/volunteer-campaigns`);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const getTaskAssigneeIdOneLiner = (task) => {
    return typeof task.taskAssigneeId === 'string' ? task.taskAssigneeId : (task.taskAssigneeId?.id ?? '');
  };

  const handleMainSubmit = async () => {
    try {
      const finalValues = {
        ...values,
        campaignTasks: values?.campaignTasks?.map((task) => ({
          ...task,
          taskAssigneeId: getTaskAssigneeIdOneLiner(task)
        }))
      };

      await fullSchema.validate(finalValues, { abortEarly: false });
      const payload = {
        ...finalValues,
        coverImageId: finalValues?.coverImageId?.id || volunteerCampaignData?.coverImageId || null,
        submissionMode: 'submit'
      };

      delete payload.milestoneDescription;
      delete payload.unit;
      delete payload.targetNumber;
      payload.milestones.forEach((milestone) => {
        delete milestone.id;
      });

      setLoadingType('mainSubmit');

      updateVolunteerForm({ entityId: id, payload: payload });
    } catch (error) {
      const errorFields = error.inner.reduce((acc, err) => {
        acc[err.path] = true;
        return acc;
      }, {});

      const missingFields = error.inner.map((err) => {
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
      campaignTasks: values?.campaignTasks?.map((task) => ({
        ...task,
        taskAssigneeId: getTaskAssigneeIdOneLiner(task)
      })),
      coverImageId: values?.coverImageId?.id || volunteerCampaignData?.coverImageId || null,
      submissionMode: 'save'
    };
    delete payload.milestoneDescription;
    delete payload.unit;
    delete payload.targetNumber;
    payload.milestones.forEach((milestone) => {
      delete milestone.id;
    });
    updateVolunteerForm({ entityId: id, payload: payload });
  };
  const handleClose = () => {
    setOpenCancelDialog(false);
  };
  const handleProceed = () => {
    dispatch(resetStep());
    dispatch(setVolunteerCampaignData(null));
    dispatch(setExistingCampaignData(null));
    router.push(`/admin/volunteer-campaigns`);
  };

  const title = isEdit ? 'Edit Volunteer Campaign' : 'Create New Volunteer Campaign';
  const requestUniqueId = volunteerCampaignData?.volunteerCampaignNumericId
    ? ' - ' + volunteerCampaignData?.volunteerCampaignNumericId
    : '';
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <BtnActions
          onSubmit={handleMainSubmit}
          handleSaveAsDraft={handleSaveAsDraft}
          isSaveAsDraftLoading={loadingType === 'saveAsDraft'}
          isMainSubmitLoading={loadingType === 'mainSubmit'}
          backUrl={`/admin/volunteer-campaigns`}
          handleClose={handleClose}
          handleProceed={handleProceed}
          setOpenCancelDialog={setOpenCancelDialog}
          openCancelDialog={openCancelDialog}
        />
        <HeaderBreadcrumbs heading={title + requestUniqueId} />
        <CampaignStepper />
      </Form>
    </FormikProvider>
  );
}
