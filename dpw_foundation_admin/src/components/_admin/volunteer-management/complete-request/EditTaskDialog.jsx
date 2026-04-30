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
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';

import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { setToastMessage } from 'src/redux/slices/common';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
  actualCompletionDate: Yup.string().required('Actual Completion Date is required'),
  status: Yup.string().required('Status is required')
});

export default function EditTaskDialog({ open, onClose, selectedTask, refetch, entityId }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);

  // Get status options
  const filterOption = getLabelObject(masterData, 'dpwf_volunteer_req_task_status');
  const { mutate, isLoading } = useMutation(volunteerApi.updateVolunteerTask, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      refetch && refetch();
      onClose();
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
      onClose();
    }
  });

  const handleSubmit = async (values) => {
    const payload = {
      id: selectedTask?.id,
      actualCompletionDate: values?.actualCompletionDate,
      status: values?.status
    };

    mutate({ entityId: entityId, taskId: selectedTask?.id, payload });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
        Campaign Related Task
      </DialogTitle>

      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      <Formik
        enableReinitialize
        initialValues={{
          actualCompletionDate: selectedTask?.actualCompletionDate || '',
          status: selectedTask?.status || ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, setFieldValue }) => (
          <Form id="editTaskForm" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Display-only fields */}
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Task Description
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedTask?.taskDescription || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Assign To
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedTask?.taskAssigneeName || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Assign Date
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedTask?.assignedDate ? fDateWithLocale(selectedTask.assignedDate) : '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack flexDirection={'column'} gap={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Target Completion Date
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                      {selectedTask?.targetCompletionDate ? fDateWithLocale(selectedTask.targetCompletionDate) : '-'}
                    </Typography>
                  </Stack>
                </Grid>

                {/* Editable fields */}
                <Grid item xs={6}>
                  <FieldWithSkeleton
                    isLoading={isLoading}
                    error={touched.actualCompletionDate && !!errors.actualCompletionDate}
                  >
                    <DatePickers
                      label={
                        <>
                          Actual Completion Date{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      inputFormat="yyyy-MM-dd"
                      onChange={(value) =>
                        setFieldValue('actualCompletionDate', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)
                      }
                      handleClear={() => setFieldValue('actualCompletionDate', null)}
                      value={values.actualCompletionDate}
                      error={touched.actualCompletionDate && Boolean(errors.actualCompletionDate)}
                      helperText={touched.actualCompletionDate && errors.actualCompletionDate}
                      type="date"
                    />
                  </FieldWithSkeleton>
                </Grid>
                <Grid item xs={6}>
                  <FieldWithSkeleton isLoading={isLoading} error={touched.status && !!errors.status}>
                    <TextFieldSelect
                      id="status"
                      label={
                        <>
                          Status{' '}
                          <Box component="span" sx={{ color: 'error.main' }}>
                            *
                          </Box>
                        </>
                      }
                      getFieldProps={getFieldProps}
                      itemsData={filterOption?.values}
                      error={Boolean(touched.status && errors.status)}
                    />
                  </FieldWithSkeleton>
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

EditTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedTask: PropTypes.object,
  refetch: PropTypes.func,
  entityId: PropTypes.string
};
