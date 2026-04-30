import { Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import SupportDocuments from './support-documents';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function ContributionRequestForm() {
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  const { masterData } = useSelector((state) => state?.common);

  const {
    requestResource,
    currency,
    assistanceRequested,
    requestTitle,
    requestDescription,
    requestNature,
    expectedDateContribution,
    estimatedValueInkind,
    estimatedValueDonation,
    frequency,
    periodFrom,
    periodTo,
    contributionItems,
    dpWorldEmployeeId,
    dpWorldContactName,
    dpWorldDesignation,
    dpWorldEmail,
    dpWorldMobile
  } = inKindContributionRequestData || {};

  const baseFields = [
    {
      label: 'Request Source',
      value: requestResource ? getLabelByCode(masterData, 'dpwf_contribution_req_source', requestResource) : '-'
    },
    {
      label: 'Currency',
      value: currency ? getLabelByCode(masterData, 'dpw_foundation_currency', currency) : '-'
    },
    {
      label: 'Type of Assistance Required',
      value: assistanceRequested
        ? getLabelByCode(masterData, 'dpwf_contribution_assistance_requested', assistanceRequested)
        : '-'
    },
    { label: 'Request Title', value: requestTitle },
    { label: 'Request Description', value: requestDescription, gridProps: { xs: 12 } },
    {
      label: 'Request Nature',
      value: requestNature ? getLabelByCode(masterData, 'dpwf_contribution_req_nature', requestNature) : '-'
    }
  ];

  const getConditionalFields = () => {
    const conditionalFields = [];

    // Helper function to add common fields
    const addCommonFields = () => {
      conditionalFields.push({ label: 'Estimated Value of In Kind', value: estimatedValueInkind });
      if (assistanceRequested === 'mixed') {
        conditionalFields.push({
          label: 'Estimated Value of Donation',
          value: estimatedValueDonation
        });
      }
    };

    // Helper function to add period fields
    const addPeriodFields = () => {
      conditionalFields.push(
        { label: 'Period From', value: periodFrom ? fDateWithLocale(periodFrom) : '-' },
        { label: 'Period To', value: periodTo ? fDateWithLocale(periodTo) : '-' }
      );
    };

    // Field configurations by request nature
    const fieldConfigs = {
      'one-off': () => {
        addCommonFields();
        conditionalFields.push({
          label: 'Expected Date of Contribution',
          value: expectedDateContribution ? fDateWithLocale(expectedDateContribution) : '-'
        });
      },
      'fixed-period': () => {
        addCommonFields();
        addPeriodFields();
      },
      recurring: () => {
        addCommonFields();
        conditionalFields.push({
          label: 'Frequency',
          value: frequency ? getLabelByCode(masterData, 'dpwf_contribution_frequency', frequency) : '-'
        });
        addPeriodFields();
      }
    };

    const configFunction = fieldConfigs[requestNature];
    if (configFunction) {
      configFunction();
    }

    return conditionalFields;
  };

  const requestFields = [...baseFields, ...getConditionalFields()];

  const dpWorldContactFields = [
    { label: 'Employee ID', value: dpWorldEmployeeId },
    { label: 'Name', value: dpWorldContactName, textTransform: 'capitalize' },
    { label: 'Designation', value: dpWorldDesignation, textTransform: 'capitalize' },
    { label: 'Email ID', value: dpWorldEmail },
    { label: 'Phone Number', value: dpWorldMobile }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            In Kind Contribution Request Form
          </Typography>
        </Grid>
        {requestFields?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            In-Kind Contributions
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {contributionItems?.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Item Description</TableCell>
                    <TableCell>Required Units</TableCell>
                    <TableCell>Required Numbers</TableCell>
                    <TableCell>Unit Rate</TableCell>
                    <TableCell>Line Value</TableCell>
                    <TableCell>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contributionItems?.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>{item?.itemCode || '-'}</TableCell>
                      <TableCell>{item?.itemName || '-'}</TableCell>
                      <TableCell>{item?.itemDescription || '-'}</TableCell>
                      <TableCell>
                        {item?.requiredUnit
                          ? getLabelByCode(masterData, 'dpwf_contribution_required_unit', item?.requiredUnit)
                          : '-'}
                      </TableCell>
                      <TableCell>{item?.requiredNumber || '-'}</TableCell>
                      <TableCell>{item?.unitRate || '-'}</TableCell>
                      <TableCell>{item?.lineValue || '-'}</TableCell>
                      <TableCell>
                        {item?.type ? getLabelByCode(masterData, 'dpwf_contribution_category', item?.type) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography color="secondary.darker">No Contribution Items</Typography>
          )}
        </Grid>
        <SupportDocuments />
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            DP World Contact
          </Typography>
        </Grid>
        {dpWorldContactFields?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
          />
        ))}
      </Grid>
    </Paper>
  );
}
