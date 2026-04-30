'use client';
// mui
import { Grid, Paper } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { getModules } from 'src/services/moduleService';
import ReportModuleDropdown from './ReportModuleDropdown';
import DateFilter from './statistics/filter';
import ModuleStatistics from './statistics/moduleStatistics';

export default function ReportStatistics() {
  const [selectedModule, setSelectedModule] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const { data: modules = [], isLoading: loading } = useQuery('modules', getModules);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <HeaderBreadcrumbs admin heading="Statistics" />
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
      </Grid>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <ReportModuleDropdown
              loading={loading}
              modules={modules}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DateFilter fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
          </Grid>
        </Grid>
      </Paper>
      <ModuleStatistics fromDate={fromDate} toDate={toDate} selectedModule={selectedModule} modules={modules} />
    </>
  );
}
