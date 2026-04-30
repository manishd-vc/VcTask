import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';
export default function VolunteerCampaignViewDetailsModal({ open, onClose, viewDetailsData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);

  const showCommonDetailsStatus = ['IN_PROGRESS_SECURITY', 'IN_PROGRESS_HOD1', 'IN_PROGRESS_HOD2'];

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        View details
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 1.5 }}>
        <Grid container spacing={2}>
          {showCommonDetailsStatus.includes(viewDetailsData?.stageName) && !viewDetailsData?.amountGranted && (
            <>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Assessor's Finding
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {viewDetailsData?.assessorFinding || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Assessor's Conclusion
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {viewDetailsData?.assessorConclusion || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
