import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as grantManagementApi from 'src/services/grantManagement';
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

export default function GrantApproverModal({ open, onClose, rowData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [findings, setFindings] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [amountGranted, setAmountGranted] = useState('');
  const [remarks, setRemarks] = useState('');

  const ApprovedDocStatus = ['IN_PROGRESS_DOC_HOD2', 'IN_PROGRESS_DOC_HOD1', 'IN_PROGRESS_LEGAL'];

  const { mutate, isLoading } = useMutation(grantManagementApi.grantCommonStatusUpdate, {
    onSuccess: async (response) => {
      router.push(`/admin/grant-request`);
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
      findings: rowData?.needAmountGranted ? null : findings,
      conclusion: rowData?.needAmountGranted ? null : conclusion,
      amountGranted: rowData?.needAmountGranted ? amountGranted : null,
      remarks: remarks ? remarks : null
    };
    mutate({ id: rowData?.id, payload });
  };

  const disabledButton = () => {
    if (rowData?.needAmountGranted) {
      if (amountGranted?.length === 0) return true;
    } else if (ApprovedDocStatus.includes(rowData?.status)) {
      if (remarks?.length === 0) return true;
    } else {
      if (findings?.length === 0) return true;
      if (conclusion?.length === 0) return true;
    }
    return false;
  };

  const renderContent = () => {
    if (rowData?.needAmountGranted) {
      return (
        <Grid item xs={12}>
          <NumericFormat
            label={
              <>
                Amount Granted{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            error={submitAttempted && (amountGranted?.length > 256 || amountGranted?.length === 0)}
            onValueChange={({ floatValue }) => {
              setAmountGranted(floatValue ?? '');
            }}
            value={amountGranted}
            customInput={TextField}
            thousandSeparator
            variant="standard"
            valueIsNumericString
            fullWidth
            helperText={getValidationHelperText(submitAttempted, amountGranted, 'amountGranted')}
          />
        </Grid>
      );
    } else if (ApprovedDocStatus.includes(rowData?.status)) {
      return (
        <Grid item xs={12}>
          <TextField
            variant="standard"
            label="Remarks"
            fullWidth
            inputProps={{ maxLength: 256 }}
            required
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            error={submitAttempted && (remarks?.length > 256 || remarks?.length === 0)}
            helperText={getValidationHelperText(submitAttempted, remarks, 'remarks')}
          />
        </Grid>
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
