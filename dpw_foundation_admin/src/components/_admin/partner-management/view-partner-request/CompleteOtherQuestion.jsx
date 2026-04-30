import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import CustomQuestion from 'src/components/CustomQuestion';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';

export default function CompleteOtherQuestion({
  open,
  onClose,
  onSubmit,
  existingQuestions = [],
  refetchQuestionsData
}) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const qType = getLabelObject(masterData, 'dpwf_partner_question_type');
  const validTypes = qType?.values?.map((v) => v.code.toUpperCase()) || [];

  const validationSchema = Yup.object().shape({
    questions: Yup.array().of(
      Yup.object().shape({
        questionText: Yup.string().required('Question text is required'),
        questionType: Yup.string().oneOf(validTypes, 'Invalid question type').required('Question type is required'),
        options: Yup.mixed().when('questionType', {
          is: (val) => ['RADIO', 'CHECKBOX'].includes((val || '').toUpperCase()),
          then: () =>
            Yup.array()
              .of(
                Yup.object().shape({
                  optionText: Yup.string().required('Option text is required')
                })
              )
              .min(1, 'At least one option is required'),
          otherwise: () =>
            Yup.array().of(
              Yup.object().shape({
                optionText: Yup.string()
              })
            )
        })
      })
    )
  });

  const initialValues = {
    questions: existingQuestions || []
  };

  const handleSubmit = (values) => {
    // Call the parent callback to update the questions in the main form
    if (onSubmit) {
      const payload = {
        questions: values.questions
      };
      onSubmit(payload);
    }

    // Close the dialog
    onClose();
    refetchQuestionsData();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        {existingQuestions?.length > 0 ? 'Update Questions' : 'Add Questions'}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ dirty }) => (
          <Form>
            <DialogContent>
              <CustomQuestion qType={qType} />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" color="primary" disabled={!dirty}>
                {existingQuestions?.length > 0 ? 'Update' : 'Add'}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
