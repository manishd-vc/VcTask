import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import PartnerAssessmentAddQuestions from 'src/components/dialog/PartnerAssessmentAddQuestions';
import PartnerAssessmentQuestionAnswer from 'src/components/dialog/PartnerAssessmentQuestionAnswer';
import { setPartnerAssessmentQuestions, setPredefineQuestions } from 'src/redux/slices/partner';
import * as partnerApi from 'src/services/partner';

export default function AssessmentAddQuestion() {
  const [open, setOpen] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { partnerAssessmentQuestions } = useSelector((state) => state?.partner);
  const { refetch } = useQuery(
    'getPartnerAssessmentQuestions',
    () => partnerApi.getPartnerAssessmentQuestions({ entityId: id }),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setPartnerAssessmentQuestions(data));
      },
      onError: () => {
        dispatch(setPartnerAssessmentQuestions([]));
      }
    }
  );
  useQuery('getPartnerAssessmentPredefinedQuestions', () => partnerApi.getPartnerAssessmentPredefinedQuestions(), {
    onSuccess: (data) => {
      dispatch(setPredefineQuestions(data));
    }
  });

  const btnLabel = partnerAssessmentQuestions?.questions?.length > 0 ? 'Update' : 'Prepare';
  const answerBtnLabel = partnerAssessmentQuestions?.assessmentConclusion ? 'Update Answer' : 'Answer';

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
        disabled={!partnerAssessmentQuestions?.questions?.length}
      >
        {answerBtnLabel} Assessment Questions
      </Button>
      {open && <PartnerAssessmentAddQuestions open={open} onClose={() => setOpen(false)} refetch={refetch} />}
      {openAnswer && (
        <PartnerAssessmentQuestionAnswer open={openAnswer} onClose={() => setOpenAnswer(false)} refetch={refetch} />
      )}
    </>
  );
}
