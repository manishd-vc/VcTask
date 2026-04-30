import { Grid, Paper, Stack, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getGrantStatus } from 'src/utils/getGrantStatus';
import { grantStatusColorSchema } from 'src/utils/util';

const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6, md: 3 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle4"
        color="text.secondarydark"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function RequestDetails() {
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);

  const { masterData } = useSelector((state) => state?.common);

  const { status, createdByName, createdOn, updatedByName, updatedOn, feedbackStatus } = grantRequestData || {};
  const isFeedbackRequested = feedbackStatus === 'FEEDBACK_REQUESTED';
  let statusColor;

  if (isFeedbackRequested) {
    statusColor = 'info';
  } else if (status) {
    statusColor = grantStatusColorSchema[status];
  } else {
    statusColor = undefined;
  }
  const fields = [
    {
      label: 'Request Status',
      value: getGrantStatus(masterData, status, feedbackStatus),
      color: statusColor
    },
    { label: 'Record Created By', value: createdByName, textTransform: 'capitalize' },
    { label: 'Record Created On', value: createdOn ? fDateWithLocale(createdOn) : '-' },
    { label: 'Record Updated By', value: updatedByName, textTransform: 'capitalize' },
    { label: 'Record Updated On', value: updatedOn ? fDateWithLocale(updatedOn) : '-' },
    { label: 'Amount Requested', value: updatedByName },
    { label: 'Amount Granted', value: updatedByName },
    { label: 'Balance Fund', value: updatedByName },
    { label: 'Amount Disbursed', value: updatedByName },
    { label: 'Date & Time of Disbursment', value: updatedByName }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {fields?.map((field, index) => (
          <FieldDisplay
            key={`${field.label}-${field.value}`}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            color={field?.color}
          />
        ))}
      </Grid>
    </Paper>
  );
}
