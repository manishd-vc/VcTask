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
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import RejectForm from './assessment/rejectForm';

/**
 * IntentViewer Component
 *
 * Renders a dialog for viewing and managing donor pledge intents, allowing
 * the user to approve or reject intents with optional form submission.
 *
 * @param {object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.refetch - Function to refetch data after actions
 * @returns {JSX.Element} - Rendered IntentViewer component
 */
const IntentViewer = ({ open, onClose, refetch }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const router = useRouter();

  // Redux state
  const { getDonorAdminData } = useSelector((state) => state.donor);

  // Local state
  const [openRejectForm, setOpenRejectForm] = useState(false);

  // Determine if "Ask for further information" button should be displayed
  const showFormBtn =
    (!getDonorAdminData?.assessmentCompleted || getDonorAdminData?.assessmentCompleted === null) &&
    getDonorAdminData?.status === 'PLEDGE_APPROVED';

  // Mutation for approving/rejecting donation intents
  const { mutate, isLoading } = useMutation('donationStatusUpdate', api.donationStatusUpdate, {
    onSuccess: (response, types) => {
      dispatch(setToastMessage({ message: response.message, variant: 'success' }));
      if (types?.payload?.status === 'PLEDGE_REJECTED') {
        setOpenRejectForm(false);
        onClose();
        refetch();
      } else {
        router.push(`/admin/donor-admin/${getDonorAdminData?.id}/acceptance-letter`);
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
      router.push(`/admin/donor-admin/${getDonorAdminData?.id}/acceptance-letter`);
    } else {
      mutate({ id: getDonorAdminData?.id, payload: { status: 'PLEDGE_APPROVED' } });
    }
  };
  const handleCloseReject = () => setOpenRejectForm(false);
  const handleRejectForm = (values) => {
    mutate({
      id: getDonorAdminData?.id,
      payload: { status: 'PLEDGE_REJECTED', content: values?.reason }
    });
  };

  // Determines the button text based on the donor status
  const renderStatusBaseBtn = () => {
    return showFormBtn ? 'Move to the donor information' : 'Approve and move to the donor information';
  };
  const fCurrency = useCurrencyFormatter(getDonorAdminData?.donationCurrency);
  const isIndividual = getDonorAdminData?.donorType === 'Individual';
  return (
    <>
      {!openRejectForm ? (
        <Dialog open={open} onClose={onClose} maxWidth="xl">
          {/* Dialog Title */}
          <DialogTitle
            sx={{ textTransform: 'uppercase' }}
            id="customized-dialog-title"
            variant="h5"
            color="text.secondarydark"
          >
            Donation Pledge
          </DialogTitle>
          <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>

          {/* Dialog Content */}
          <DialogContent>
            <Grid container spacing={2} mb={4}>
              {/* Donor Details */}
              <Grid item xs={12} md={3}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Registered As
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getDonorAdminData?.donorType || '-'}
                  </Typography>
                </Stack>
              </Grid>
              {!isIndividual && (
                <>
                  <Grid item xs={12} md={3}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Organization Name
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {getDonorAdminData?.organizationName || '-'}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Organization Registration Number
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {getDonorAdminData?.orgRegistrationNum || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={3}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    {isIndividual ? 'First Name' : 'Organization Contact Person First Name'}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                    {getDonorAdminData?.firstName || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    {isIndividual ? 'Second Name' : 'Organization Contact Person Second Name'}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                    {getDonorAdminData?.lastName || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    {isIndividual ? 'Email ID' : 'Organization Contact Person Email ID'}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getDonorAdminData?.email || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    {isIndividual ? 'Phone Number' : 'Organization Contact Person Phone Number'}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getDonorAdminData?.contactNumber || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Typography variant="subHeaderLight" component="h5" color={'text.black'} sx={{ pb: 1.5 }}>
              Donation Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction="column" gap={0.5} mb={1}>
                  <Typography variant="body3" color="text.secondary">
                    Intent Description (Purpose of Donation)
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getDonorAdminData?.intentDescription || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Pledge Amount (AED)
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {(getDonorAdminData?.pledgeAmount && fCurrency(getDonorAdminData?.pledgeAmount)) || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>

          {/* Dialog Actions */}
          {getDonorAdminData?.assignTo && (
            <DialogActions>
              {!showFormBtn && (
                <Button onClick={onReject} variant="contained" color="error">
                  Reject
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
          donationPledgeId={getDonorAdminData?.donationPledgeId}
          open={openRejectForm}
          onClose={handleCloseReject}
          onSubmit={handleRejectForm}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
IntentViewer.propTypes = {
  // 'open' is a boolean indicating if the modal or viewer is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a function to handle closing the modal or viewer
  onClose: PropTypes.func.isRequired,

  // 'refetch' is a function to trigger a refetch of data
  refetch: PropTypes.func.isRequired
};

export default IntentViewer;
