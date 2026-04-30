import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerManagementApi from 'src/services/partner';
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

export default function PartnershipApproverModal({ open, onClose, rowData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [findings, setFindings] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [remarks, setRemarks] = useState('');
  const user = useSelector((state) => state?.user?.user);

  const ApprovedDocStatus = ['IN_PROGRESS_DOC_HOD2', 'IN_PROGRESS_DOC_HOD1'];

  const { mutate, isLoading } = useMutation(partnerManagementApi.partnerCommonStatusUpdate, {
    onSuccess: async (response) => {
      router.push(`/admin/partnership-request`);
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
      conclusion: conclusion ? conclusion : null,
      remarks: remarks ? remarks : null
    };
    mutate({ id: rowData?.id, payload });
  };
  const currentStageApprover = rowData?.documentApprovalStages?.find((stage) => stage.stageName === rowData?.status);
  const isCurrentUserApprover = currentStageApprover?.approverId === user?.userId;
  const disabledButton = () => {
    if (ApprovedDocStatus.includes(rowData?.status) || isCurrentUserApprover) {
      if (remarks?.length === 0) return true;
    } else if (rowData?.lastHod) {
      return false;
    } else {
      if (findings?.length === 0) return true;
      if (conclusion?.length === 0) return true;
    }
    return false;
  };

  const renderContent = () => {
    if (ApprovedDocStatus.includes(rowData?.status) || isCurrentUserApprover) {
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
    } else if (rowData?.lastHod) {
      return (
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondarydark" mb={2}>
            Are you sure you want to approve this Partnership request?
          </Typography>
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
