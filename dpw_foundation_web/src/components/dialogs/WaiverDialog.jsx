import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import ModalStyle from '../dialog/dialog.style';
import { CloseIcon } from '../icons';

export default function WaiverDialog({ open, onClose, onAgree, templateData, agreeButtonText = 'I Agree' }) {
  const dialogTitle = 'Waiver form';
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme);
  const { volunteerEnrollmentData } = useSelector((state) => state?.profile);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        {dialogTitle}
      </DialogTitle>
      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Typography variant="body2">
          Thank you for volunteering to help with the DP World Foundation in{' '}
          {volunteerEnrollmentData?.volunteerCampaign?.volunteerCampaignTitle}. Please read, complete, and sign the
          following form to participate in this campaign.
        </Typography>
        <Typography
          variant="subtitle4"
          color="text.black"
          component="h4"
          textTransform={'uppercase'}
          sx={{ mb: 2, mt: 3 }}
        >
          VOLUNTEER INFORMATION
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {`${volunteerEnrollmentData?.firstName || ''} ${volunteerEnrollmentData?.lastName || ''}`.trim() || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Phone or email
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {volunteerEnrollmentData?.phoneNumber || volunteerEnrollmentData?.email || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Address
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {volunteerEnrollmentData?.homeAddress || '-'}
              </Typography>
              <Typography variant="body1" color="text.secondarydark">
                <i>
                  <small>(Optional if you would like us to contact you for future volunteer event)</small>
                </i>
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Typography
          variant="subtitle4"
          color="text.black"
          component="h4"
          textTransform={'uppercase'}
          sx={{ mb: 2, mt: 3 }}
        >
          EMERGENCY CONTACT INFORMATION
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {volunteerEnrollmentData?.emergencyContactName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {volunteerEnrollmentData?.emergencyContactNumber || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Relationship to Volunteer
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {volunteerEnrollmentData?.relationWithEmergencyContact || '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Typography
          variant="subtitle4"
          color="text.black"
          component="h4"
          textTransform={'uppercase'}
          sx={{ mb: 2, mt: 3 }}
        >
          VOLUNTEER AGREEMENT
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="body2">
              <div dangerouslySetInnerHTML={{ __html: templateData }} />
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      {agreeButtonText !== 'Close' && (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={onAgree} variant="contained">
            {agreeButtonText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
