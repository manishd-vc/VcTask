'use client';
// mui
import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AverageDonation from './statistics/averageDonation';
import AverageProject from './statistics/averageProject';
import Filter from './statistics/filter';
import FundRaised from './statistics/fundraised';
import GeograhicalProject from './statistics/geographicalProjects';
import NoOfDonation from './statistics/noofdonation';
import OngoingProject from './statistics/ongoingProject';
import Project from './statistics/project';
import SectorWise from './statistics/sectorwise';

/**
 * ProjectStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
ProjectStatistics.propTypes = {};

const type = 'CHARITY';

export default function ProjectStatistics() {
  const checked = useSelector((state) => state.statistics.isAllStatistics);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  return (
    <Grid container spacing={3}>
      {/* <Overall fromDate={fromDate} toDate={toDate} type={type} checked={checked} /> */}
      <Filter fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          Project Status
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Project fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          Project Performance Metrics
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <FundRaised fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
        {/* FundRaised */}
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <NoOfDonation fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
        {/* NoOfDonation */}
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <AverageDonation fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <AverageProject fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          other details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <OngoingProject fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4}>
        <DonationChannel fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid> */}
      <Grid item xs={12} sm={6} md={4}>
        <GeograhicalProject fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
        {/* GeograhicalProject */}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <SectorWise fromDate={fromDate} toDate={toDate} type={type} checked={checked} />
      </Grid>
    </Grid>
  );
}
