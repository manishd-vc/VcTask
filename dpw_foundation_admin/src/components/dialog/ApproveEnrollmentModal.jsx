import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function ApproveEnrollmentModal({ onClose, open, enrollmentData }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate, isLoading } = useMutation(volunteerApi.approveVolunteerEnrollment, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      onClose();
      router.push(`/admin/all-enrollments`);
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const handleApprove = () => {
    const payload = {
      enrollmentId: enrollmentData?.id,
      status: 'approved',
      regretReason: ''
    };
    mutate(payload);
  };

  return (
    <Dialog aria-label="approve-enrollment" onClose={onClose} open={open} maxWidth={'sm'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Approve
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="body1" color="text.secondarydark" mb={2}>
          Are you sure you want to approve this Enrolment request?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlinedWhite" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton variant="contained" loading={isLoading} onClick={handleApprove}>
          Approve
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
