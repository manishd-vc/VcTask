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
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';

export default function DistributionModalView({ selectedDistribution, open, onClose }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        View Distribution
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Sector / Focus Area
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.distributionCategory}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Distribution Status
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                -
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Estimated Distribution Value
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.estimatedDistributionValue || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Target Beneficiary Description
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.beneficiaryType || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Type of Beneficiary
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.beneficiaryType || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                No. of Beneficiaries
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.targetBeneficiaryNo || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Actual Beneficiaries Benefited
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                -
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Estimated Distribution Start Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.distributionStartTime || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Actual Distribution Start Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                -
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Estimated Distribution End Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {selectedDistribution?.distributionEndTime || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Actual Distribution End Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                -
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlinedWhite" type="button" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form="emailCampaignForm" // The form to be submitted
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
