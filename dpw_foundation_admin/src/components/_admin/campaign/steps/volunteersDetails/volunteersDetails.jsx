import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
/**
 * VolunteersDetails component to display and manage volunteering-related form fields.
 * It uses Formik for form handling and Redux to access common master data.
 *
 * @param {boolean} isLoading - Indicates if the form is in loading state.
 * @param {boolean} isEdit - Indicates if the form is in edit mode.
 * @param {function} setIsAdvanced - A callback to update the advanced state.
 *
 * @returns {JSX.Element} The rendered VolunteersDetails component.
 */
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

VolunteersDetails.propTypes = {
  // 'isLoading' is a boolean indicating if the data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'setIsAdvanced' is a function to set the advanced state
  setIsAdvanced: PropTypes.func.isRequired
};
export default function VolunteersDetails({ isLoading, isEdit, setIsAdvanced }) {
  // Accessing formik context for form handling
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();

  // Accessing common master data from Redux store
  const { masterData } = useSelector((state) => state?.common);

  // Extracting the common labels for 'yes' and 'no' options
  const commonLabels = getLabelObject(masterData, 'dpw_foundation_common_yes_no');

  // Additional logic for the component can go here
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Volunteering Requirement
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.isVolunteersRequired && errors.isVolunteersRequired}>
            <TextFieldSelect
              id="isVolunteersRequired"
              select
              label={
                <>
                  Volunteers Required?{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              value={values?.isVolunteersRequired ? 'yes' : 'no'}
              onChange={(event) => {
                if (event.target.value === 'yes') {
                  setFieldValue('noVolunteersRequired', '');
                  setFieldValue('volunteersRequiredDescriptions', '');
                }
                setFieldValue('isVolunteersRequired', event.target.value === 'yes');
                setIsAdvanced(event.target.value === 'yes');
              }}
              itemsData={commonLabels?.values}
              error={touched.isVolunteersRequired && errors.isVolunteersRequired}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        {values?.isVolunteersRequired && (
          <>
            <Grid item xs={12} md={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={touched.noVolunteersRequired && errors.noVolunteersRequired}
              >
                <TextField
                  id="noVolunteersRequired"
                  label={
                    <>
                      No of Target Volunteers{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  {...getFieldProps('noVolunteersRequired')}
                  error={touched.noVolunteersRequired && errors.noVolunteersRequired}
                  fullWidth
                  variant="standard"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(value)) {
                      setFieldValue('noVolunteersRequired', Number(value)); // Store as a number
                    }
                  }}
                  type="number"
                  disabled={!isEdit}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldWithSkeleton
                isLoading={isLoading}
                error={touched.volunteersRequiredDescriptions && errors.volunteersRequiredDescriptions}
              >
                <TextField
                  id="volunteersRequiredDescriptions"
                  {...getFieldProps('volunteersRequiredDescriptions')}
                  variant="standard"
                  label={
                    <>
                      Volunteers Description{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  error={touched.volunteersRequiredDescriptions && errors.volunteersRequiredDescriptions}
                  fullWidth
                  disabled={!isEdit}
                />
              </FieldWithSkeleton>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
