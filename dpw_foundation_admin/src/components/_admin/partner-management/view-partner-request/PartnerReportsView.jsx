'use client';
import { Box, Grid, IconButton, Paper, TableCell, TableRow, Tooltip, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { ViewIcon } from 'src/components/icons';
import Table from 'src/components/table/table';
import TableStyle from 'src/components/table/table.styles';
import { setToastMessage } from 'src/redux/slices/common';
import * as partnerManagementApi from 'src/services/partner';
import { fDateShortMonth } from 'src/utils/formatTime';
import ViewPartnerReportDialog from './ViewPartnerReportDialog';

// Read-only row component with view action
function PartnerReportsViewRow({ row, onView }) {
  const theme = useTheme();
  const style = TableStyle(theme);
  return (
    <TableRow hover key={row?.id}>
      <TableCell>{row?.reportPeriodFrom ? fDateShortMonth(row.reportPeriodFrom, true) : '-'}</TableCell>
      <TableCell>{row?.reportPeriodTo ? fDateShortMonth(row.reportPeriodTo, true) : '-'}</TableCell>
      <TableCell>{row?.reportType || '-'}</TableCell>
      <TableCell>
        <Box component="span" sx={{ ...style.textTurncate }}>
          {row?.reportTitle || '-'}
        </Box>
      </TableCell>
      <TableCell>{row?.submissionDate ? fDateShortMonth(row.submissionDate, true) : '-'}</TableCell>
      <TableCell>
        <Tooltip title="View" arrow>
          <IconButton size="small" onClick={() => onView && onView(row)}>
            <ViewIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default function PartnerReportsView({ partnershipId }) {
  const dispatch = useDispatch();
  const [openViewReport, setOpenViewReport] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [tableRows, setTableRows] = useState({
    count: 0,
    data: [],
    totalElements: 0
  });

  const { isLoading: reportsLoading } = useQuery(
    ['partnerReports', partnershipId],
    () => partnerManagementApi.getPartnerReports(partnershipId),
    {
      enabled: !!partnershipId,
      onSuccess: (data) => {
        const rows = data?.data?.content || [];
        const count = data?.data?.totalPages || 0;
        const totalElements = data?.data?.totalElements || 0;
        setTableRows({
          count,
          data: rows,
          totalElements
        });
      },
      onError: (err) => {
        setTableRows({
          count: 0,
          data: [],
          totalElements: 0
        });
        dispatch(
          setToastMessage({ message: err?.response?.data?.message || 'Failed to load reports', variant: 'error' })
        );
      }
    }
  );

  const tableHeadData = [
    { id: 'reportPeriodFrom', label: 'Report Period From' },
    { id: 'reportPeriodTo', label: 'Report Period To' },
    { id: 'reportType', label: 'Report Type' },
    { id: 'reportTitle', label: 'Report Title' },
    { id: 'submissionDate', label: 'Submission Date' },
    { id: 'actions', label: 'Actions' }
  ];

  const handleViewReport = (report) => {
    setViewingReport(report);
    setOpenViewReport(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewReport(false);
    setViewingReport(null);
  };

  const { mutate: exportReports } = useMutation(
    ({ partnershipId, type }) => partnerManagementApi.exportPartnerReports({ partnershipId, type }),
    {
      onSuccess: (data) => {
        dispatch(setToastMessage({ message: data.message || 'Reports exported successfully', variant: 'success' }));
      },
      onError: (err) => {
        dispatch(setToastMessage({ message: err?.response?.data?.message || 'Export failed', variant: 'error' }));
      }
    }
  );

  const onExport = () => {
    const obj = {
      partnershipId,
      type: 'PARTNER_REPORTS'
    };
    exportReports(obj);
  };

  if (tableRows.totalElements === 0 && !reportsLoading) {
    return null; // Don't show anything if no reports
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Partnership Reports ({tableRows.totalElements})
          </Typography>
        </Grid>
      </Grid>
      <Table
        headData={tableHeadData}
        data={tableRows}
        isLoading={reportsLoading}
        row={PartnerReportsViewRow}
        totalCountText=""
        allCount={tableRows?.totalElements}
        isSearch={false}
        isExport={true}
        onExport={onExport}
        onView={handleViewReport}
      />

      {openViewReport && (
        <ViewPartnerReportDialog
          open={openViewReport}
          onClose={handleCloseViewDialog}
          partnershipId={partnershipId}
          reportId={viewingReport?.id}
        />
      )}
    </Paper>
  );
}
