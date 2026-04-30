import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as partnerManagementApi from 'src/services/partner';
import { fDateM } from 'src/utils/formatTime';

export default function ViewPartnerReportDialog({ open, onClose, partnershipId, reportId }) {
  const dispatch = useDispatch();
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme); // Apply the modal-specific styles based on the theme

  const { data: report, isLoading } = useQuery(
    ['partnerReport', partnershipId, reportId],
    () => partnerManagementApi.getPartnerReportById(partnershipId, reportId),
    {
      enabled: open && !!partnershipId && !!reportId
    }
  );

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

  const { data: documents } = useQuery(
    ['partnerReportDocuments', partnershipId, reportId],
    () => partnerManagementApi.getPartnerReportDocuments(partnershipId, reportId),
    {
      enabled: open && !!partnershipId && !!reportId
    }
  );

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <LinearProgress />
      </Dialog>
    );
  }

  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
        View Partnership Report
      </DialogTitle>
      {/* Icon button to close the dialog */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Report Period From
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {report.reportPeriodFrom ? fDateM(report.reportPeriodFrom, true) : '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Report Period To
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {report.reportPeriodTo ? fDateM(report.reportPeriodTo, true) : '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Report Type
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {report.reportType || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Report Title
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {report.reportTitle || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Submission Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {report.submissionDate ? fDateM(report.submissionDate, true) : '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography component="h3" variant="body3" color="text.secondary">
                Report Summary
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {report.reportSummary || '-'}{' '}
              </Typography>
            </Stack>
          </Grid>

          {documents && documents.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Attachments
              </Typography>
              <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1}>
                {documents.map((document, index) => (
                  <Typography variant="subtitle4" color="text.secondarydark" key={document?.fileMetadataId}>
                    <Box
                      component="span"
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={(e) => downloadMediaFile(e, document?.fileMetadataId)}
                    >
                      {document?.fileName}
                    </Box>
                    {index < documents.length - 1 && ','}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
