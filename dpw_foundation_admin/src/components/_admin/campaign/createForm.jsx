'use client';
import { Box, Grid, Paper, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
// Lazy-loaded component for field with skeleton (loading state)
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

CreateForm.propTypes = {
  isEdit: PropTypes.bool // Validates 'isEdit' as an optional boolean
};
/**
 * CreateForm component renders a form for creating or editing a campaign.
 * It includes campaign type and campaign title fields with validation.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isEdit - Flag to indicate if the form is in edit mode
 *
 * @returns {JSX.Element} Rendered form component
 */
export default function CreateForm({ isEdit }) {
  const isLoading = false; // Placeholder for loading state (could be dynamically controlled)

  // Access formik context for handling form state and validation
  const { touched, errors, getFieldProps } = useFormikContext();

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Campaign Type Field */}
        {/* <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.campaignType && errors.campaignType}>
            <TextFieldSelect
              id="campaignType"
              label={
                <>
                  Select Type of Campaign{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={campaignType?.values} // Passing campaign types as available options
              errors={touched.campaignType && errors.campaignType}
              disabled={!isEdit || isEditMode} // Disable if not in edit mode or it's a new campaign
            />
          </FieldWithSkeleton>
        </Grid> */}

        {/* Campaign Title Field */}
        <Grid item xs={12} sm={6} lg={6}>
          <FieldWithSkeleton isLoading={isLoading} error={touched.campaignTitle && errors.campaignTitle}>
            <TextField
              id="campaignTitle"
              {...getFieldProps('campaignTitle')}
              variant="standard"
              label={
                <>
                  Campaign Name{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              error={touched.campaignTitle && Boolean(errors.campaignTitle)}
              fullWidth
              disabled={!isEdit} // Disable if not in edit mode
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </Paper>
  );
}
