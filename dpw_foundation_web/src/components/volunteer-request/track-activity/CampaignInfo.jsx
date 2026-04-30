import { Stack, Typography } from '@mui/material';
import { CalendarIcon } from 'src/components/icons';
import { fDateShort } from 'src/utils/formatTime';

export default function CampaignInfo({ enrollmentDetails, selectedDate, calculateActivityDay, totalHours }) {
  if (!enrollmentDetails) return null;

  const safeDateFormat = (date) => {
    if (!date) return '-';
    try {
      return fDateShort(date);
    } catch {
      return '-';
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 3 }}>
      <Typography variant="h6" color="primary.main" sx={{ textTransform: 'uppercase' }}>
        {enrollmentDetails.volunteerCampaign?.volunteerCampaignTitle}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ minWidth: '150px' }}>
        <CalendarIcon />
        <Typography variant="body2" color="primary.main" sx={{ mb: 3 }}>
          {safeDateFormat(enrollmentDetails.volunteerCampaign?.startDateTime)} TO{' '}
          {safeDateFormat(enrollmentDetails.volunteerCampaign?.endDateTime)}
        </Typography>
      </Stack>
    </Stack>
  );
}
