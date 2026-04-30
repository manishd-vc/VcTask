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
import { useParams } from 'next/navigation';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as Yup from 'yup';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function UpdateTargetSupervisor({ open, onClose, refetchCampaignApi, data }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const params = useParams();
  const dispatch = useDispatch();

  const validationSchema = () => {
    return Yup.object().shape({
      achievedNumber: Yup.number().typeError('Must be a valid number').required('Actual fund spend is required'),
      achievedValue: Yup.number().typeError('Must be a valid number').required('Actual fund spend is required'),
      remarks: Yup.string().required('Result is required')
    });
  };

  const { mutate, isLoading } = useMutation('updateTargetsBySupervisor', api.updateTargetsBySupervisor, {
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
          achievedNumber: data?.achievedNumber || '',
          achievedValue: data?.achievedValue || '',
          remarks: data?.remarks || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload = {
            id: data?.id,
            successRate: 0,
            ...values
          };
          mutate({ payload: payload, id: params.id });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => {
          return (
            <Form id="fundSpendForm">
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Task Description
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {data?.targetDescription}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Unit
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {data?.targetUnit}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="column" gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Target Number
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {data?.targetNumber}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="achievedNumber"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Achieved Number{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('achievedNumber')}
                        error={touched.achievedNumber && !!errors.achievedNumber}
                        helperText={touched.achievedNumber && errors.achievedNumber}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="achievedValue"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Value of Achieved Number{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('achievedValue')}
                        error={Boolean(touched.achievedValue && errors.achievedValue)}
                        helperText={touched.achievedValue && errors.achievedValue}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="remarks"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Remarks{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('remarks')}
                        error={Boolean(touched.remarks && errors.remarks)}
                        helperText={touched.remarks && errors.remarks}
                      />
                    </FieldWithSkeleton>
                  </Grid>
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
