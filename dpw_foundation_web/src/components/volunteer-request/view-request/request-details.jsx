import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateShortMonth } from 'src/utils/formatTime';
import { enrolmentStatusColorSchema } from 'src/utils/util';

const FieldDisplay = ({ label, value, color, textTransform, gridProps = { xs: 12, sm: 6, md: 3 } }) => (
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

export default function RequestDetails({ data }) {
  const { masterData } = useSelector((state) => state?.common);
  const { status, createdOn, updatedOn, volunteerCampaign: { createdByName, updatedByName } = {} } = data ?? {};
  const statusLabel = getLabelByCode(masterData, 'dpwf_enrollment_status', status) || status;

  const getStatusColor = () => {
    if (status) {
      return enrolmentStatusColorSchema[status];
    }
    return undefined;
  };

  const requestDetails = [
    {
      label: 'Request Status',
      value: statusLabel,
      color: getStatusColor()
    },
    { label: 'Record Created By', value: createdByName },
    {
      label: 'Record Created On',
      value: createdOn ? fDateShortMonth(createdOn) : '-'
    },
    { label: 'Record Updated By', value: updatedByName },
    {
      label: 'Record Updated On',
      value: updatedOn ? fDateShortMonth(updatedOn) : '-'
    }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {requestDetails?.map((field) => (
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
  );
}
