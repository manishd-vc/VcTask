import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { fDateShortMonth } from 'src/utils/formatTime';

const VolunteerCampaignCancelDialog = ({ open, onClose, onSubmit, loading = false, campaignId }) => {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit({ reason: reason.trim() });
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const currentDate = fDateShortMonth(new Date());

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Cancel Request
      </DialogTitle>

      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Campaign ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignId || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Cancellation Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {currentDate || '-'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              minRows={4}
              variant="standard"
              name="reason"
              label={
                <>
                  Cancellation Reason{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={!reason.trim() && reason !== ''}
              helperText={!reason.trim() && reason !== '' ? 'Cancellation reason is required' : ''}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!reason.trim() || loading} sx={{ ml: 1 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VolunteerCampaignCancelDialog;
