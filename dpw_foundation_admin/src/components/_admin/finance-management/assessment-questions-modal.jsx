import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { CloseIcon } from 'src/components/icons';
import * as api from 'src/services';

export default function AssessmentQuestionsModal({ open, onClose, entityId }) {
  const { data: assessmentData } = useQuery(
    ['financeAssessmentQuestions', entityId],
    () => api.getInKindContributionById(entityId),
    {
      enabled: !!entityId && open
    }
  );

  const { questions = [], assessmentFinding, assessmentConclusion } = assessmentData || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Assessment Questions</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {questions?.map((question, index) => (
            <Box key={question?.id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Q{index + 1}: {question?.questionText}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Answer: {question?.response || '-'}
              </Typography>
            </Box>
          ))}
          {assessmentFinding && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Assessment Finding:
              </Typography>
              <Typography variant="body2">{assessmentFinding}</Typography>
            </Box>
          )}
          {assessmentConclusion && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Assessment Conclusion:
              </Typography>
              <Typography variant="body2">{assessmentConclusion}</Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}