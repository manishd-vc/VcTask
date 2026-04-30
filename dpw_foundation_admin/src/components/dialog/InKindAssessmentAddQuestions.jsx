import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Form, Formik } from 'formik';
import { useParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';
import CustomQuestion from '../CustomQuestion';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function InKindAssessmentAddQuestions({ open, onClose, refetch }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const qType = getLabelObject(masterData, 'dpwf_contribution_question_type');
  const validTypes = qType?.values?.map((v) => v.code.toUpperCase()) || [];
  const { inKindAssessmentQuestions } = useSelector((state) => state?.beneficiary);

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

  const { mutate, isLoading } = useMutation(
    'createInKindAssessmentQuestions',
    beneficiaryApi.createInKindAssessmentQuestions,
    {
      onSuccess: (response) => {
        // Dispatch success message and close report modal on success.
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        onClose();
        refetch();
      },
      onError: (error) => {
        // Dispatch error message on failure.
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const initialValues = {
    questions: inKindAssessmentQuestions?.questions || []
  };

  const btnLabel = inKindAssessmentQuestions?.questions?.length > 0 ? 'Update' : 'Prepare';

  const handleSubmit = (values) => {
    const payload = {
      questions: [...values?.questions]
    };

    mutate({ entityId: id, payload });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        {btnLabel} Assessment Questions
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
              <CustomQuestion qType={qType} module="contributions" />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" color="primary" loading={isLoading} disabled={!dirty}>
                {btnLabel}
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
