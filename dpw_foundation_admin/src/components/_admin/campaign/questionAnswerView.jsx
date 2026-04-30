import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM } from 'src/utils/formatTime';

/**
 * Dynamic QuestionsAnswerView component
 *
 * @component
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Callback for closing the modal.
 * @param {object} questionSet - Object containing entityId and questions.
 */
const QuestionsAnswerView = ({ open, onClose, questionSet }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { questions } = questionSet;
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const { masterData } = useSelector((state) => state?.common);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textTransform: 'uppercase', paddingRight: { sm: 'auto', md: '60px' } }} color="primary.main">
        View Assessment Answers
      </DialogTitle>

      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Status
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(
                  masterData,
                  'dpw_foundation_donor_status',
                  getDonorAdminData?.donorPledgeResponse?.status
                )}{' '}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Assessor Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.updatedByName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Assessment Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {fDateM(getDonorAdminData?.updatedOn)}
              </Typography>
            </Stack>
          </Grid>

          {questions.map((q) => (
            <Grid item xs={12} key={q.id}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  {q.questionText}
                </Typography>

                {q.questionType === 'MULTISELECT' ||
                  (q.questionType === 'DROPDOWN' && (
                    <Box>
                      {(q.response ? q.response.split(', ') : []).map((answer) => (
                        <Typography key={q?.id} variant="subtitle4" color="text.secondarydark">
                          • {answer}
                        </Typography>
                      ))}
                      {(!q.response || q.response.trim() === '') && (
                        <Typography variant="subtitle4" color="text.secondarydark">
                          No answers selected
                        </Typography>
                      )}
                    </Box>
                  ))}

                {(q.questionType === 'RADIO' || q.questionType === 'SELECT' || q.questionType === 'CHECKBOX') && (
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {q.response || <span style={{ color: '#aaa' }}>No option selected</span>}
                  </Typography>
                )}

                {q.questionType === 'TEXT' ||
                  q.questionType === 'FREETEXT' ||
                  (q.questionType === 'TEXTAREA' && (
                    <>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {q.response || <span style={{ color: '#aaa' }}>No answer provided</span>}
                      </Typography>
                    </>
                  ))}
              </Stack>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle4" color="text.black" textTransform={'uppercase'}>
                Assessors Findings
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {questionSet?.assessmentFinding}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

QuestionsAnswerView.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  questionSet: PropTypes.shape({
    entityId: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        questionText: PropTypes.string.isRequired,
        questionType: PropTypes.string.isRequired,
        options: PropTypes.array
      })
    )
  }).isRequired
};

export default QuestionsAnswerView;
