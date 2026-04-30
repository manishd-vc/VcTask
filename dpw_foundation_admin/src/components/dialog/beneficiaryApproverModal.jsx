import { LoadingButton } from '@mui/lab';
import {
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

const getValidationHelperText = (submitAttempted, fieldValue, fieldName, maxLength = 256) => {
  if (!submitAttempted) return '';

  if (fieldValue?.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters`;
  }

  if (fieldValue?.length === 0) {
    return `${fieldName} is required`;
  }

  return '';
};

export default function BeneficiaryApproverModal({ open, onClose, rowData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [findings, setFindings] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [amountApproved, setAmountApproved] = useState('');

  const { mutate, isLoading } = useMutation(beneficiaryApi.updateInKindContributionStatus, {
    onSuccess: async (response) => {
      router.push(`/admin/in-kind-contribution-requests`);
      onClose();
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const handleApprove = () => {
    setSubmitAttempted(true);
    if (disabledButton()) return;

    const payload = {
      statusName: rowData?.status,
      status: 'approved',
      findings: findings ? findings : null,
      conclusion: conclusion ? conclusion : null
    };

    // Add amountApproved for mixed assistance requests
    if (rowData?.assistanceRequested === 'mixed' && rowData?.lastHod) {
      payload.amountApproved = amountApproved;
    }

    mutate({ entityId: rowData?.id, payload });
  };

  const disabledButton = () => {
    return rowData?.lastHod
      ? rowData?.assistanceRequested === 'mixed' && !amountApproved
      : findings?.length === 0 || conclusion?.length === 0;
  };

  const renderContent = () => {
    if (rowData?.lastHod) {
      return (
        <>
          {rowData?.assistanceRequested !== 'mixed' && rowData?.lastHod && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondarydark" mb={2}>
                Are you sure you want to approve this In-Kind Contribution request?
              </Typography>
            </Grid>
          )}
          {rowData?.assistanceRequested === 'mixed' && rowData?.lastHod && (
            <>
              <Grid item xs={12}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Estimated Value of Donation
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {rowData?.currency || ''} {rowData?.estimatedValueDonation || ''}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <NumericFormat
                  label="Approved Value of Donation"
                  variant="standard"
                  fullWidth
                  required
                  type="number"
                  value={amountApproved}
                  onValueChange={({ floatValue }) => setAmountApproved(floatValue ?? '')}
                  error={submitAttempted && !amountApproved}
                  helperText={submitAttempted && !amountApproved ? 'Approved value is required' : ''}
                  customInput={TextField}
                  valueIsNumericString
                />
              </Grid>
            </>
          )}
        </>
      );
    } else {
      return (
        <>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label="Assessor's Finding"
              fullWidth
              inputProps={{ maxLength: 256 }}
              required
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              error={submitAttempted && (findings?.length > 256 || findings?.length === 0)}
              helperText={getValidationHelperText(submitAttempted, findings, 'findings')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label="Assessor's Conclusion"
              fullWidth
              inputProps={{ maxLength: 256 }}
              required
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              error={submitAttempted && (conclusion?.length > 256 || conclusion?.length === 0)}
              helperText={getValidationHelperText(submitAttempted, conclusion, 'conclusion')}
            />
          </Grid>
        </>
      );
    }
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        Approve
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 1.5 }}>
        <Grid container spacing={2}>
          {renderContent()}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose} sx={{ color: 'text.primary' }}>
          Cancel
        </Button>
        <LoadingButton variant="contained" onClick={handleApprove} disabled={disabledButton()} loading={isLoading}>
          Approve
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
