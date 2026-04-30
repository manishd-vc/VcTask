'use client';
import { Box, Paper, Typography } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as myEnrolmentApi from 'src/services/myEnrolment';

import ActivityForm from './ActivityForm';
import ActivityTable from './ActivityTable';
import CampaignInfo from './CampaignInfo';
import TrackActivityHeader from './TrackActivityHeader';

export default function TrackActivity() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams?.get('status') || '';
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [searchKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [loggedHours, setLoggedHours] = useState([]);
  const [timeValidationError, setTimeValidationError] = useState('');

  // For total hours
  const { data: totalHoursData } = useQuery(
    ['statistics-total', enrollmentDetails?.userId, enrollmentDetails?.id],
    () => myEnrolmentApi.getStatistics(enrollmentDetails?.userId, enrollmentDetails?.id, 'total-hours'),
    {
      enabled: !!enrollmentDetails?.userId && !!enrollmentDetails?.id
    }
  );

  // For approved log hours
  const { data: approvedHoursData } = useQuery(
    ['statistics-approved', enrollmentDetails?.userId, enrollmentDetails?.id],
    () => myEnrolmentApi.getStatistics(enrollmentDetails?.userId, enrollmentDetails?.id, 'approved-log-hours'),
    {
      enabled: !!enrollmentDetails?.userId && !!enrollmentDetails?.id
    }
  );
  useQuery(['enrollmentDetails', id], () => myEnrolmentApi.getEnrollmentDetails(id), {
    enabled: !!id,
    onSuccess: (data) => setEnrollmentDetails(data?.data)
  });

  const { isLoading, refetch } = useQuery(
    ['loggedHours', id, searchKeyword, statusFromUrl, fromDate, toDate],
    () =>
      myEnrolmentApi.getLogActivityHoursPagination(id, {
        keyword: searchKeyword,
        statuses: statusFromUrl ? [statusFromUrl] : [],
        createdDate: {
          fromDate,
          toDate
        },
        datePattern: 'M/d/yyyy'
      }),
    {
      enabled: !!id,
      onSuccess: (data) => setLoggedHours(data?.data?.content || [])
    }
  );

  const { mutate: addLogHours } = useMutation(
    'addLogActivityHours',
    (payload) => myEnrolmentApi.addLogActivityHours(id, payload),
    {
      onSuccess: () => {
        dispatch(setToastMessage({ message: 'Log hours added successfully', variant: 'success' }));
        setSelectedDate(null);
        setSelectedMilestone('');
        setCheckInTime(null);
        setCheckOutTime(null);
        refetch();
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err.response?.data?.message || 'Failed to add log hours',
            variant: 'error'
          })
        );
      }
    }
  );

  const { mutate: exportData } = useMutation(
    'exportLogActivityHours',
    (payload) => myEnrolmentApi.exportLogActivityHours(id, payload),
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message, variant: 'success' }));
      }
    }
  );

  const validateTimes = (startTime, endTime) => {
    if (startTime && endTime && endTime <= startTime) {
      setTimeValidationError('End time must be greater than start time');
      return false;
    }
    setTimeValidationError('');
    return true;
  };

  const handleCheckInTimeChange = (time) => {
    setCheckInTime(time);
    validateTimes(time, checkOutTime);
  };

  const handleCheckOutTimeChange = (time) => {
    setCheckOutTime(time);
    validateTimes(checkInTime, time);
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return '00:00';
    const diff = Math.abs(endTime - startTime) / 36e5;
    const hours = Math.floor(diff);
    const minutes = Math.floor((diff - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDateForAPI = (date) => (date ? date.toISOString().split('T')[0] : '');
  const formatTimeForAPI = (time) => (time ? time.toTimeString().split(' ')[0].substring(0, 5) : '');

  const handleSubmit = () => {
    const formattedDate = formatDateForAPI(selectedDate);
    const payload = {
      milestoneID: selectedMilestone,
      checkInTime: `${formattedDate}T${formatTimeForAPI(checkInTime)}`,
      checkOutTime: `${formattedDate}T${formatTimeForAPI(checkOutTime)}`,
      logSource: 'website'
    };
    addLogHours(payload);
  };

  const handleSubmitWithValidation = () => {
    if (validateTimes(checkInTime, checkOutTime)) {
      handleSubmit();
    }
  };

  const handleExport = () => {
    exportData({
      keyword: searchKeyword,
      datePattern: 'M/d/yyyy'
    });
  };

  const getMinMaxDates = () => {
    if (!enrollmentDetails?.volunteerCampaign) return {};
    const startDate = enrollmentDetails.volunteerCampaign.startDateTime
      ? new Date(enrollmentDetails.volunteerCampaign.startDateTime)
      : null;
    const endDate = enrollmentDetails.volunteerCampaign.endDateTime
      ? new Date(enrollmentDetails.volunteerCampaign.endDateTime)
      : null;
    return { minDate: startDate, maxDate: endDate };
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

  return (
    <Box>
      <TrackActivityHeader />

      <Typography variant="h5" color="primary.main" sx={{ textTransform: 'uppercase', width: '100%', mb: 3 }}>
        TRACK ACTIVITY
      </Typography>

      {enrollmentDetails && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <CampaignInfo
            enrollmentDetails={enrollmentDetails}
            selectedDate={selectedDate}
            calculateActivityDay={calculateActivityDay}
            totalHours={totalHoursData?.data?.totalHours || '0'}
          />
          <ActivityForm
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedMilestone={selectedMilestone}
            setSelectedMilestone={setSelectedMilestone}
            checkInTime={checkInTime}
            setCheckInTime={setCheckInTime}
            checkOutTime={checkOutTime}
            setCheckOutTime={setCheckOutTime}
            enrollmentDetails={enrollmentDetails}
            getMinMaxDates={getMinMaxDates}
            calculateHours={calculateHours}
            totalHours={totalHoursData?.data?.totalHours || '0'}
            calculateActivityDay={calculateActivityDay}
            handleSubmit={handleSubmit}
            timeValidationError={timeValidationError}
            handleCheckInTimeChange={handleCheckInTimeChange}
            handleCheckOutTimeChange={handleCheckOutTimeChange}
            handleSubmitWithValidation={handleSubmitWithValidation}
          />
        </Paper>
      )}

      <ActivityTable
        loggedHours={loggedHours}
        isLoading={isLoading}
        totalApprovedHours={approvedHoursData?.data?.totalApprovedHours || 0}
        status={status}
        setStatus={setStatus}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        handleExport={handleExport}
        refetch={refetch}
      />
    </Box>
  );
}
