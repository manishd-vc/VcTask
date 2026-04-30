import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import InKindAssessmentAddQuestions from 'src/components/dialog/InKindAssessmentAddQuestions';
import InKindAssessmentQuestionAnswer from 'src/components/dialog/InKindAssessmentQuestionAnswer';
import { setInKindAssessmentQuestions } from 'src/redux/slices/beneficiary';
import * as beneficiaryApi from 'src/services/beneficiary';

export default function AssessmentAddQuestion() {
  const [open, setOpen] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { inKindAssessmentQuestions } = useSelector((state) => state?.beneficiary);
  const { refetch } = useQuery(
    'getInKindAssessmentQuestions',
    () => beneficiaryApi.getInKindAssessmentQuestionsList({ entityId: id }),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setInKindAssessmentQuestions(data));
      },
      onError: () => {
        dispatch(setInKindAssessmentQuestions([]));
      }
    }
  );

  const btnLabel = inKindAssessmentQuestions?.questions?.length > 0 ? 'Update' : 'Prepare';
  const answerBtnLabel = inKindAssessmentQuestions?.assessmentConclusion ? 'Update Answer' : 'Answer';

  return (
    <>
      <Button variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
        {btnLabel} Assessment Questions
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setOpenAnswer(true)}
        sx={{ ml: 2 }}
        disabled={!inKindAssessmentQuestions?.questions?.length}
      >
        {answerBtnLabel} Assessment Questions
      </Button>
      {open && <InKindAssessmentAddQuestions open={open} onClose={() => setOpen(false)} refetch={refetch} />}
      {openAnswer && (
        <InKindAssessmentQuestionAnswer open={openAnswer} onClose={() => setOpenAnswer(false)} refetch={refetch} />
      )}
    </>
  );
}
