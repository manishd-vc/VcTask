import {
  Button,
  CircularProgress,
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

// Custom components and utilities
import PropTypes from 'prop-types';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { fCurrency } from 'src/utils/formatNumber';
import { fDateWithLocale } from 'src/utils/formatTime';
import RejectForm from '../campaign/rejectForm';

/**
 * On Spot Intent Viewer Component
 *
 * Renders a dialog for viewing and managing donor pledge intents, allowing
 * the user to view intent.
 *
 * @param {object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.refetch - Function to refetch data after actions
 * @returns {JSX.Element} - Rendered IntentViewer component
 */
const OnSpotIntentViewer = ({ open, onClose, refetch }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const router = useRouter();

  // Redux state
  const { getOnSpotDonorData } = useSelector((state) => state.donor);
  // Local state
  const [openRejectForm, setOpenRejectForm] = useState(false);

  // Determine if "Ask for further information" button should be displayed
  const showFormBtn =
    (!getOnSpotDonorData?.assessmentCompleted || getOnSpotDonorData?.assessmentCompleted === null) &&
    getOnSpotDonorData?.status === 'PLEDGE_APPROVED';

  // Mutation for approving/rejecting donation intents
  const { mutate, isLoading } = useMutation('donationStatusUpdate', api.donationStatusUpdate, {
    onSuccess: (response, types) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      if (types?.type === 'reject') {
        setOpenRejectForm(false);
        onClose();
        refetch();
      } else {
        router.push(`/admin/donor-admin/${getOnSpotDonorData?.id}/acceptance-letter`);
      }
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  // Handlers for approving and rejecting intents
  const onReject = () => setOpenRejectForm(true);

  const onApprove = () => {
    if (showFormBtn) {
      router.push(`/admin/donor-admin/${getOnSpotDonorData?.id}/acceptance-letter`);
    } else {
      mutate({ id: getOnSpotDonorData?.id, payload: { status: 'PLEDGE_APPROVED' } });
    }
  };

  const handleCloseReject = () => setOpenRejectForm(false);

  const handleRejectForm = (values) => {
    mutate({
      id: getOnSpotDonorData?.id,
      payload: { status: 'PLEDGE_REJECTED', content: values?.reason }
    });
  };

  // Determines the button text based on the donor status
  const renderStatusBaseBtn = () => {
    return showFormBtn ? 'Ask for further donor information' : 'Approve and ask for further donor information';
  };

  return (
    <>
      {!openRejectForm ? (
        <Dialog
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: { maxWidth: '765px !important' }
          }}
        >
          {/* Dialog Title */}
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h5"
            color="text.secondarydark"
          >
            Pledge Intent Approval
          </DialogTitle>
          <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>

          {/* Dialog Content */}
          <DialogContent>
            <Grid container spacing={3}>
              {/* Donor Details */}
              {[
                { label: 'Donor Type', value: getOnSpotDonorData?.accountType },
                { label: 'Donor Name', value: `${getOnSpotDonorData?.firstName} ${getOnSpotDonorData?.lastName}` },
                {
                  label: 'Donation Amount',
                  value: getOnSpotDonorData?.donationAmount && fCurrency(getOnSpotDonorData?.donationAmount)
                },
                { label: 'Email ID', value: getOnSpotDonorData?.email },
                { label: 'Contact Number', value: getOnSpotDonorData?.contactNumber },
                { label: 'National ID', value: getOnSpotDonorData?.nationalId },
                { label: 'DOB', value: getOnSpotDonorData?.dob && fDateWithLocale(getOnSpotDonorData?.dob) }
              ].map(({ label, value }) => (
                <Grid item xs={12} md={4} key={`intent_view_${label}`}>
                  <Stack>
                    <Typography variant="body3" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {value || '-'}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </DialogContent>

          {/* Dialog Actions */}
          {getOnSpotDonorData?.assignTo && (
            <DialogActions>
              {!showFormBtn && (
                <Button onClick={onReject} variant="contained" color="error">
                  Reject Intent
                </Button>
              )}
              <Button onClick={onApprove} variant="contained" color="success">
                {isLoading ? <CircularProgress size={24} /> : renderStatusBaseBtn()}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      ) : (
        <RejectForm
          open={openRejectForm}
          onClose={handleCloseReject}
          onSubmit={handleRejectForm}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
OnSpotIntentViewer.propTypes = {
  // 'open' is a boolean indicating if the modal or viewer is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a function to handle closing the modal or viewer
  onClose: PropTypes.func.isRequired,

  // 'refetch' is a function to trigger a refetch of data
  refetch: PropTypes.func.isRequired
};

export default OnSpotIntentViewer;
