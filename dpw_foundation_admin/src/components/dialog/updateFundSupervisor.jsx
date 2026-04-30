import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
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

export default function UpdateFundSupervisor({ open, onClose, refetchCampaignApi, data }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const params = useParams();
  const dispatch = useDispatch();

  const validationSchema = () => {
    return Yup.object().shape({
      actualFundSpend: Yup.number().typeError('Must be a valid number').required('Actual fund spend is required'),
      fundUtilizationDescription: Yup.string().required('Fund utilization description is required')
    });
  };

  const { mutate, isLoading } = useMutation(
    'updateActualSpendFundBySupervisor',
    api.updateActualSpendFundBySupervisor,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
        onClose();
        refetchCampaignApi();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  return (
    <Dialog aria-label="projectDistributions" onClose={onClose} open={open} maxWidth={'sm'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        Update Fund spend
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          actualFundSpend: data?.fundsSpent || '',
          fundUtilizationDescription: data?.fundUtilizationDescription || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          mutate({ payload: values, id: params.id });
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => {
          return (
            <Form id="fundSpendForm">
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="actualFundSpend"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Actual Fund Spend{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('actualFundSpend')}
                        error={touched.actualFundSpend && !!errors.actualFundSpend}
                        helperText={touched.actualFundSpend && errors.actualFundSpend}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="fundUtilizationDescription"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Fund Utilization Description{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('fundUtilizationDescription')}
                        error={Boolean(touched.fundUtilizationDescription && errors.fundUtilizationDescription)}
                        helperText={touched.fundUtilizationDescription && errors.fundUtilizationDescription}
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
                  form="fundSpendForm" // The form to be submitted
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
