'use client';
// mui
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import DatePickers from 'src/components/datePicker';
import { getLocaleDateString } from 'src/utils/formatTime';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
Filter.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  setFromDate: PropTypes.func,
  setToDate: PropTypes.func
};

export default function Filter({ fromDate, toDate, setFromDate, setToDate }) {
  // Helper to get start and end of current year
  function getYearStartEnd() {
    const now = new Date();
    const year = now.getFullYear();
    return {
      from: new Date(year, 0, 1), // Jan 1
      to: new Date(year, 11, 31) // Dec 31
    };
  }

  useEffect(() => {
    if (!fromDate && !toDate) {
      const { from, to } = getYearStartEnd();
      setFromDate(from);
      setToDate(to);
    }
  }, [fromDate, toDate, setFromDate, setToDate]);

  const { from, to } = getYearStartEnd();

  return (
    <Grid item xs={12}>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item xs={12} sm={6} md={3}>
          <DatePickers
            label={'Select From Date'}
            inputFormat={getLocaleDateString(false)}
            onChange={(newFromDate) => {
              setFromDate(newFromDate);
              if (newFromDate) {
                setToDate(to);
              }
            }}
            value={fromDate}
            handleClear={() => {
              setFromDate(from);
              setToDate(to);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DatePickers
            label={'Select To Date'}
            inputFormat={getLocaleDateString(false)}
            onChange={setToDate}
            value={toDate}
            minDate={fromDate || from}
            disabled={!fromDate}
            handleClear={() => {
              setToDate(to);
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
