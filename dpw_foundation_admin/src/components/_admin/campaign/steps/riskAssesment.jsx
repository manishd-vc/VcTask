'use client';
import { Box, Paper, TableCell, TableRow, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import ReusableTable from 'src/components/table/ReusableTable';
import TableStyle from 'src/components/table/table.styles';

export default function RiskAssessment() {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const risksInvolved = campaignUpdateData?.risksInvolved;
  const theme = useTheme();
  const style = TableStyle(theme);
  const tableHeaders = [
    { label: 'Risk Code', key: 'riskCode' },
    { label: 'Risk Description', key: 'riskDescription' },
    { label: 'Severity', key: 'severity' },
    { label: 'Likelyhood', key: 'likelyhood' },
    { label: 'Risk Level', key: 'riskLevel' },
    { label: 'Control Measure/Remarks', key: 'controlMeasure' },
    { label: 'Assessment Done By', key: 'assessmentDoneBy' },
    { label: 'Assessment Status', key: 'assessmentStatus' }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" color="primary.main" mb={3} component="p">
        RISK ASSESSMENT
      </Typography>
      <ReusableTable headers={tableHeaders}>
        {risksInvolved?.map((row) => (
          <TableRow key={row?.id}>
            <TableCell>{row.riskCode || '-'}</TableCell>
            <TableCell>
              <Box sx={style.CellMaxWidth}>{row.riskDescription || '-'}</Box>
            </TableCell>
            <TableCell>{row.severity || '-'}</TableCell>
            <TableCell>{row.likelyhood || '-'}</TableCell>
            <TableCell>{row.riskLevel || '-'}</TableCell>
            <TableCell>
              <Box sx={style.CellMaxWidth}>{row.controlMeasure || '-'}</Box>
            </TableCell>
            <TableCell>{row.assessmentDoneBy || '-'}</TableCell>
            <TableCell>{row.assessmentStatus || '-'}</TableCell>
          </TableRow>
        ))}
      </ReusableTable>
    </Paper>
  );
}
