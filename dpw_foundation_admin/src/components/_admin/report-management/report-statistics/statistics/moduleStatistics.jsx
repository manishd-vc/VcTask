'use client';
// mui
import { Grid, Typography } from '@mui/material';
import ReportBarChart from './reportBarChart';
import ReportPieChart from './reportPieChart';
import ReportSummaryTable from './reportSummaryTable';

const data = [
  {
    Sector: 'Health',
    'Not yet Started': 1,
    'On-going': 2,
    Completed: 3
  },
  {
    Sector: 'Education',
    'Not yet Started': 2,
    'On-going': 4,
    Completed: 2
  },
  {
    Sector: 'Food',
    'Not yet Started': 3,
    'On-going': 3,
    Completed: 4
  },
  {
    Sector: 'Other (if any)',
    'Not yet Started': 1,
    'On-going': 1,
    Completed: 2
  }
];
export default function ModuleStatistics({ selectedModule, modules }) {
  const selectedModuleName = modules?.find((module) => module?.id === selectedModule)?.name || 'No Module Selected';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.main" textTransform="uppercase" component="h4">
          {selectedModuleName}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} lg={12} xl={12}>
        <ReportSummaryTable data={data} />
      </Grid>
      <Grid item xs={12} sm={12} lg={12} xl={12}>
        <ReportBarChart data={data} />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <ReportPieChart data={data} />
      </Grid>
    </Grid>
  );
}
