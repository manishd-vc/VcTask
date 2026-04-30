'use client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { NumericFormat } from 'react-number-format';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import * as yup from 'yup';
import ModalStyle from './dialog.style';

const validationSchema = yup.object({
  issuesQuantity: yup.number().when('itemIssuanceStatus', {
    is: (val) => val !== 'CANCELED',
    then: (schema) => schema.required('Issues Quantity is required').min(1, 'Must be at least 1'),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  actualValueOfInKind: yup.number().when('itemIssuanceStatus', {
    is: (val) => val !== 'CANCELED',
    then: (schema) => schema.required('Actual Value is required').min(0, 'Must be positive'),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  itemIssuanceStatus: yup.string().required('Item Issuance Status is required')
});

export default function EditInKindItemModal({ open, onClose, item, contributionId, refetch }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const dispatch = useDispatch();
  const { masterData } = useSelector((state) => state?.common);
  const statusOptions = getLabelObject(masterData, 'dpwf_contribution_item_issued_status');

  const formik = useFormik({
    initialValues: {
      issuesQuantity: item?.issuesQuantity || '',
      actualValueOfInKind: item?.actualValueOfInKind || '',
      itemIssuanceStatus: item?.itemIssuanceStatus || ''
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({
        contributionId,
        itemId: item?.id,
        payload: values
      });
    }
  });

  const { values, handleChange, handleSubmit, touched, errors, setFieldValue, setFieldTouched } = formik;

  const { mutate, isLoading } = useMutation(beneficiaryApi.updateInKindItem, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data?.message || 'Item updated successfully', variant: 'success' }));
      onClose();
      refetch?.();
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const isCanceledStatus = values.itemIssuanceStatus !== 'CANCELED';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogTitle variant="h5" color="primary.main" textTransform="uppercase">
            EDIT IN-KIND CONTRIBUTION
          </DialogTitle>
          <IconButton onClick={onClose} sx={style.closeModal}>
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ pt: 1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Item Code
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.itemCode || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Item Name
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.itemName || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Item Description
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.itemDescription || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Required Unit
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getLabelByCode(masterData, 'dpwf_contribution_required_unit', item?.requiredUnit) ||
                      item?.requiredUnit ||
                      '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Required Number
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.requiredNumber || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Unit Rate
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.unitRate || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Line Value
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.lineValue || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getLabelByCode(masterData, 'dpwf_contribution_category', item?.type) || item?.type || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Issues Quantity {isCanceledStatus ? '' : '*'}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="issuesQuantity"
                    type="number"
                    value={values.issuesQuantity}
                    onChange={handleChange}
                    error={touched.issuesQuantity && Boolean(errors.issuesQuantity)}
                    helperText={touched.issuesQuantity && errors.issuesQuantity}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Actual Value of InKind (AED) {isCanceledStatus ? '' : '*'}
                  </Typography>
                  <NumericFormat
                    fullWidth
                    variant="standard"
                    name="actualValueOfInKind"
                    value={values.actualValueOfInKind}
                    onValueChange={({ floatValue }) => setFieldValue('actualValueOfInKind', floatValue ?? '')}
                    error={touched.actualValueOfInKind && Boolean(errors.actualValueOfInKind)}
                    helperText={touched.actualValueOfInKind && errors.actualValueOfInKind}
                    customInput={TextField}
                    thousandSeparator
                    decimalScale={2}
                    valueIsNumericString
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Item Issuance Status *
                  </Typography>
                  <FormControl fullWidth error={touched.itemIssuanceStatus && Boolean(errors.itemIssuanceStatus)}>
                    <Select
                      variant="standard"
                      name="itemIssuanceStatus"
                      value={values.itemIssuanceStatus}
                      onChange={(e) => {
                        handleChange(e);
                        // Trigger validation for dependent fields when status changes
                        setFieldTouched('issuesQuantity', false);
                        setFieldTouched('actualValueOfInKind', false);
                      }}
                    >
                      {statusOptions?.values?.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} variant="outlined" type="button">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Save
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
