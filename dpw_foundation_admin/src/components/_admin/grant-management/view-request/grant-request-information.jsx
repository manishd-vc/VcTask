import { Grid, Paper, Stack, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import DocumentsRowView from 'src/components/table/rows/DocumentsRowView';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

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

export default function GrantRequestInformation({ documentsList = [] }) {
  const { masterData } = useSelector((state) => state?.common);
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);

  const {
    projectBackground,
    requestedResource,
    assistanceType,
    amountRequested,
    amountGranted,
    currency,
    startDate,
    endDate,
    totalDuration,
    demography,
    receivedSupportBefore,
    previousSupportDetails,
    dpWorldEmployeeId,
    dpWorldContactName,
    dpWorldDesignation,
    dpWorldEmail,
    dpWorldMobile
  } = grantRequestData || {};

  const requestInformation = [
    {
      label: 'Request Source',
      value: requestedResource ? getLabelByCode(masterData, 'dpwf_grant_request_source', requestedResource) : '-'
    },
    {
      label: 'Type of Assistance Required',
      value: assistanceType ? getLabelByCode(masterData, 'dpwf_grant_assistance_required', assistanceType) : '-'
    },
    { label: 'Amount Requested', value: amountRequested },
    {
      label: 'Currency',
      value: currency ? getLabelByCode(masterData, 'dpw_foundation_currency', currency) : '-'
    },
    { label: 'Amount Granted', value: amountGranted },
    {
      label: ' Background or Details of Project for Which Financial Support Is Required',
      value: projectBackground,
      gridProps: { xs: 12 }
    }
  ];

  const proposedDetails = [
    { label: 'Start Date', value: startDate ? fDateWithLocale(startDate) : '-' },
    { label: 'End Date', value: endDate ? fDateWithLocale(endDate) : '-' },
    { label: 'Total Duration', value: totalDuration },
    { label: 'Demography', value: demography ? getLabelByCode(masterData, 'dpwf_grant_demography', demography) : '-' },
    {
      label: 'Is this grant seeker received any support before ? ',
      value: receivedSupportBefore ? 'Yes' : 'No',
      gridProps: { xs: 12 }
    },
    ...(receivedSupportBefore
      ? [
          {
            label: 'Details of Previous Support',
            value: previousSupportDetails,
            gridProps: { xs: 12 }
          }
        ]
      : [])
  ];

  const dpWorldContact = [
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
            Grant Request Details
          </Typography>
        </Grid>
        {requestInformation?.map((field) => (
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
            Proposed length of partnership/project
          </Typography>
        </Grid>
        {proposedDetails?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
        <Grid item xs={12}>
          <Typography
            variant="subtitle6"
            component="h4"
            textTransform={'uppercase'}
            color="primary.main"
            sx={{ pb: 3 }}
          >
            Support Documents
          </Typography>
          <DocumentsRowView rowData={documentsList} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Details of DP World Contact
          </Typography>
        </Grid>
        {dpWorldContact?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>
    </Paper>
  );
}
