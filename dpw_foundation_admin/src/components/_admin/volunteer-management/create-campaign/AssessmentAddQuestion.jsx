import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import VolunteerAssessmentAddQuestions from 'src/components/dialog/VolunteerAssessmentAddQuestions';
import VolunteerAssessmentQuestionAnswer from 'src/components/dialog/VolunteerAssessmentQuestionAnswer';
import { setVolunteerAssessmentQuestions, setVolunteerPredefineAssessmentQuestions } from 'src/redux/slices/volunteer';
import * as volunteerApi from 'src/services/volunteer';

export default function AssessmentAddQuestion() {
  const [open, setOpen] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { volunteerAssessmentQuestions } = useSelector((state) => state?.volunteer);
  const { refetch } = useQuery(
    'getVolunteerAssessmentQuestions',
    () => volunteerApi.getVolunteerAssessmentQuestions({ entityId: id }),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setVolunteerAssessmentQuestions(data));
      },
      onError: () => {
        dispatch(setVolunteerAssessmentQuestions([]));
      }
    }
  );
  useQuery(
    'getVolunteerAssessmentPredefinedQuestions',
    () => volunteerApi.getVolunteerAssessmentPredefinedQuestions({ type: 'volunteer_campaign' }),
    {
      onSuccess: (data) => {
        dispatch(setVolunteerPredefineAssessmentQuestions(data));
      }
    }
  );

  const btnLabel = volunteerAssessmentQuestions?.questions?.length > 0 ? 'Update' : 'Prepare';
  const answerBtnLabel = volunteerAssessmentQuestions?.assessmentConclusion ? 'Update Answer' : 'Answer';

  return (
    <>
      <Button variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
        {btnLabel} Checklist Questions
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setOpenAnswer(true)}
        sx={{ ml: 2 }}
        disabled={!volunteerAssessmentQuestions?.questions?.length}
      >
        {answerBtnLabel} Checklist Questions
      </Button>
      {open && <VolunteerAssessmentAddQuestions open={open} onClose={() => setOpen(false)} refetch={refetch} />}
      {openAnswer && (
        <VolunteerAssessmentQuestionAnswer open={openAnswer} onClose={() => setOpenAnswer(false)} refetch={refetch} />
      )}
    </>
  );
}
