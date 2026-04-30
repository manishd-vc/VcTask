'use client';
import { Card, CardContent, Typography } from '@mui/material';
import ReportSummarizedTable from 'src/components/table/ReportSummarizedTable';

const ReportSummaryTable = ({ data }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h7" color="primary.main" textTransform="uppercase" mb={2} component="h4">
          Summary Report
        </Typography>
        <ReportSummarizedTable data={data} />
      </CardContent>
    </Card>
  );
};

export default ReportSummaryTable;
