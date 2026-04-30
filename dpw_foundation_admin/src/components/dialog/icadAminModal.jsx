// ...your imports remain the same
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import DatePickers from '../datePicker';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

// Helper function to generate validation messages
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

export default function IcadAminModal({ open, onClose, singleRowData, refetch }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const { getDonorAdminData } = useSelector((state) => state.donor);

  const [iacadApproved, setIacadApproved] = useState(false);
  const [iacadPermitId, setIacadPermitId] = useState('');
  const [iacadRequestId, setIacadRequestId] = useState('');
  const [responseDate, setResponseDate] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (getDonorAdminData) {
      if (getDonorAdminData.iacadApproved === null) {
        setIacadApproved('true');
      } else {
        setIacadApproved(getDonorAdminData.iacadApproved);
      }
      setIacadPermitId(getDonorAdminData.iacadPermitId || '');
      setIacadRequestId(getDonorAdminData.iacadRequestId || '');
      setResponseDate(getDonorAdminData.iacadResponseDate || null);
    }
  }, [getDonorAdminData]);

  const { mutate } = useMutation(api.donationIcadApproval, {
    onSuccess: async (response) => {
      refetch();
      onClose();
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const handleChange = (event) => {
    setIacadApproved(event.target.value === 'true');
    setIacadPermitId('');
    setIacadRequestId('');
    setResponseDate(null);
  };

  const handleRequestUpdate = () => {
    setSubmitAttempted(true);
    if (disabledButton()) return;

    const payload = {
      iacadApproved,
      iacadPermitId: iacadApproved ? iacadPermitId : '',
      responseDate,
      iacadRequestId: !iacadApproved ? iacadRequestId : ''
    };
    mutate({ id: singleRowData?.id, payload });
  };
  /*
  // const disabledButton = () => {
  //   if (iacadApproved && !iacadPermitId) return true;
  //   if (!iacadApproved && !iacadRequestId) return true;
  //   if (!responseDate) return true;
  //   return false;
  // };
  */

  const disabledButton = () => {
    return (iacadApproved && !iacadPermitId) || (!iacadApproved && !iacadRequestId) || !responseDate;
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="md">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        Capture IACAD Response
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 1.5 }}>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          Please capture the IACAD response below:
        </Typography>
        {iacadApproved === undefined ? (
          <Typography variant="body2">Loading status…</Typography>
        ) : (
          <FormControl>
            <RadioGroup
              name="iacad-approved"
              value={iacadApproved?.toString() || 'true'}
              onChange={handleChange}
              sx={{ flexDirection: 'row', gap: 4, mb: 3 }}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label={
                  <Typography variant="body2" color="text.secondarydark">
                    Approved By IACAD
                  </Typography>
                }
                sx={{
                  '.MuiRadio-root': {
                    marginRight: 1 // removes space
                  }
                }}
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label={
                  <Typography variant="body2" color="text.secondarydark">
                    Rejected By IACAD
                  </Typography>
                }
                sx={{
                  '.MuiRadio-root': {
                    marginRight: 1 // removes space
                  }
                }}
              />
            </RadioGroup>
          </FormControl>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {iacadApproved === 'false' || !iacadApproved ? (
              <TextField
                variant="standard"
                label="Request ID"
                fullWidth
                inputProps={{ maxLength: 256 }}
                required
                value={iacadRequestId}
                onChange={(e) => setIacadRequestId(e.target.value)}
                error={submitAttempted && (iacadRequestId?.length > 256 || iacadRequestId?.length === 0)}
                helperText={getValidationHelperText(submitAttempted, iacadRequestId, 'Request ID')}
              />
            ) : (
              <TextField
                variant="standard"
                label="IACAD Permit Number"
                fullWidth
                inputProps={{ maxLength: 256 }}
                required
                value={iacadPermitId}
                onChange={(e) => setIacadPermitId(e.target.value)}
                error={submitAttempted && (iacadPermitId?.length > 256 || iacadPermitId?.length === 0)}
                helperText={getValidationHelperText(submitAttempted, iacadPermitId, 'Permit ID')}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePickers
              id="poDate"
              name="poDate"
              label={
                <>
                  Response Date
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputFormat="yyyy-MM-dd HH:mm"
              handleClear={() => setResponseDate(null)}
              onChange={(value) => setResponseDate(value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
              value={responseDate}
              maxDate={new Date()}
              minDate={new Date('2020-01-01')}
              type="date"
              error={submitAttempted && !responseDate}
              helperText={submitAttempted && !responseDate ? 'Response date is required' : ''}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose} sx={{ color: 'text.primary' }}>
          No
        </Button>
        <Button variant="contained" onClick={handleRequestUpdate} disabled={disabledButton()}>
          Update against donation request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
