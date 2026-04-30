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
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as Yup from 'yup';
import FieldWithSkeleton from '../FieldWithSkeleton';
import { CloseIcon } from '../icons';
import TextFieldSelect from '../TextFieldSelect';
import ModalStyle from './dialog.style';

export default function AddInKindItem({ open, onClose, inKindData, refetchCampaignApi }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const [isAdvanced, setIsAdvanced] = useState(true);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const inKindLocation = getLabelObject(masterData, 'dpw_foundation_campaign_item_location');
  const commonYesNo = getLabelObject(masterData, 'dpw_foundation_common_yes_no');

  const unitData = getLabelObject(masterData, 'dpw_foundation_campaign_inkind_unit');
  const typeData = getLabelObject(masterData, 'dpw_foundation_campaign_inkind_type');
  const params = useParams();

  const isData = Object.values(inKindData).length > 0;

  const { mutate, isLoading } = useMutation(
    'updateInKindItemBySupervisor',
    isData ? api.updateInKindItemBySupervisor : api.createInKindItemBySupervisor,
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data?.message, variant: 'success' }));
        refetchCampaignApi();
        onClose();
        refetchCampaignApi();
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const validationSchema = (isAdvanced) => {
    const commonFields = {
      inKindItemCode: Yup.string().required('In Kind Item Code is required'),
      inKindItem: Yup.string().required('In Kind Item is required'),
      inKindType: Yup.string().required('In Kind Type is required'),
      inKindItemDescription: Yup.string().required('In Kind Item Description is required'),
      inKindUnit: Yup.string().required('In Kind Unit is required'),
      contributionValue: Yup.string()
        .matches(/^[0-9 .]+$/, 'Only numbers are allowed')
        .required('Contribution Value is required')
    };
    let advance = {};
    if (isAdvanced) {
      advance = {
        location: Yup.string().required('Location is required'),
        storeManager: Yup.string().required('Store Manager is required')
      };
    }
    return Yup.object({
      ...commonFields,
      ...advance
    });
  };

  const handleSubmitFinal = (values) => {
    const payload = {
      ...values,
      id: isData ? inKindData?.id : '',
      availableInStore: values?.availableInStore || false,
      targetQuantity: !isData && '0'
    };
    mutate({ id: params?.id, payload: payload });
  };

  useEffect(() => {
    setIsAdvanced(inKindData?.availableInStore);
  }, [inKindData]);
  return (
    <Dialog aria-label="add-in-kind" onClose={onClose} open={open} maxWidth={'lg'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {isData ? 'EDIT IN KIND Item' : 'Add In KIND Item'}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <Formik
        enableReinitialize
        initialValues={{
          inKindItemCode: inKindData?.inKindItemCode || '',
          inKindItem: inKindData?.inKindItem || '',
          inKindType: inKindData?.inKindType || '',
          inKindItemDescription: inKindData?.inKindItemDescription || '',
          inKindUnit: inKindData?.inKindUnit || '',
          availableInStore: inKindData?.availableInStore || null,
          contributionValue: inKindData?.contributionValue || '',
          location: inKindData?.location || '',
          storeManager: inKindData?.storeManager || ''
        }}
        validationSchema={validationSchema(isAdvanced)}
        onSubmit={(values) => {
          handleSubmitFinal(values);
        }}
      >
        {({
          handleSubmit,
          getFieldProps,
          setFieldError,
          touched,
          errors,
          values,
          handleChange,
          handleBlur,
          setFieldValue
        }) => {
          return (
            <Form id="addInKindForm">
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="inKindItemCode"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Item Code{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('inKindItemCode')}
                        error={touched.inKindItemCode && !!errors.inKindItemCode}
                        helperText={touched.inKindItemCode && errors.inKindItemCode}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="inKindItem"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Item Name{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('inKindItem')}
                        error={touched.inKindItem && !!errors.inKindItem}
                        helperText={touched.inKindItem && errors.inKindItem}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextFieldSelect
                        id={`inKindType`}
                        label={
                          <>
                            Type{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        name={`inKindType`}
                        value={values.inKindType}
                        itemsData={typeData?.values || []}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.inKindType && !!errors.inKindType}
                        helperText={touched.inKindType && errors.inKindType}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="inKindItemDescription"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Item Description{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        {...getFieldProps('inKindItemDescription')}
                        error={touched.inKindItemDescription && !!errors.inKindItemDescription}
                        helperText={touched.inKindItemDescription && errors.inKindItemDescription}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextFieldSelect
                        id={`inKindUnit`}
                        label={
                          <>
                            Required Unit
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        name={`inKindUnit`}
                        value={values.inKindUnit}
                        itemsData={unitData?.values || []}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.inKindUnit && !!errors.inKindUnit}
                        helperText={touched.inKindUnit && errors.inKindUnit}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextFieldSelect
                        id="availableInStore"
                        label={
                          <>
                            Available in store{' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        value={values.availableInStore ? 'yes' : 'no' || ''}
                        onChange={(event) => {
                          setFieldValue('availableInStore', event.target.value === 'yes');
                          setIsAdvanced(event.target.value === 'yes');
                          if (event.target.value === 'yes') {
                            setFieldError('location', null);
                            setFieldError('storeManager', null);
                            setFieldValue('location', null);
                            setFieldValue('storeManager', null);
                          } else {
                            setFieldError('location', 'Location is required');
                            setFieldError('storeManager', 'Store Manager is required');
                          }
                        }}
                        itemsData={commonYesNo?.values}
                        error={Boolean(touched.availableInStore && errors.availableInStore)}
                        helperText={touched.availableInStore && errors.availableInStore}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                      <TextField
                        id="contributionValue"
                        variant="standard"
                        inputProps={{ maxLength: 256 }}
                        label={
                          <>
                            Contribution Value (AED){' '}
                            <Box component="span" sx={{ color: 'error.main' }}>
                              *
                            </Box>
                          </>
                        }
                        fullWidth
                        type="number"
                        {...getFieldProps('contributionValue')}
                        error={touched.contributionValue && !!errors.contributionValue}
                        helperText={touched.contributionValue && errors.contributionValue}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  {values?.availableInStore === true && (
                    <>
                      <Grid item xs={2} md={4} lg={4}>
                        <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                          <TextFieldSelect
                            id="location"
                            label={
                              <>
                                Select Location{' '}
                                <Box component="span" sx={{ color: 'error.main' }}>
                                  *
                                </Box>
                              </>
                            }
                            getFieldProps={getFieldProps}
                            itemsData={inKindLocation?.values}
                            error={Boolean(touched.location && errors.location)}
                            helperText={touched.location && errors.location}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                      <Grid item xs={2} md={4} lg={4}>
                        <FieldWithSkeleton isLoading={isLoading} error={touched && !!errors}>
                          <TextField
                            id="storeManager"
                            variant="standard"
                            inputProps={{ maxLength: 256 }}
                            label={
                              <>
                                Store Manager{' '}
                                <Box component="span" sx={{ color: 'error.main' }}>
                                  *
                                </Box>
                              </>
                            }
                            fullWidth
                            {...getFieldProps('storeManager')}
                            error={touched.storeManager && !!errors.storeManager}
                            helperText={touched.storeManager && errors.storeManager}
                          />
                        </FieldWithSkeleton>
                      </Grid>
                    </>
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
                  form="addInKindForm" // The form to be submitted
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
