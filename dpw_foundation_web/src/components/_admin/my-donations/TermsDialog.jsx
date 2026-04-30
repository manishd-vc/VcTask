import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';

export default function TermsDialog({ open, onClose, onSubmit }) {
  const theme = useTheme(); // Use the theme hook to access the theme object (e.g., colors, typography)
  const style = ModalStyle(theme); // Apply the modal-specific styles based on the theme
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Terms & Conditions
      </DialogTitle>
      {/* Icon button to close the dialog */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" component="p">
          By making a donation through the DP World Foundation platform, you acknowledge and agree to the following:
        </Typography>
        <Typography component="ul" my={2} pl={3} color={'text.secondarydark'}>
          <Typography component="li">
            All donations are voluntary and non-refundable unless stated otherwise under specific campaign terms.
          </Typography>
          <Typography component="li">
            Your contribution will be allocated to the selected program or, if unspecified, to areas of highest need
            across our focus sectors (Health, Education, and Food).
          </Typography>
          <Typography component="li">
            The Foundation ensures that all funds are used transparently and in alignment with its humanitarian mission.
          </Typography>
          <Typography component="li">
            Your payment details will be processed securely and will not be stored by the Foundation.
          </Typography>
          <Typography component="li">
            You will receive an email confirmation and impact report related to your donation.
          </Typography>
        </Typography>
        <Typography variant="body1" color="text.secondarydark" component="p">
          We value your trust and are committed to ensuring that your generosity creates a lasting, measurable impact.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onSubmit} color="secondary" variant="contained">
          I AGREE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
