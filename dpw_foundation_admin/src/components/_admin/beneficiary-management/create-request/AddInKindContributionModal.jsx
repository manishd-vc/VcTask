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
import { useFormikContext } from 'formik';
import { useEffect, useMemo } from 'react';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';

export default function AddInKindContributionModal({ open, onClose, inKindItem }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { masterData } = useSelector((state) => state?.common);
  const unitData = getLabelObject(masterData, 'dpwf_contribution_required_unit');
  const categoryData = getLabelObject(masterData, 'dpwf_contribution_category');
  const { values, setFieldValue, touched, errors, handleChange, handleBlur } = useFormikContext();

  const isEditMode = !!inKindItem;

  // Calculate lineValue as derived value (no re-render)
  const lineValue = useMemo(() => {
    const requiredNumber = parseFloat(values.requiredNumber) || 0;
    const unitRate = parseFloat(values.unitRate) || 0;
    return requiredNumber * unitRate;
  }, [values.requiredNumber, values.unitRate]);

  useEffect(() => {
    if (inKindItem) {
      setFieldValue('itemCode', inKindItem.itemCode);
      setFieldValue('itemName', inKindItem.itemName);
      setFieldValue('itemDescription', inKindItem.itemDescription);
      setFieldValue('requiredUnit', inKindItem.requiredUnit);
      setFieldValue('requiredNumber', inKindItem.requiredNumber);
      setFieldValue('unitRate', inKindItem.unitRate);
      setFieldValue('type', inKindItem.type);
    } else {
      setFieldValue('itemCode', '');
      setFieldValue('itemName', '');
      setFieldValue('itemDescription', '');
      setFieldValue('requiredUnit', '');
      setFieldValue('requiredNumber', '');
      setFieldValue('unitRate', '');
      setFieldValue('type', '');
    }
  }, [inKindItem, setFieldValue]);

  const handleSubmit = () => {
    if (isEditMode) {
      const updatedContributionItems = values.contributionItems.map((contributionItem) =>
        contributionItem.id === inKindItem.id
          ? {
              ...contributionItem,
              itemCode: values.itemCode,
              itemName: values.itemName,
              itemDescription: values.itemDescription,
              requiredUnit: values.requiredUnit,
              requiredNumber: values.requiredNumber,
              unitRate: values.unitRate,
              lineValue: lineValue,
              type: values.type
            }
          : contributionItem
      );
      setFieldValue('contributionItems', updatedContributionItems);
    } else {
      setFieldValue('contributionItems', [
        ...values.contributionItems,
        {
          id: values.contributionItems.length > 0 ? Math.max(...values.contributionItems.map((m) => m.id)) + 1 : 1,
          itemCode: values.itemCode,
          itemName: values.itemName,
          itemDescription: values.itemDescription,
          requiredUnit: values.requiredUnit,
          requiredNumber: values.requiredNumber,
          unitRate: values.unitRate,
          lineValue: lineValue,
          type: values.type
        }
      ]);
    }
    onClose();
  };

  const isFormValid = () => {
    return values.itemCode && values.itemCode.trim() !== '' && values.itemName && values.itemName.trim() !== '';
  };

  return (
    <Dialog aria-label="add-in-kind-contribution" onClose={onClose} open={open} maxWidth={'md'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {isEditMode ? 'Edit in-kind contribution' : 'Add In-kind contribution'}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.itemCode && errors.itemCode}>
              <TextField
                variant="standard"
                fullWidth
                label={
                  <>
                    Item Code{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                name="itemCode"
                value={values.itemCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.itemCode && errors.itemCode}
                helperText={touched.itemCode && errors.itemCode}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.itemName && errors.itemName}>
              <TextField
                variant="standard"
                fullWidth
                label={
                  <>
                    Item Name{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                name="itemName"
                value={values.itemName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.itemName && errors.itemName}
                helperText={touched.itemName && errors.itemName}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.itemDescription && errors.itemDescription}>
              <TextField
                variant="standard"
                fullWidth
                label="Item Description"
                name="itemDescription"
                value={values.itemDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.itemDescription && errors.itemDescription}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.requiredUnit && errors.requiredUnit}>
              <TextFieldSelect
                id="requiredUnit"
                label="Required Unit"
                value={values?.requiredUnit}
                onChange={handleChange}
                name="requiredUnit"
                onBlur={handleBlur}
                itemsData={unitData?.values}
                error={touched.requiredUnit && errors.requiredUnit}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldWithSkeleton isLoading={false}>
              <NumericFormat
                label="Required Number"
                onValueChange={({ floatValue }) => {
                  setFieldValue('requiredNumber', floatValue ?? '');
                }}
                value={values?.requiredNumber}
                customInput={TextField}
                thousandSeparator
                variant="standard"
                valueIsNumericString
                fullWidth
                error={touched.requiredNumber && errors.requiredNumber}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldWithSkeleton isLoading={false} error={touched.unitRate && errors.unitRate}>
              <NumericFormat
                label="Unit Rate"
                onValueChange={({ floatValue }) => {
                  setFieldValue('unitRate', floatValue ?? '');
                }}
                value={values?.unitRate}
                customInput={TextField}
                thousandSeparator
                variant="standard"
                valueIsNumericString
                fullWidth
                error={touched.unitRate && errors.unitRate}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Line Value
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {lineValue || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.type && errors.type}>
              <TextFieldSelect
                id="type"
                label="Category"
                value={values?.type}
                onChange={handleChange}
                name="type"
                onBlur={handleBlur}
                itemsData={categoryData?.values}
                error={touched.type && errors.type}
              />
            </FieldWithSkeleton>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid()}>
          {isEditMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
