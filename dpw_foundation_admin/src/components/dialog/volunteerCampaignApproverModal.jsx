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
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerManagementApi from 'src/services/volunteer';
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

export default function VolunteerCampaignApproverModal({ open, onClose, rowData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [findings, setFindings] = useState('');
  const [conclusion, setConclusion] = useState('');

  const { mutate, isLoading } = useMutation(volunteerManagementApi.volunteerCommonStatusUpdate, {
    onSuccess: async (response) => {
      router.push(`/admin/volunteer-campaigns`);
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
    mutate({ id: rowData?.id, payload });
  };
  const disabledButton = () => {
    if (rowData?.lastHod) {
      return false;
    } else {
      if (findings?.length === 0) return true;
      if (conclusion?.length === 0) return true;
    }
    return false;
  };

  const renderContent = () => {
    if (rowData?.lastHod) {
      return (
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondarydark" mb={2}>
            Are you sure you want to approve this Volunteer Campaign request?
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
