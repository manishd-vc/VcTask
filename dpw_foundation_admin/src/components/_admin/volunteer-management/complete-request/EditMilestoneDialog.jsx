'use client';
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
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  achievedNumber: Yup.number()
    .required('Achieved Number is required')
    .min(0, 'Achieved Number must be a positive number'),
  financialValueAchieved: Yup.number()
    .required('Financial Value of Achieved Number is required')
    .min(0, 'Financial Value must be a positive number')
});

export default function EditMilestoneDialog({ open, onClose, selectedMilestone, refetch, entityId }) {
  const dispatch = useDispatch();
  const theme = useTheme(); // Access Material-UI theme
  const style = ModalStyle(theme);

  const { mutate, isLoading } = useMutation(volunteerApi.updateVolunteerMilestone, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      refetch();
      onClose();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      onClose();
    }
  });

  const handleSubmit = async (values) => {
    const payload = {
      id: selectedMilestone?.id,
      achievedNumber: values?.achievedNumber,
      financialValueAchieved: values?.financialValueAchieved,
      resultPercentage: 0
    };

    mutate({ entityId: entityId, milestoneId: selectedMilestone?.id, payload });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Campaign Milestone
      </DialogTitle>

      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <Formik
        enableReinitialize
        initialValues={{
          achievedNumber: selectedMilestone?.achievedNumber || '',
          financialValueAchieved: selectedMilestone?.financialValueAchieved || ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <Form id="editMilestoneForm" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Display-only fields */}
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Milestone ID
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedMilestone?.milestoneUniqueId || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Milestone Description
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedMilestone?.milestoneDescription || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Unit
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedMilestone?.unit || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Target Number
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedMilestone?.targetNumber || '-'}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Editable fields */}
                <Grid item xs={6}>
                  <FieldWithSkeleton isLoading={isLoading} error={touched.achievedNumber && !!errors.achievedNumber}>
                    <TextField
                      id="achievedNumber"
                      variant="standard"
                      label={
                        <>
                          Achieved Number{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      type="number"
                      {...getFieldProps('achievedNumber')}
                      error={touched.achievedNumber && !!errors.achievedNumber}
                      helperText={touched.achievedNumber && errors.achievedNumber}
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched.financialValueAchieved && !!errors.financialValueAchieved}
                  >
                    <TextField
                      id="financialValueAchieved"
                      variant="standard"
                      label={
                        <>
                          Financial Value of Achieved Number{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      fullWidth
                      type="number"
                      {...getFieldProps('financialValueAchieved')}
                      error={touched.financialValueAchieved && !!errors.financialValueAchieved}
                      helperText={touched.financialValueAchieved && errors.financialValueAchieved}
                    />
                  </FieldWithSkeleton>
                </Grid>

                {/* Display-only result field */}
                <Grid item xs={6}>
                  <Stack>
                    <Typography variant="body3" color="text.secondary">
                      Result
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedMilestone?.resultPercentage !== null &&
                      selectedMilestone?.resultPercentage !== undefined &&
                      selectedMilestone?.resultPercentage !== ''
                        ? `${selectedMilestone.resultPercentage}%`
                        : '-'}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" color="primary" disabled={isLoading} loading={isLoading}>
                Save
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

EditMilestoneDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedMilestone: PropTypes.object,
  refetch: PropTypes.func,
  entityId: PropTypes.string
};
