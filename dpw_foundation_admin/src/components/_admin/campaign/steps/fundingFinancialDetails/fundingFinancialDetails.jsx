import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { getLabelObject } from 'src/utils/extractLabelValues';
FundingFinancialDetails.propTypes = {
  // 'isLoading' is a boolean indicating whether data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean indicating whether the component is in edit mode
  isEdit: PropTypes.bool.isRequired
};

const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));
/**
 * FundingFinancialDetails component handles the rendering and logic for displaying and editing
 * the funding and financial details of a campaign.
 * It uses formik for form handling and accesses master data (e.g., project fund source and currency)
 * from the Redux store to display options.
 *
 * @param {boolean} isLoading - Indicates if the data is still loading.
 * @param {boolean} isEdit - Indicates if the form is in edit mode or not.
 *
 * @returns {JSX.Element} The rendered FundingFinancialDetails component.
 */
export default function FundingFinancialDetails({ isLoading, isEdit }) {
  // Accessing master data from Redux store
  const { masterData } = useSelector((state) => state?.common);

  // Using Formik's methods to manage form state
  const { touched, errors, getFieldProps, setFieldValue, values } = useFormikContext();

  // Getting label objects for project funding source and currency from master data
  const campaignProjectSource = getLabelObject(masterData, 'dpw_foundation_project_fund_source');
  const currency = getLabelObject(masterData, 'dpw_foundation_currency');

  // Component rendering logic goes here
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        {values?.campaignType === 'CHARITY' ? 'Project Funding Details' : 'Campaign Funding Details'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.campaignTargetRequired && errors.campaignTargetRequired}
          >
            <TextField
              id="campaignTargetRequired"
              label={
                <>
                  {values?.campaignType === 'CHARITY' ? 'Estimated Fund Required' : 'Estimated Expenses'}{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('campaignTargetRequired')}
              error={touched.campaignTargetRequired && Boolean(errors.campaignTargetRequired)}
              fullWidth
              variant="standard"
              onChange={(e) => {
                const value = e.target.value;
                if (!isNaN(value)) {
                  setFieldValue('campaignTargetRequired', Number(value)); // Store as a number
                }
              }}
              type="number"
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.campaignProjectSource && errors.campaignProjectSource}
          >
            <TextFieldSelect
              id="campaignProjectSource"
              label={
                <>
                  {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '}
                  Fund Source{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={campaignProjectSource?.values}
              error={Boolean(touched.campaignProjectSource && errors.campaignProjectSource)}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <FieldWithSkeleton
            isLoading={isLoading}
            error={touched.campaignTargetRequiredCurrency && errors.campaignTargetRequiredCurrency}
          >
            <TextFieldSelect
              id="campaignTargetRequiredCurrency"
              label={
                <>
                  Currency{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={currency?.values}
              error={Boolean(touched.campaignTargetRequiredCurrency && errors.campaignTargetRequiredCurrency)}
              disabled={!isEdit}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
    </Paper>
  );
}
