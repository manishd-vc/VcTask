import { Button, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import GrantAssessmentQuestionsModal from 'src/components/dialog/GrantAssessmentQuestionsModal';
import { setIsFilledAssessmentQuestion } from 'src/redux/slices/grant';
import * as grantManagementApi from 'src/services/grantManagement';

export default function GrantAssessmentQuestion() {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { isFilledAssessmentQuestion } = useSelector((state) => state?.grant);
  const dispatch = useDispatch();
  const { data: assessmentQuestion, refetch } = useQuery(
    ['getGrantAssessmentQuestion', id],
    () => grantManagementApi.getGrantAssessmentQuestion(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (data?.id && data?.id !== null) {
          dispatch(setIsFilledAssessmentQuestion(true));
        } else {
          dispatch(setIsFilledAssessmentQuestion(false));
        }
      }
    }
  );
  const buttonLabel = assessmentQuestion?.id ? 'Update Assessment Questions' : 'Answer Assessment Questions';

  return (
    <>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 2 }}>
        Assessment Questions
      </Typography>
      <Button variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      {open && (
        <GrantAssessmentQuestionsModal
          data={assessmentQuestion}
          open={open}
          onClose={() => setOpen(false)}
          refetch={refetch}
        />
      )}
      {!isFilledAssessmentQuestion && (
        <Typography color="error.main" sx={{ my: 2 }}>
          Please fill all the assessment questions
        </Typography>
      )}
    </>
  );
}
