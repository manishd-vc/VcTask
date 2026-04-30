import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as partnerApi from 'src/services/partner';
import { CloseIcon } from '../icons';
import RenderMultipleAnswer from '../renderMultipleAnswer';
import ModalStyle from './dialog.style';

export default function ViewPartnership({ open, onClose, status }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: partnershipResponse } = useQuery(
    'getPartnershipResponse',
    () => partnerApi.viewPartnershipResponse(id),
    {
      enabled: !!id
    }
  );

  const {
    agreementSignedArchived,
    deliverablesCompleted,
    financialObligationsMet,
    disputesUnresolvedIssues,
    disputesResolution,
    finalReviewMeetingConducted,
    performanceReviewConducted,
    keyOutcomesSummary,
    strategicObjectivesMet,
    objectivesBlockers,
    partnerFeedbackCollected,
    partnershipConclusionApprover,
    recommendFutureCollaboration,
    momAttachmentFileName,
    momAttachmentId,
    scoringSheetAttachmentId,
    scoringSheetFileName,
    feedbackAttachmentId,
    feedbackFileName,
    questions
  } = partnershipResponse || {};
  const booleanToYesNo = (value) => (value ? 'Yes' : 'No');

  const { mutate: downloadAllDocuments } = useMutation('downloadAllDocuments', api.downloadAllDocuments, {
    onSuccess: async (data) => {
      data?.forEach((file) => {
        const link = document.createElement('a');
        link.href = file?.preSignedUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  const downloadMediaFile = (event, fileId) => {
    event.preventDefault();
    const payload = {
      ids: [fileId]
    };
    downloadAllDocuments(payload);
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
        View {status === 'COMPLETE' ? 'complete' : 'terminate'} partnership
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Is the partnership agreement officially signed and archived?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(agreementSignedArchived)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Have all agreed-upon deliverables been completed?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(deliverablesCompleted)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Were all financial obligations met by both parties?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(financialObligationsMet)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Were there any disputes or unresolved issues?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(disputesUnresolvedIssues)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                If disputes exist, how were they resolved?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {disputesResolution || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Has a final review meeting been conducted with the partner?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(finalReviewMeetingConducted)}
              </Typography>
              {finalReviewMeetingConducted && (
                <Box component="span" onClick={(e) => downloadMediaFile(e, momAttachmentId)}>
                  <Typography variant="body2" color="text.secondarydark" sx={{ textDecoration: 'underline' }}>
                    {momAttachmentFileName}{' '}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Who approved the conclusion of this partnership?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {partnershipConclusionApprover || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Was a partnership performance review conducted internally?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(performanceReviewConducted)}
              </Typography>
              {performanceReviewConducted && (
                <Box component="span" onClick={(e) => downloadMediaFile(e, scoringSheetAttachmentId)}>
                  <Typography variant="body2" color="text.secondarydark" sx={{ textDecoration: 'underline' }}>
                    {scoringSheetFileName}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Please summarize the key outcomes of the partnership.
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {keyOutcomesSummary || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Did this partnership meet its strategic objectives?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(strategicObjectivesMet)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                If objectives weren’t fully met, what were the main blockers?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {objectivesBlockers || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Was feedback collected from the partner?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(partnerFeedbackCollected)}
              </Typography>
              {partnerFeedbackCollected && (
                <Box component="span" onClick={(e) => downloadMediaFile(e, feedbackAttachmentId)}>
                  <Typography variant="body2" color="text.secondarydark" sx={{ textDecoration: 'underline' }}>
                    {feedbackFileName}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Do you recommend future collaboration with this partner?
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {booleanToYesNo(recommendFutureCollaboration)}
              </Typography>
            </Stack>
          </Grid>
          {questions?.map((question) => {
            const {
              questionText,
              response,
              questionType,
              responseFileName,
              secondAnswerType,
              secondResponse,
              secondAnswerFileName,
              thirdAnswerType,
              thirdResponse,
              thirdAnswerFileName
            } = question || {};
            return (
              <Grid item xs={12} key={question?.id}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    {questionText}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {RenderMultipleAnswer({ response, questionType, responseFileName, downloadMediaFile })}
                  </Typography>
                  {secondAnswerType && (
                    <Typography variant="body2" color="text.secondarydark" sx={{ textDecoration: 'underline' }}>
                      {RenderMultipleAnswer({
                        response: secondResponse,
                        questionType: secondAnswerType,
                        responseFileName: secondAnswerFileName,
                        downloadMediaFile
                      })}
                    </Typography>
                  )}
                  {thirdAnswerType && (
                    <Typography variant="body2" color="text.secondarydark" sx={{ textDecoration: 'underline' }}>
                      {RenderMultipleAnswer({
                        response: thirdResponse,
                        questionType: thirdAnswerType,
                        responseFileName: thirdAnswerFileName,
                        downloadMediaFile
                      })}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
