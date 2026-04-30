import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as grantManagementApi from 'src/services/grantManagement';
import * as Yup from 'yup';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

const financialQuestions = [
  {
    name: 'hasCurrentAnnualAccounts',
    label: 'Does the organization have current annual accounts?',
    type: 'radio',
    required: false
  },
  {
    name: 'accountsIndependentlyAudited',
    label: 'Are the accounts independently audited? If so by whom?',
    type: 'radio',
    required: true
  },
  {
    name: 'auditorCompany',
    label: 'Auditor Company',
    type: 'text',
    requiredIf: { field: 'accountsIndependentlyAudited', value: 'Yes' }
  },
  {
    name: 'directGovtPartnership',
    label: 'Is this a direct partnership with a government or a government/politically linked individual?',
    type: 'radio',
    required: false
  },
  {
    name: 'associatedWithSanctionedCountries',
    label: 'Is the project associated with any sanctioned countries?',
    type: 'radio',
    required: false
  },
  {
    name: 'adequateFinancialRecords',
    label: 'Does the organization have adequate financial records?',
    type: 'radio',
    required: false
  },
  {
    name: 'publishedAnnualReports',
    label: 'Has the partner published regular annual reports?',
    type: 'radio',
    required: false
  },
  {
    name: 'meetsEligibility',
    label:
      'Does this request meet the eligibility for donation as laid down in the DP World Foundation Charity Partnership Policy?',
    type: 'radio',
    required: false
  },
  {
    name: 'directAssistancePoliticallyLinked',
    label: 'Is this a direct assistance with politically linked individual?',
    type: 'radio',
    required: false
  },
  {
    name: 'dpwfMonitorAuditAbility',
    label: 'Will DPWF have the ability to monitor or audit the use of the donation?',
    type: 'radio',
    required: false
  },
  {
    name: 'localLawsRequirements',
    label: 'Are there any local laws and requirements to be aware of in carrying out the proposed donation?',
    type: 'radio',
    required: false
  },
  {
    name: 'priorExperienceConcerns',
    label: `Has DPWF's prior experience with the requester raised any concerns?`,
    type: 'radio',
    required: false
  }
];

const getValidationSchema = () => {
  const shape = {
    partnerOrganizationName: Yup.string().required('Partner Organization Name is required'),
    referenceNo: Yup.string().required('Reference No is required'),
    assessorFinding: Yup.string().required("Assessor's Finding is required"),
    assessorConclusion: Yup.string().required("Assessor's Conclusion is required")
  };

  financialQuestions.forEach((q) => {
    if (q.required) {
      shape[q.name] = Yup.string().required('This field is required');
    } else if (q.requiredIf) {
      shape[q.name] = Yup.string().when(q.requiredIf.field, {
        is: q.requiredIf.value,
        then: (schema) => schema.required('This field is required'),
        otherwise: (schema) => schema.notRequired()
      });
    }
  });

  return Yup.object().shape(shape);
};

const getInitialValues = (data) => {
  const base = {
    partnerOrganizationName: data?.partnerOrganizationName || '',
    referenceNo: data?.referenceNo || '',
    organizationIntro: data?.organizationIntro || '',
    projectLinkToPillars: data?.projectLinkToPillars || '',
    otherImportantDetail: data?.otherImportantDetail || '',
    assessorFinding: data?.assessorFinding || '',
    assessorConclusion: data?.assessorConclusion || ''
  };

  financialQuestions.forEach((q) => {
    const value = data?.[q?.name];

    if (q.type === 'radio') {
      base[q.name] = value === true ? 'Yes' : 'No'; // default to "No" if not set
    } else {
      base[q.name] = value ?? '';
    }
  });

  return base;
};

const transformValuesForBackend = (values) => {
  const payload = { ...values };

  financialQuestions.forEach((q) => {
    if (q.type === 'radio') {
      payload[q.name] = values[q.name] === 'Yes';
    }
  });

  return payload;
};

const getFieldError = (touched, errors, fieldName) => {
  return Boolean(touched[fieldName] && errors[fieldName]);
};

function ConditionalFieldReset({ financialQuestions }) {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    financialQuestions.forEach((q) => {
      if (q.requiredIf) {
        const conditionNotMet = values[q.requiredIf.field] !== q.requiredIf.value;
        if (conditionNotMet && values[q.name]) {
          setFieldValue(q.name, '');
        }
      }
    });
  }, [values, setFieldValue, financialQuestions]);

  return null;
}

export default function GrantAssessmentQuestionsModal({ data, open, onClose, refetch }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { mutate, isLoading } = useMutation(grantManagementApi.answerGrantAssessmentQuestions, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      onClose();
      refetch();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });
  const buttonLabel = data?.id ? 'Update Answers' : 'Save Answers';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Answer Assessment Questions
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={getInitialValues(data)}
        validationSchema={getValidationSchema()}
        onSubmit={(values) => {
          const payload = transformValuesForBackend(values);
          mutate({ id, payload });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, setFieldValue }) => {
          return (
            <>
              <ConditionalFieldReset financialQuestions={financialQuestions} />
              <Form id="assessmentForm">
                <DialogContent>
                  <Typography
                    variant="subtitle6"
                    component="h4"
                    textTransform={'uppercase'}
                    color="primary.main"
                    sx={{ mb: 2 }}
                  >
                    Basic Questions
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={touched.partnerOrganizationName && errors.partnerOrganizationName}
                      >
                        <TextField
                          id="partnerOrganizationName"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label={
                            <>
                              Partner Organization Name{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          fullWidth
                          {...getFieldProps('partnerOrganizationName')}
                          error={getFieldError(touched, errors, 'partnerOrganizationName')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FieldWithSkeleton isLoading={isLoading} error={touched.referenceNo && errors.referenceNo}>
                        <TextField
                          id="referenceNo"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label={
                            <>
                              Reference No{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          fullWidth
                          {...getFieldProps('referenceNo')}
                          error={getFieldError(touched, errors, 'referenceNo')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12}>
                      <FieldWithSkeleton isLoading={isLoading}>
                        <TextField
                          id="organizationIntro"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label="Short Introduction of the Charitable organization / NGO"
                          fullWidth
                          {...getFieldProps('organizationIntro')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12}>
                      <FieldWithSkeleton isLoading={isLoading}>
                        <TextField
                          id="projectLinkToPillars"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label="How does this Donation / Project link to the Foundation Pillars / Focus Area"
                          fullWidth
                          {...getFieldProps('projectLinkToPillars')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                  </Grid>
                  <Typography
                    variant="subtitle6"
                    component="h4"
                    textTransform={'uppercase'}
                    color="primary.main"
                    sx={{ mb: 2, mt: 3 }}
                  >
                    Financial Records
                  </Typography>
                  <Grid container spacing={3}>
                    {financialQuestions.map((q) => {
                      const error = touched[q.name] && errors[q.name];
                      const shouldShow = !q.requiredIf || values[q.requiredIf.field] === q.requiredIf.value;

                      if (!shouldShow) return null;

                      return (
                        <Grid key={q.name} item xs={12}>
                          <FieldWithSkeleton isLoading={false} error={error}>
                            {q.type === 'radio' ? (
                              <FormControl component="fieldset" error={Boolean(error)}>
                                <FormLabel sx={{ mb: 1 }}>
                                  <Typography variant="body3" color="text.secondary">
                                    {q.label}
                                  </Typography>
                                </FormLabel>
                                <RadioGroup
                                  row
                                  name={q.name}
                                  value={values[q.name]}
                                  onChange={(e) => setFieldValue(q.name, e.target.value)}
                                >
                                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
                                  <FormControlLabel value="No" control={<Radio />} label="No" />
                                </RadioGroup>
                              </FormControl>
                            ) : (
                              <FieldWithSkeleton isLoading={isLoading}>
                                <TextField
                                  id={q.name}
                                  variant="standard"
                                  inputProps={{ maxLength: 255 }}
                                  label={
                                    <>
                                      {q.label}{' '}
                                      <Box component="span" sx={{ color: 'error.main' }}>
                                        *
                                      </Box>
                                    </>
                                  }
                                  fullWidth
                                  {...getFieldProps(q.name)}
                                  error={getFieldError(touched, errors, q.name)}
                                />
                              </FieldWithSkeleton>
                            )}
                          </FieldWithSkeleton>
                        </Grid>
                      );
                    })}
                    <Grid item xs={12}>
                      <FieldWithSkeleton isLoading={isLoading}>
                        <TextField
                          id="otherImportantDetail"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label="Any other important detail"
                          fullWidth
                          {...getFieldProps('otherImportantDetail')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={touched.assessorFinding && errors.assessorFinding}
                      >
                        <TextField
                          id="assessorFinding"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label={
                            <>
                              Assessor's Finding{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          fullWidth
                          {...getFieldProps('assessorFinding')}
                          error={getFieldError(touched, errors, 'assessorFinding')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                    <Grid item xs={12}>
                      <FieldWithSkeleton
                        isLoading={isLoading}
                        error={touched.assessorConclusion && errors.assessorConclusion}
                      >
                        <TextField
                          id="assessorConclusion"
                          variant="standard"
                          inputProps={{ maxLength: 255 }}
                          label={
                            <>
                              Assessor's Conclusion{' '}
                              <Box component="span" sx={{ color: 'error.main' }}>
                                *
                              </Box>
                            </>
                          }
                          fullWidth
                          {...getFieldProps('assessorConclusion')}
                          error={getFieldError(touched, errors, 'assessorConclusion')}
                        />
                      </FieldWithSkeleton>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button variant="outlinedWhite" onClick={onClose}>
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    form="assessmentForm" // The form to be submitted
                    onClick={handleSubmit}
                    loading={isLoading}
                  >
                    {buttonLabel}
                  </LoadingButton>
                </DialogActions>
              </Form>
            </>
          );
        }}
      </Formik>
    </Dialog>
  );
}
