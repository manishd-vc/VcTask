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

  const { status, createdByName, createdOn, updatedByName, updatedOn, rejectedReason, rejectedOn, feedbackStatus } =
    grantRequestData || {};

  // Extract nested ternary into independent statement
  const getStatusColor = () => {
    if (feedbackStatus === 'FEEDBACK_REQUESTED') {
      return 'info';
    }
    if (status) {
      return grantStatusColorSchema[status];
    }
    return undefined;
  };

  const fields = [
    {
      label: 'Request Status',
      value: getGrantStatus(masterData, status, feedbackStatus),
      color: getStatusColor()
    },
    { label: 'Record Created By', value: createdByName, textTransform: 'capitalize' },
    { label: 'Record Created On', value: createdOn ? fDateWithLocale(createdOn) : '-' },
    { label: 'Record Updated By', value: updatedByName, textTransform: 'capitalize' },
    { label: 'Record Updated On', value: updatedOn ? fDateWithLocale(updatedOn) : '-' }
  ];

  const isRejected = ['REJECTED', 'REJECTED_SEEKER', 'REJECTED_GRANT_REQUEST'];
  const showRejectedBox = isRejected.includes(status);

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {fields?.map((field) => (
            <FieldDisplay
              key={field?.label}
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
          <Typography variant="subtitle4" color="text.white" sx={{ width: 1, display: 'block' }}>
            Rejection Reason | Rejection Date : {rejectedOn ? fDateWithLocale(rejectedOn) : '-'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.white">
            {rejectedReason || '-'}
          </Typography>
        </Paper>
      )}
    </>
  );
}
