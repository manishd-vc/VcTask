import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as partnerManagementApi from 'src/services/partner';
import { fDateWithLocale } from 'src/utils/formatTime';

const renderAnswer = ({ response, questionType, responseFileName, downloadMediaFile }) => {
  if (questionType.toUpperCase() === 'RADIO' || questionType.toUpperCase() === 'CHECKBOX') {
    return response.split(',').join(', ');
  } else if (questionType.toUpperCase() === 'DATE') {
    return fDateWithLocale(response);
  } else if (questionType.toUpperCase() === 'FILE') {
    return responseFileName ? (
      <Box
        component="span"
        sx={{
          textDecoration: responseFileName ? 'underline' : 'none',
          cursor: responseFileName ? 'pointer' : 'default',
          fontWeight: 300
        }}
        onClick={(e) => downloadMediaFile(e, response)}
      >
        {responseFileName}
      </Box>
    ) : (
      '-'
    );
  } else {
    return response;
  }
};

export default function ViewAssessmentQuestions({ open, handleClose }) {
  const { id } = useParams();
  const dispatch = useDispatch();
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

  const { data: partnershipQuestions } = useQuery(['getPartnerAssessmentQuestions', id], () =>
    partnerManagementApi.getPartnerAssessmentQuestions({ entityId: id })
  );

  const theme = useTheme();
  const style = ModalStyle(theme);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
        View Assessment Questions
      </DialogTitle>
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          {partnershipQuestions?.questions?.map((question) => {
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
                    {renderAnswer({ response, questionType, responseFileName, downloadMediaFile })}
                  </Typography>
                  {secondAnswerType && (
                    <Typography variant="subtitle4" color="text.secondarydark" mt={1}>
                      {renderAnswer({
                        response: secondResponse,
                        questionType: secondAnswerType,
                        responseFileName: secondAnswerFileName,
                        downloadMediaFile
                      })}
                    </Typography>
                  )}
                  {thirdAnswerType && (
                    <Typography variant="subtitle4" color="text.secondarydark" mt={1}>
                      {renderAnswer({
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
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Assessor's Finding
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {partnershipQuestions?.assessmentFinding || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Assessor's Conclusion
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {partnershipQuestions?.assessmentConclusion || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
