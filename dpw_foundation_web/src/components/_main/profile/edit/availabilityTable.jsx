import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function AvailabilityTable() {
  const { values, setValues } = useFormikContext();
  const handleChange = (day, slot) => {
    setValues((prev) => {
      const existingDay = prev.availability.find((item) => item.day === day);

      if (existingDay) {
        const updatedTimeSlots = existingDay.timeSlots.includes(slot)
          ? existingDay.timeSlots.filter((s) => s !== slot)
          : [...existingDay.timeSlots, slot];

        return {
          ...prev,
          availability:
            updatedTimeSlots.length > 0
              ? prev.availability.map((item) => (item.day === day ? { ...item, timeSlots: updatedTimeSlots } : item))
              : prev.availability.filter((item) => item.day !== day)
        };
      } else {
        return { ...prev, availability: [...prev.availability, { day, timeSlots: [slot] }] };
      }
    });
  };

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ pb: 2 }}>
              <Typography variant="subtitle1">Days</Typography>
            </TableCell>
            <TableCell sx={{ pb: 2, textAlign: 'left', pl: 7 }} colSpan={4}>
              <Typography variant="subtitle1">Time</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((day) => {
            const selectedDay = values.availability.find((item) => item.day === day) || { timeSlots: [] };
            return (
              <TableRow key={day}>
                <TableCell>
                  <Typography variant="subtitle1">{day}</Typography>
                </TableCell>
                {timeSlots.map((slot) => (
                  <TableCell key={slot} align="center">
                    <Checkbox checked={selectedDay.timeSlots.includes(slot)} onChange={() => handleChange(day, slot)} />
                    {slot}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
