import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Form, Formik } from 'formik';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';
import CustomQuestion from '../CustomQuestion';
import { CloseIcon } from '../icons';
import PredefineQuestion from '../PredefineQuestion';
import ModalStyle from './dialog.style';

export default function VolunteerAssessmentAddQuestions({ open, onClose, refetch }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const qType = getLabelObject(masterData, 'dpwf_volunteer_question_type');
  const validTypes = qType?.values?.map((v) => v.code.toUpperCase()) || [];
  const { volunteerAssessmentQuestions, volunteerPredefineAssessmentQuestions } = useSelector(
    (state) => state?.volunteer
  );

  const selectedPredefinedIndexes =
    volunteerAssessmentQuestions?.questions
      ?.map((q) => volunteerPredefineAssessmentQuestions.findIndex((pq) => pq.queReference === q.queReference))
      ?.filter((i) => i !== -1) || [];

  const [expanded, setExpanded] = useState(selectedPredefinedIndexes.length > 0);

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
    'createVolunteerAssessmentQuestions',
    volunteerApi.createVolunteerAssessmentQuestions,
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
    questions:
      volunteerAssessmentQuestions?.questions?.filter(
        (q) => !volunteerPredefineAssessmentQuestions.some((pq) => pq.queReference === q.queReference)
      ) || [],
    selectedQuestions: selectedPredefinedIndexes
  };

  const accordionHandler = () => {
    setExpanded(!expanded);
  };

  const btnLabel = volunteerAssessmentQuestions?.questions?.length > 0 ? 'Update' : 'Prepare';

  const handleQuestionToggle = (index, selectedQuestions, setFieldValue) => {
    const isSelected = selectedQuestions?.includes(index);
    const updated = isSelected ? selectedQuestions?.filter((q) => q !== index) : [...selectedQuestions, index];
    setFieldValue('selectedQuestions', updated);
  };

  const handleSubmit = (values) => {
    const selectedPredefined =
      values?.selectedQuestions?.map((index) => volunteerPredefineAssessmentQuestions[index]) || [];
    const payload = {
      questions: [...selectedPredefined, ...values?.questions]
    };

    mutate({ entityId: id, payload });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        {btnLabel} Checklist
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
        {({ values, setFieldValue, dirty }) => (
          <Form>
            <DialogContent>
              <PredefineQuestion
                title="Choose Questions to add in checklist"
                predefineData={volunteerPredefineAssessmentQuestions}
                expanded={expanded}
                accordionHandler={accordionHandler}
                handleQuestionToggle={handleQuestionToggle}
                values={values}
                setFieldValue={setFieldValue}
              />
              <CustomQuestion
                qType={qType}
                predefinedQuestionLength={volunteerPredefineAssessmentQuestions?.length}
                module="volunteer"
              />
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
