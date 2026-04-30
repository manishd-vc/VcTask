import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getBeneficiaryStatus } from 'src/utils/getBeneficiaryStatus';
import { inKindContributionStatusColorSchema } from 'src/utils/util';

const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6, md: 3 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.primary"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function RequestDetails() {
  const inKindContributionRequestData = useSelector((state) => state?.finance?.inKindContributionRequestData);

  const {
    status,
    createdByName,
    createdOn,
    updatedByName,
    updatedOn,
    feedbackStatus,
    notes,
    rejectedOn,
    inkindItemStatus,
    cashPaymentStatus
  } = inKindContributionRequestData || {};
  const { masterData } = useSelector((state) => state?.common);
  const isFeedbackRequested = feedbackStatus === 'FEEDBACK_REQUESTED';
  const isRejectedFeedback = feedbackStatus === 'FEEDBACK_REQUESTED' && status === 'REJECTED';
  let statusColor;

  if (isRejectedFeedback) {
    statusColor = 'error';
  } else if (isFeedbackRequested) {
    statusColor = 'info';
  } else if (status) {
    statusColor = inKindContributionStatusColorSchema[status];
  } else {
    statusColor = undefined;
  }
  let inkindItemStatusColor;
  if (inkindItemStatus === 'Processed') {
    inkindItemStatusColor = 'success';
  } else if (inkindItemStatus) {
    inkindItemStatusColor = 'error';
  } else {
    inkindItemStatusColor = undefined;
  }

  const fields = [
    {
      label: 'Request Status',
      value: getBeneficiaryStatus(masterData, status, feedbackStatus),
      color: statusColor
    },
    { label: 'Record Created By', value: createdByName, textTransform: 'capitalize' },
    { label: 'Record Created On', value: createdOn ? fDateWithLocale(createdOn) : '-' },
    { label: 'Record Updated By', value: updatedByName, textTransform: 'capitalize' },
    { label: 'Record Updated On', value: updatedOn ? fDateWithLocale(updatedOn) : '-' },
    {
      label: 'In-Kind Item Status',
      value: inkindItemStatus,
      color: inkindItemStatusColor
    },
    { label: 'Cash Payment Status', value: cashPaymentStatus }
  ];

  const showRejectedBox = status === 'REJECTED';

  return (
    <>
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
      {showRejectedBox && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
          <Typography variant="subtitle2" color="white" sx={{ width: 1, display: 'block' }}>
            Rejection Reason | Rejection Date : {rejectedOn ? fDateWithLocale(rejectedOn) : '-'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="white">
            {notes || '-'}
          </Typography>
        </Paper>
      )}
    </>
  );
}
