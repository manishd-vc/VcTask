'use client';
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';

export default function ViewContactModal({ open, onClose, contactData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);

  if (!contactData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        VIEW CONTACT DETAIL
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Contact Person Email ID */}
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Contact Person Email ID
              </Typography>
              <Typography
                variant="subtitle4"
                component="p"
                display="flex"
                flexWrap="wrap"
                color="text.secondarydark"
                sx={{ wordBreak: 'break-word' }}
              >
                {contactData?.contactPersonEmail || contactData?.emailId || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Person Name */}
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Contact Person Name
              </Typography>
              <Typography
                variant="subtitle4"
                component="p"
                display="flex"
                flexWrap="wrap"
                color="text.secondarydark"
                sx={{ wordBreak: 'break-word' }}
              >
                {contactData?.contactPersonName || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Person Designation */}
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Contact Person Designation
              </Typography>
              <Typography
                variant="subtitle4"
                component="p"
                display="flex"
                flexWrap="wrap"
                color="text.secondarydark"
                sx={{ wordBreak: 'break-word' }}
              >
                {contactData?.contactPersonDesignation || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Person Phone Number */}
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Contact Person Phone Number
              </Typography>
              <Typography
                variant="subtitle4"
                component="p"
                display="flex"
                flexWrap="wrap"
                color="text.secondarydark"
                sx={{ wordBreak: 'break-word' }}
              >
                {contactData?.contactPhoneNumber || contactData?.phoneNumber || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Is Primary Contact */}
          <Grid item xs={12}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Is Primary Contact?
              </Typography>
              <Typography
                variant="subtitle4"
                component="p"
                display="flex"
                flexWrap="wrap"
                color="text.secondarydark"
                sx={{ wordBreak: 'break-word' }}
              >
                {contactData?.isPrimaryContact ? 'Yes' : 'No'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
