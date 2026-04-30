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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { CalendarIcon, TimerIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as logActivity from 'src/services/logActivity';
import { fDateWithLocale } from 'src/utils/formatTime';
import * as Yup from 'yup';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

const validationSchema = Yup.object({
  startTime: Yup.date().required('Activity start time is required'),
  endTime: Yup.date()
    .required('Activity end time is required')
    .min(Yup.ref('startTime'), 'End time must be greater than start time')
});

export default function ApproveLogHour({ onClose, open, enrolledId, approvalLogData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      startTime: approvalLogData?.checkInTime ? new Date(approvalLogData.checkInTime) : null,
      endTime: approvalLogData?.checkOutTime ? new Date(approvalLogData.checkOutTime) : null
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        milestoneID: approvalLogData?.volunteerMilestoneId,
        checkInTime: values.startTime,
        checkOutTime: values.endTime
      };
      mutate({ enrolledId, logHourId: approvalLogData?.id, payload });
    }
  });

  const { mutate, isLoading } = useMutation(
    ({ enrolledId, logHourId, payload }) => logActivity.approveLogActivity({ enrolledId, logHourId, payload }),
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        onClose();
        router.push(`/admin/all-enrollments`);
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      }
    }
  );

  // Calculate difference in hours
  const getHourDifference = () => {
    if (formik.values.startTime && formik.values.endTime) {
      const diffMs = formik.values.endTime - formik.values.startTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours.toFixed(2);
    }
    return '0.00';
  };

  return (
    <Dialog aria-label="approve-enrollment" onClose={onClose} open={open} maxWidth={'md'}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
          Confirm Logged Hours
        </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Approve the logged hours, or update them if needed.
          </Typography>

          {/* Date Section */}
          <Stack direction="row" alignItems="center" spacing={1} mt={3} mb={4}>
            <CalendarIcon />
            <Typography variant="body1" color="primary.main" fontWeight={'bold'}>
              {fDateWithLocale(approvalLogData?.checkInTime)}
            </Typography>
          </Stack>

          {/* Activity Time Section */}
          <Grid container spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="Activity Start Time"
                  value={formik.values.startTime}
                  onChange={(newValue) => formik.setFieldValue('startTime', newValue)}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      variant="standard"
                      {...params}
                      error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                      helperText={formik.touched.startTime && formik.errors.startTime}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="Activity End Time"
                  value={formik.values.endTime}
                  onChange={(newValue) => formik.setFieldValue('endTime', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      variant="standard"
                      error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                      helperText={formik.touched.endTime && formik.errors.endTime}
                    />
                  )}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={12} md={4}>
              <Stack spacing={1} justifyContent="center">
                <Typography variant="body3" color="text.secondary">
                  Total Hours
                </Typography>
                <Stack gap={2} flexDirection="row" alignItems="center">
                  <TimerIcon />
                  <Typography variant="subtitle4" component="h6" color="text.secondarydark">
                    {getHourDifference()}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlinedWhite" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton variant="contained" loading={isLoading} type="submit">
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
