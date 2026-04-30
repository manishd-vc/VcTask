import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as Yup from 'yup';
import VolunteerPostAnalysisForm from './VolunteerPostAnalysisForm';

export default function VolunteerPostAnalysisQuestions({
  open,
  onClose,
  id,
  mode = 'create',
  data,
  isLoading = false,
  refetch
}) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();

  const isAnswerMode = mode === 'answer';
  const isCreateMode = mode === 'create';

  const hasQuestionsToAnswer = data?.postAnalysisQues?.length > 0;

  const { mutate } = useMutation(
    'volunteerCampaignQuestion',
    isAnswerMode ? api.createCampaignQuestionsAnswer : api.createCampaignQuestions,
    {
      onSuccess: (response) => {
        dispatch(
          setToastMessage({
            message:
              response?.message || `Volunteer campaign ${isAnswerMode ? 'answers' : 'questions'} saved successfully`,
            variant: 'success'
          })
        );

        if (isAnswerMode && refetch) {
          refetch();
        }
        onClose();
      },
      onError: (error) => {
        dispatch(
          setToastMessage({
            message:
              error.response?.data?.message ||
              `Failed to save volunteer campaign ${isAnswerMode ? 'answers' : 'questions'}`,
            variant: 'error'
          })
        );
      }
    }
  );

  const validationSchema = Yup.object().shape({
    questions: Yup.array()
      .of(
        Yup.object().shape({
          questionText: Yup.string().required('Question text is required'),
          targetUnit: Yup.string().required('Target unit is required'),
          targetValue: Yup.number()
            .typeError('Target value must be a valid number')
            .positive('Target value must be positive')
            .required('Target value is required'),
          achieveValue: isAnswerMode
            ? Yup.number()
                .typeError('Achieved value must be a valid number')
                .min(0, 'Achieved value cannot be negative')
                .required('Achieved value is required')
            : Yup.string().notRequired()
        })
      )
      // Allow empty array (all questions removed) or at least one valid question
      .test('questions-validation', 'At least one question is required', function (value) {
        // Allow empty array (when all questions are removed)
        if (!value || value.length === 0) {
          return true;
        }
        // If there are questions, require at least one
        return value.length >= 1;
      })
  });

  const handleSubmitQuestion = (values) => {
    const payload = {
      entityId: id,
      entityType: 'VOLUNTEER_CAMPAIGN',
      questionModuleType: 'VOLUNTEER_CAMPAIGN_POST_ANALYSIS',
      postAnalysisQues: values?.questions
    };
    mutate({ ...payload });
  };

  // Dialog mode: for create and answer modes
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Formik
          enableReinitialize
          initialValues={{
            questions:
              data?.postAnalysisQues?.map((q) => ({
                id: q.id,
                questionText: q.questionText,
                targetUnit: q.targetUnit,
                targetValue: q.targetValue,
                achieveValue: q.achieveValue
              })) ||
              (isCreateMode
                ? [
                    {
                      targetUnit: '',
                      questionText: '',
                      targetValue: '',
                      achieveValue: '',
                      sequence: 1
                    }
                  ]
                : [])
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmitQuestion(values);
          }}
        >
          {({ isValid, dirty, handleSubmit, values }) => {
            const shouldEnableButton = dirty && (isValid || values.questions.length === 0);

            return (
              <Form id="volunteerCampaignForm" onSubmit={handleSubmit}>
                <DialogTitle
                  sx={{ textTransform: 'uppercase' }}
                  id="volunteer-campaign-dialog-title"
                  variant="h5"
                  color="primary.main"
                >
                  {isAnswerMode ? 'Answer Post Campaign Analysis Report' : 'Post Campaign Analysis Report'}
                </DialogTitle>
                <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
                  <CloseIcon />
                </IconButton>
                <DialogContent>
                  <VolunteerPostAnalysisForm
                    isLoading={isLoading}
                    modalTitle={
                      isAnswerMode
                        ? 'Answer Questions'
                        : 'Prepare post Volunteer Campaign report analysis Questionnaire'
                    }
                    campaignUpdateData={data}
                    mode={mode}
                    isAnswerMode={isAnswerMode}
                    isCreateMode={isCreateMode}
                  />
                </DialogContent>
                <DialogActions>
                  <Button variant="outlinedWhite" type="button" onClick={onClose} color="primary">
                    Cancel
                  </Button>
                  {(isCreateMode || (isAnswerMode && hasQuestionsToAnswer)) && (
                    <Button
                      variant="contained"
                      disabled={!shouldEnableButton}
                      color="primary"
                      type="submit"
                      form="volunteerCampaignForm"
                    >
                      {isAnswerMode ? 'Submit' : 'Create'}
                    </Button>
                  )}
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}

VolunteerPostAnalysisQuestions.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string,
  mode: PropTypes.oneOf(['create', 'answer']),
  data: PropTypes.object,
  isLoading: PropTypes.bool,
  refetch: PropTypes.func
};
