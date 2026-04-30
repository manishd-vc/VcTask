import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as logActivity from 'src/services/logActivity';
import AddLogForm from './AddLogForm';

const AddLogActivity = ({ id, enrollmentData, setRefetchTable, totalHours }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [timeValidationError, setTimeValidationError] = useState('');

  const { mutate: addLogHours } = useMutation(
    'addLogActivityHours',
    (payload) => logActivity.addLogActivityHours(id, payload),
    {
      onSuccess: () => {
        dispatch(setToastMessage({ message: 'Log hours added successfully', variant: 'success' }));
        setSelectedDate(null);
        setSelectedMilestone('');
        setCheckInTime(null);
        setCheckOutTime(null);
        setRefetchTable(true);
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err.response?.data?.message || 'Failed to add log hours',
            variant: 'error'
          })
        );
        setRefetchTable(false);
      }
    }
  );
  const getMinMaxDates = () => {
    if (!enrollmentData?.volunteerCampaign) return {};
    const startDate = enrollmentData.volunteerCampaign.startDateTime
      ? new Date(enrollmentData.volunteerCampaign.startDateTime)
      : null;
    const endDate = enrollmentData.volunteerCampaign.endDateTime
      ? new Date(enrollmentData.volunteerCampaign.endDateTime)
      : null;
    return { minDate: startDate, maxDate: endDate };
  };

  const handleCheckInTimeChange = (time) => {
    setCheckInTime(time);
    if (timeValidationError && time && checkOutTime && time < checkOutTime) {
      setTimeValidationError('');
    }
  };

  const handleCheckOutTimeChange = (time) => {
    setCheckOutTime(time);
    if (timeValidationError && checkInTime && time && checkInTime < time) {
      setTimeValidationError('');
    }
  };

  const handleSubmit = () => {
    setTimeValidationError('');

    if (checkInTime && checkOutTime && checkInTime >= checkOutTime) {
      setTimeValidationError('End time must be greater than start time');
      return;
    }

    const formattedDate = formatDateForAPI(selectedDate);
    const payload = {
      milestoneID: selectedMilestone,
      checkInTime: `${formattedDate}T${formatTimeForAPI(checkInTime)}`,
      checkOutTime: `${formattedDate}T${formatTimeForAPI(checkOutTime)}`,
      logSource: 'website'
    };
    addLogHours(payload);
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return '00:00';
    const diff = Math.abs(endTime - startTime) / 36e5;
    const hours = Math.floor(diff);
    const minutes = Math.floor((diff - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const calculateActivityDay = (selectedDate, campaignStartDate) => {
    if (!selectedDate || !campaignStartDate) return 1;
    const start = new Date(campaignStartDate);
    const selected = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    const diffTime = selected - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const formatDateForAPI = (date) => (date ? date.toISOString().split('T')[0] : '');
  const formatTimeForAPI = (time) => (time ? time.toTimeString().split(' ')[0].substring(0, 5) : '');

  return (
    <>
      <AddLogForm
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMilestone={selectedMilestone}
        setSelectedMilestone={setSelectedMilestone}
        checkInTime={checkInTime}
        setCheckInTime={handleCheckInTimeChange}
        checkOutTime={checkOutTime}
        setCheckOutTime={handleCheckOutTimeChange}
        enrollmentDetails={enrollmentData}
        getMinMaxDates={getMinMaxDates}
        calculateHours={calculateHours}
        handleSubmit={handleSubmit}
        calculateActivityDay={calculateActivityDay}
        totalHours={totalHours}
        timeValidationError={timeValidationError}
      />
    </>
  );
};

export default AddLogActivity;
