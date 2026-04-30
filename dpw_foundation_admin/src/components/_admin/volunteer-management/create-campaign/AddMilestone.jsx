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
import { useFormikContext } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { CloseIcon } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
export default function AddMilestone({ open, onClose, milestones, editingMilestone = null }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { values, setFieldValue, touched, errors, handleChange, handleBlur } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const unitData = getLabelObject(masterData, 'dpwf_volunteer_unit');

  const isEditMode = !!editingMilestone;

  // Populate fields when editing
  React.useEffect(() => {
    if (editingMilestone) {
      setFieldValue('milestoneDescription', editingMilestone.milestoneDescription || '');
      setFieldValue('unit', editingMilestone.unit || '');
      setFieldValue('targetNumber', editingMilestone.targetNumber || '');
    } else {
      // Clear fields when adding new milestone
      setFieldValue('milestoneDescription', '');
      setFieldValue('unit', '');
      setFieldValue('targetNumber', '');
    }
  }, [editingMilestone, setFieldValue, open]);

  const handleSubmit = () => {
    if (isEditMode) {
      // Update existing milestone
      const updatedMilestones = values.milestones.map((milestone) =>
        milestone.id === editingMilestone.id
          ? {
              ...milestone,
              milestoneDescription: values.milestoneDescription,
              unit: values.unit,
              targetNumber: values.targetNumber
            }
          : milestone
      );
      setFieldValue('milestones', updatedMilestones);
    } else {
      // Add new milestone
      setFieldValue('milestones', [
        ...values.milestones,
        {
          id: values.milestones.length > 0 ? Math.max(...values.milestones.map((m) => m.id)) + 1 : 1,
          milestoneDescription: values.milestoneDescription,
          unit: values.unit,
          targetNumber: values.targetNumber
        }
      ]);
    }
    onClose();
  };

  const getTargetNumberError = () => {
    if (touched.targetNumber && errors.targetNumber) return errors.targetNumber;
    if (values.targetNumber && values.targetNumber.toString().length > 15)
      return 'Target number cannot exceed 15 digits';
    return '';
  };

  const hasTargetNumberError = () => {
    return (
      (touched.targetNumber && errors.targetNumber) ||
      (values.targetNumber && values.targetNumber.toString().length > 15)
    );
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      values.milestoneDescription &&
      values.milestoneDescription.trim() !== '' &&
      values.unit &&
      values.unit !== '' &&
      values.targetNumber > 0 &&
      values.targetNumber.toString().length <= 15
    );
  };

  return (
    <Dialog aria-label="add-milestone" onClose={onClose} open={open} maxWidth={'md'}>
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {isEditMode ? 'Edit campaign milestone' : 'Add campaign milestone'}
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.milestoneDescription && errors.milestoneDescription}>
              <TextField
                variant="standard"
                fullWidth
                label={
                  <>
                    Milestone Description{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                name="milestoneDescription"
                value={values.milestoneDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.milestoneDescription && errors.milestoneDescription}
                helperText={touched.milestoneDescription && errors.milestoneDescription}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.unit && errors.unit}>
              <TextFieldSelect
                id="unit"
                label={
                  <>
                    Unit{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                value={values?.unit}
                onChange={handleChange}
                name="unit"
                onBlur={handleBlur}
                itemsData={unitData?.values}
                error={touched.unit && errors.unit}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldWithSkeleton isLoading={false} error={touched.targetNumber && errors.targetNumber}>
              <TextField
                variant="standard"
                fullWidth
                label={
                  <>
                    Target Number{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                name="targetNumber"
                value={values.targetNumber}
                type="number"
                inputProps={{ maxLength: 15 }}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                    e.preventDefault();
                  }
                }}
                error={hasTargetNumberError()}
                helperText={getTargetNumberError()}
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
