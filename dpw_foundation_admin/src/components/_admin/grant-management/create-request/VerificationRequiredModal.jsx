import { Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from '@mui/material';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';

export default function VerificationRequiredModal({ open, onClose }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        VERIFICATION REQUIRED
      </DialogTitle>
      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          Identity Document has expired. Reverification is required to proceed.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
