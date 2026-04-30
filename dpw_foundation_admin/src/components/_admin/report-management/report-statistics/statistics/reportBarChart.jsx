'use client';
// mui
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BarChartComponent from './BarChartComponent';
/**
 * CampaignStatistics renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
ReportBarChart.propTypes = {
  fromDate: PropTypes.object,
  toDate: PropTypes.object,
  checked: PropTypes.bool
};

export default function ReportBarChart({ data }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
          Sector wise number of Projects
        </Typography>
        <BarChartComponent data={data} />
      </CardContent>
    </Card>
  );
}
