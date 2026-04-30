import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import { useParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { fDateWithLocale } from 'src/utils/formatTime';
import * as Yup from 'yup';
import DatePickers from '../datePicker';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import TextFieldSelect from '../TextFieldSelect';
import ModalStyle from './dialog.style';

export default function UpdateTaskSupervisor({ open, onClose, refetchCampaignApi, data }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const params = useParams();
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);

  const distributionStatus = getLabelObject(masterData, 'dpw_foundation_campaign_distribution_status');

  const validationSchema = () => {
    return Yup.object().shape({
      status: Yup.string().required('Status is required'),
      actualCompletionDate: Yup.string().when('status', {
        is: 'COMPLETED', // Direct comparison works fine
        then: (schema) => schema.required('Actual Completion Date is required'),
        otherwise: (schema) => schema.notRequired()
      })
    });
  };

  const { mutate, isLoading } = useMutation('updateTaskBySupervisor', api.updateTaskBySupervisor, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
      onClose();
      refetchCampaignApi();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  return (
    <Dialog
      aria-label="updateTarget"
      onClose={onClose}
      open={open}
      maxWidth="md"
      PaperProps={{
        sx: { ...style.datepickerPosition }
      }}
    >
      <DialogTitle
        sx={{ textTransform: 'uppercase', py: 2 }}
        id="customized-dialog-title"
        variant="h6"
        color="primary.main"
      >
        Update Campaign Targets
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          status: data?.status || '',
          actualCompletionDate: data?.actualCompletionDate || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload = {
            id: data?.id,
            ...values
          };
          mutate({ payload: payload, id: params.id });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, values, setFieldValue }) => {
          return (
            <Form id="fundSpendForm">
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Task Description
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {data?.taskDescription || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Assign To
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {data?.taskAssigneeId?.firstName + ' ' + data?.taskAssigneeId?.lastName || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Assign Date
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {(data?.assignedDate && fDateWithLocale(data?.assignedDate)) || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Target Completion Date
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {(data?.targetCompletionDate && fDateWithLocale(data?.targetCompletionDate)) || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
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
                        onChange={(e) => {
                          setFieldValue('status', e.target.value);
                          if (e.target.value === 'COMPLETED') {
                            const formattedValue = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
                            setFieldValue('actualCompletionDate', formattedValue);
                          } else {
                            setFieldValue('actualCompletionDate', null);
                          }
                        }}
                        value={values?.status}
                        itemsData={distributionStatus?.values}
                        error={Boolean(touched.status && errors.status)}
                        helperText={touched.status && errors.status}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  {values?.status === 'COMPLETED' && (
                    <Grid item xs={12} md={4} lg={4}>
                      <DatePickers
                        label={
                          <>
                            Actual Completion Date{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        inputFormat={'yyyy-MM-dd'}
                        onChange={(newFromDate) => {
                          if (newFromDate) {
                            // Ensure the value is a valid date before formatting
                            try {
                              const formattedValue = format(new Date(newFromDate), "yyyy-MM-dd'T'HH:mm:ss");
                              setFieldValue('actualCompletionDate', formattedValue);
                            } catch (error) {
                              console.error('Invalid date value:', error);
                              setFieldValue('actualCompletionDate', null);
                            }
                          } else {
                            setFieldValue('actualCompletionDate', null);
                          }
                        }}
                        value={values?.actualCompletionDate}
                        handleClear={() => {
                          setFieldValue('actualCompletionDate', null);
                        }}
                        error={Boolean(touched.actualCompletionDate && errors.actualCompletionDate)}
                        helperText={touched.actualCompletionDate && errors.actualCompletionDate}
                      />
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button variant="outlinedWhite" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  form="updateTarget" // The form to be submitted
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
