import { LoadingButton } from '@mui/lab';
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as grantManagementApi from 'src/services/grantManagement';
import DatePickers from '../datePicker';
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

export default function GrantIcadApprover({ open, onClose, singleRowData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const router = useRouter();
  const [iacadApproved, setIacadApproved] = useState(null);
  const [iacadRequestId, setIacadRequestId] = useState('');
  const [iacadPermitId, setIacadPermitId] = useState('');
  const [responseDate, setResponseDate] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const { mutate, isLoading: isUpdateLoading } = useMutation(grantManagementApi.grantCommonStatusUpdate, {
    onSuccess: async (response) => {
      router.push(`/admin/grant-request`);
      onClose();
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const { mutate: rejectGrantRequest, isLoading: isRejectLoading } = useMutation(
    grantManagementApi.rejectGrantRequest,
    {
      onSuccess: (data) => {
        router.push(`/admin/grant-request`);
        onClose();
        dispatch(setToastMessage({ message: data?.message, title: 'Request Rejected', variant: 'success' }));
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  const handleChange = (event) => {
    setIacadApproved(event.target.value === 'true');
    setIacadPermitId('');
    setIacadRequestId('');
    setResponseDate(null);
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (disabledButton()) return;

    if (iacadApproved) {
      const payload = {
        statusName: 'IN_PROGRESS_IACAD',
        status: 'approved',
        iacadApproved,
        iacadPermitId: iacadPermitId,
        responseDate,
        iacadRequestId: iacadRequestId
      };
      mutate({ id: singleRowData?.id, payload });
    } else {
      const payload = {
        iacadRequestId: iacadRequestId ?? null,
        approvalStatus: 'REJECTED',
        content: null,
        iacadResponseDate: responseDate
      };
      rejectGrantRequest({
        entityId: singleRowData?.id,
        payload
      });
    }
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

  const isLoading = isUpdateLoading || isRejectLoading;
  return (
    <Dialog onClose={onClose} open={open} maxWidth="md">
      <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
        Submit IACAD Response
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 1.5 }}>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          Is this request requires IACAD Approval ?
        </Typography>

        <FormControl>
          <RadioGroup
            name="iacad-approved"
            value={iacadApproved?.toString() || ''}
            onChange={handleChange}
            sx={{ flexDirection: 'row', gap: 4, mb: 3 }}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={
                <Typography variant="body2" color="text.secondarydark">
                  Approved by IACAD
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

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {!iacadApproved && iacadApproved !== null && (
              <TextField
                variant="standard"
                label="IACAD Request ID"
                fullWidth
                inputProps={{ maxLength: 256 }}
                required
                value={iacadRequestId}
                onChange={(e) => setIacadRequestId(e.target.value)}
                error={submitAttempted && (iacadRequestId?.length > 256 || iacadRequestId?.length === 0)}
                helperText={getValidationHelperText(submitAttempted, iacadRequestId, 'Request ID')}
              />
            )}
            {iacadApproved && (
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
        <LoadingButton variant="contained" onClick={handleSubmit} disabled={disabledButton()} loading={isLoading}>
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
