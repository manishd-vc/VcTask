import { Dialog, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';

export default function ViewWaiverForm({ open, handleClose }) {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);

  const theme = useTheme();
  const style = ModalStyle(theme);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
        View Waiver Form
      </DialogTitle>
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent
        dangerouslySetInnerHTML={{
          __html: volunteerCampaignData?.waiverFormContent || ''
        }}
      />
    </Dialog>
  );
}
