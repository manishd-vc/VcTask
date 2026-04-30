import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import CommonStyle from 'src/components/common.styles';
import DatePickers from 'src/components/datePicker';
import { TimerIcon } from 'src/components/icons';
import TimePickers from 'src/components/timePicker';

export default function ActivityForm({
  selectedDate,
  setSelectedDate,
  selectedMilestone,
  setSelectedMilestone,
  checkInTime,
  setCheckInTime,
  checkOutTime,
  setCheckOutTime,
  enrollmentDetails,
  getMinMaxDates,
  calculateHours,
  totalHours,
  calculateActivityDay,
  handleSubmit,
  timeValidationError,
  handleCheckInTimeChange,
  handleCheckOutTimeChange,
  handleSubmitWithValidation
}) {
  const theme = useTheme();
  const style = CommonStyle(theme);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DatePickers
            label="Select Activity Date *"
            value={selectedDate}
            onChange={setSelectedDate}
            handleClear={() => setSelectedDate(null)}
            {...getMinMaxDates()}
          />
        </Grid>
        {selectedDate && (
          <>
            <Grid item xs={12} md={4}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Activity Day
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  Day {calculateActivityDay(selectedDate, enrollmentDetails.volunteerCampaign?.startDateTime) || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={0.5} justifyContent="center">
                <Typography variant="body3" color="text.secondary">
                  Total Hours
                </Typography>
                <Stack gap={2} flexDirection="row" alignItems="center">
                  <TimerIcon />
                  <Typography variant="subtitle4" component="h6" color="text.secondarydark">
                    {totalHours}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>

      {selectedDate && (
        <Stack mt={1}>
          <Box sx={style.documentCard}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Milestone Description *</InputLabel>
                  <Select
                    value={selectedMilestone}
                    variant="standard"
                    fullWidth
                    onChange={(e) => setSelectedMilestone(e.target.value)}
                    label="Milestone Description *"
                  >
                    {enrollmentDetails?.volunteerCampaign?.milestones?.map((milestone) => (
                      <MenuItem key={milestone.id} value={milestone.id}>
                        {milestone.milestoneDescription}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePickers
                  label="Activity Start Time"
                  value={checkInTime}
                  onChange={handleCheckInTimeChange}
                  handleClear={() => setCheckInTime(null)}
                  size="small"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePickers
                  label="Activity End Time"
                  value={checkOutTime}
                  onChange={handleCheckOutTimeChange}
                  handleClear={() => setCheckOutTime(null)}
                  size="small"
                  variant="standard"
                  error={!!timeValidationError}
                  helperText={timeValidationError}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1} justifyContent="center">
                  <Typography variant="body3" color="text.secondary">
                    Activity Hours
                  </Typography>
                  <Stack gap={2} flexDirection="row" alignItems="center">
                    <TimerIcon />
                    <Typography variant="subtitle4" component="h6" color="text.secondarydark">
                      {calculateHours(checkInTime, checkOutTime)} Hours
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button size="small" variant="outlined" onClick={() => setSelectedDate(null)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSubmitWithValidation}
                disabled={!selectedMilestone || !checkInTime || !checkOutTime || !!timeValidationError}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
}
