import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { fDateWithLocale } from 'src/utils/formatTime';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';
export default function PartnershipViewDetailsModal({ open, onClose, viewDetailsData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const fCurrency = useCurrencyFormatter('AED');

  const showCommonDetailsStatus = [
    'IN_PROGRESS_SECURITY',
    'IN_PROGRESS_HOD1',
    'IN_PROGRESS_COMPLIANCE',
    'IN_PROGRESS_HOD2'
  ];

  const showAmountGranted = ['IN_PROGRESS_HOD1', 'IN_PROGRESS_HOD2'];

  const getIacadApprovalStatus = (status, iacadApproved) => {
    if (status === 'REJECTED') {
      return 'Rejected By IACAD';
    }
    if (iacadApproved) {
      return 'Approved by IACAD';
    }
    return '-';
  };

  const renderDocApproveDetails = () => {
    if (viewDetailsData?.remarks) {
      return (
        <Grid item xs={12}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Remarks
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {viewDetailsData?.remarks}
            </Typography>
          </Stack>
        </Grid>
      );
    }
  };

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
          {viewDetailsData?.stageName === 'IN_PROGRESS_IACAD' && (
            <>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Is this request requires IACAD Approval ?
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getIacadApprovalStatus(viewDetailsData?.status, viewDetailsData?.iacadApproved)}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    {viewDetailsData?.status === 'REJECTED' ? 'IACAD Request ID' : 'IACAD Permit Number'}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {viewDetailsData?.status === 'REJECTED'
                      ? viewDetailsData?.iacadRequestId
                      : viewDetailsData?.iacadPermitId}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Response Date
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {(viewDetailsData?.iacadResponseDate && fDateWithLocale(viewDetailsData?.iacadResponseDate)) || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
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
          {showAmountGranted.includes(viewDetailsData?.stageName) && viewDetailsData?.amountGranted && (
            <Grid item xs={12}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Amount Granted
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {viewDetailsData?.amountGranted ? fCurrency(viewDetailsData?.amountGranted) : '-'}
                </Typography>
              </Stack>
            </Grid>
          )}
          {renderDocApproveDetails()}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
