import { Grid, Paper, Stack, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { volunteerCampaingStatusColorSchema } from 'src/utils/util';

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
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);

  const { masterData } = useSelector((state) => state?.common);

  const { status, createdByName, createdOn, updatedByName, updatedOn, notes } = volunteerCampaignData || {};

  let statusColor;

  if (status) {
    statusColor = volunteerCampaingStatusColorSchema[status];
  } else {
    statusColor = undefined;
  }
  const fields = [
    {
      label: 'Campaign Status',
      value: getLabelByCode(masterData, 'dpwf_volunteer_status', status),
      color: statusColor
    },
    { label: 'Record Created By', value: createdByName, textTransform: 'capitalize' },
    { label: 'Record Created On', value: createdOn ? fDateWithLocale(createdOn) : '-' },
    { label: 'Record Updated By', value: updatedByName, textTransform: 'capitalize' },
    { label: 'Record Updated On', value: updatedOn ? fDateWithLocale(updatedOn) : '-' }
  ];

  const rejectStatus = ['REJECTED', 'HOD_REJECTED', 'REJECTED_VOLUNTEER_REQUEST'];
  const showRejectionBox = rejectStatus.includes(status);
  const isCancelled = ['CANCELLED', 'CANCELED'].includes(status);
  const showCancelledBox = isCancelled;

  const rejectStatusDate = (date) => {
    return date ? fDateWithLocale(date) : '-';
  };

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
      {showRejectionBox && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
          <Typography variant="subtitle4" color="text.white">
            Rejection Reason | Rejection Date : {rejectStatusDate(updatedOn)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.white">
            {notes || '-'}
          </Typography>
        </Paper>
      )}
      {showCancelledBox && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.main' }}>
          <Typography variant="subtitle4" color="text.white" sx={{ width: 1, display: 'block' }}>
            Cancellation Reason | Cancellation Date : {updatedOn ? fDateWithLocale(updatedOn) : '-'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.white">
            {notes || '-'}
          </Typography>
        </Paper>
      )}
    </>
  );
}
