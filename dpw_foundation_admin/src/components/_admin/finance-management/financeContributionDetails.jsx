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
  const inKindContributionRequestData = useSelector((state) => state?.finance?.inKindContributionRequestData);
  const { masterData } = useSelector((state) => state?.common);

  const {
    requestResource,
    currency,
    assistanceRequested,
    requestTitle,
    requestDescription,
    requestNature,
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

  const requestFields = [
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
    },
    { label: 'Estimated Value of In Kind', value: estimatedValueInkind },
    { label: 'Estimated Value of Donation', value: estimatedValueDonation },
    {
      label: 'Frequency',
      value: frequency ? getLabelByCode(masterData, 'dpwf_contribution_frequency', frequency) : '-'
    },
    { label: 'Period From', value: periodFrom ? fDateWithLocale(periodFrom) : '-' },
    { label: 'Period To', value: periodTo ? fDateWithLocale(periodTo) : '-' }
  ];

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
                    <TableCell>Issues Quantity</TableCell>
                    <TableCell>Actual Value of InKind</TableCell>
                    <TableCell>Item Issuance Status</TableCell>
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
                      <TableCell>{item?.issuesQuantity || '-'}</TableCell>
                      <TableCell>{item?.actualValueOfInKind || '-'}</TableCell>
                      <TableCell>
                        {item?.itemIssuanceStatus
                          ? getLabelByCode(masterData, 'dpwf_contribution_item_issued_status', item?.itemIssuanceStatus)
                          : '-'}
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
