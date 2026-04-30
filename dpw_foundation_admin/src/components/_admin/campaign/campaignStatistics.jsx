'use client';
// mui
import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AverageDonation from './statistics/averageDonation';
import DonationChannel from './statistics/donationChannels';
import Filter from './statistics/filter';
import FundRaised from './statistics/fundraised';
import Geograhical from './statistics/geographical';
import Location from './statistics/location';
import New from './statistics/new';
import NoOfDonation from './statistics/noofdonation';
import Ongoing from './statistics/ongoing';
import Overall from './statistics/overall';
import TotalDonor from './statistics/totalDonor';
import Upcoming from './statistics/upcoming';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
CampaignStatistics.propTypes = {};

const type = 'FUNDCAMP';

export default function CampaignStatistics() {
  const checked = useSelector((state) => state.statistics.isAllStatistics);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  return (
    <Grid container spacing={3}>
      <Filter fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      <Overall fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          Fundraising Performance Metrics
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <FundRaised fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <NoOfDonation fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <AverageDonation fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          Donor Engagement & Behavior
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TotalDonor fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <New fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <DonationChannel fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Geograhical fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          other details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Ongoing fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Upcoming fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Location fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
    </Grid>
  );
}
