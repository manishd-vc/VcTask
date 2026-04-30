import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Form, Formik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as Yup from 'yup';
import PostAnalysisReportForm from '../_admin/campaign/steps/postAnalysisReportForm';
import ModalStyle from '../dialog/dialog.style';
import { CloseIcon } from '../icons';

export default function PostAnalysisQuestions({ isView, open, onClose, id, isSuperior, rowData, modalType }) {
  const theme = useTheme(); // Access Material-UI theme
  const style = ModalStyle(theme); // Apply modal styles based on the theme
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery(
    ['getCampaignQuestions', id, open],
    () => api.getCampaignQuestions(id, modalType === 'VOLUNTEER_CAMPAIGN' ? 'VOLUNTEER_CAMPAIGN' : 'CAMPAIGN'),
    {
      refetchOnWindowFocus: false,
      enabled: !!id && open
    }
  );

  // Mutation hook for creating a campaign question.
  const { mutate } = useMutation(
    'createCampaignQuestion',
    isSuperior ? api.createCampaignQuestionsAnswer : api.createCampaignQuestions,
    {
      onSuccess: (response) => {
        // Dispatch success message and close report modal on success.
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        onClose();
      },
      onError: (error) => {
        // Dispatch error message on failure.
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const validationSchema = Yup.object().shape({
    questions: Yup.array().of(
      Yup.object().shape({
        questionText: Yup.string().required('Required question'),
        targetUnit: Yup.string().required('Required target unit'),
        targetValue: Yup.number().typeError('Must be a valid number').required('Required target value'),
        achieveValue: isSuperior
          ? Yup.number().typeError('Must be a valid number').required('Required achieve value when superior')
          : Yup.string().notRequired()
      })
    )
  });

  const handleSubmitQuestion = (values) => {
    const payload = {
      entityId: id, // Campaign ID from URL params
      entityType: modalType === 'VOLUNTEER_CAMPAIGN' ? 'VOLUNTEER_CAMPAIGN' : 'CAMPAIGN', // Entity type
      questionModuleType:
        modalType === 'VOLUNTEER_CAMPAIGN' ? 'VOLUNTEER_CAMPAIGN_POST_ANALYSIS' : 'CAMPAIGN_POST_ANALYSIS',
      postAnalysisQues: values?.questions // Questions from form values
    };
    mutate({ ...payload });
  };

  return (
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
          })) || []
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmitQuestion(values);
      }}
    >
      {({ isValid, dirty, handleSubmit }) => {
        return (
          <Form id="emailCampaignForm" onSubmit={handleSubmit}>
            <Dialog open={open} onClose={onClose} maxWidth="lg">
              <DialogTitle
                sx={{ textTransform: 'uppercase' }}
                id="customized-dialog-title"
                variant="h5"
                color="primary.main"
              >
                Post {modalType === 'campaign' || modalType === 'VOLUNTEER_CAMPAIGN' ? 'campaign' : 'Project'} analysis
                report
              </DialogTitle>
              <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
                <CloseIcon />
              </IconButton>
              <DialogContent>
                <PostAnalysisReportForm
                  isView={isView}
                  isLoading={isLoading}
                  modalTitle={`Prepare post ${modalType === 'campaign' || modalType === 'VOLUNTEER_CAMPAIGN' ? 'Campaign' : 'Project'} report analysis Questionnaire`}
                  campaignUpdateData={data}
                  isSuperior={isSuperior}
                  rowData={rowData}
                  modalType={modalType}
                />
              </DialogContent>
              {!isView && (
                <DialogActions>
                  <Button variant="outlinedWhite" type="button" onClick={onClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!isValid || !dirty} // Disable if required fields are not filled
                    color="primary"
                    type="submit"
                    form="emailCampaignForm" // The form to be submitted
                  >
                    Create
                  </Button>
                </DialogActions>
              )}
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
}
