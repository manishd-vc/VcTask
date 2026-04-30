'use client';
import { Grid, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import ReusableTable from 'src/components/table/ReusableTable';
import * as api from 'src/services';
import { fDateWithLocale } from 'src/utils/formatTime';
import Export from './export';

PostAnalysisReport.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string,
  campaignUpdateData: PropTypes.object.isRequired,
  isSuperior: PropTypes.bool.isRequired
};

export default function PostAnalysisReport() {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const id = campaignUpdateData?.id;
  const { data, error } = useQuery(['getCampaignQuestions', id], () => api.getCampaignQuestions(id, 'CAMPAIGN'), {
    refetchOnWindowFocus: false,
    retry: 1, // Optional: Retry once if the API fails
    enabled: !!id
  });
  if (error) console.error('API Error:', error);
  const row = data?.postAnalysisQues || [];
  const tableHeaders = [
    { label: 'Questions', key: 'questionText' },
    { label: 'Target Unit', key: 'targetUnit' },
    { label: 'Target Value', key: 'targetValue' },
    { label: 'Achieved Value', key: 'achieveValue' },
    { label: 'Variance', key: 'variance' },
    { label: 'Success Rate', key: 'rateDifference' }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
        {campaignUpdateData?.campaignType === 'FUNDCAMP'
          ? 'post Campaign analysis report'
          : 'post project analysis report'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP'
                ? 'Campaign Report Analysis ID'
                : 'Project Report Analysis ID'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.analysisReportId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign ID' : 'Project ID'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.campaignNumbericId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Analysis Report Title
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              Analysis report for - {data?.reportTitle || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Target Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(data?.projectEndDate && fDateWithLocale(data?.projectEndDate)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(data?.projectEndDate && fDateWithLocale(data?.projectEndDate)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Assign To
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.supervisorName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP'
                ? 'Campaign Post Analysis Status'
                : 'Project Post Analysis Status'}{' '}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.analysisStatus?.toLowerCase()?.replace(/^\w/, (c) => c.toUpperCase()) || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack
          direction="row"
          spacing={3}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 2
          }}
        >
          <Typography variant="subtitle5" textTransform={'uppercase'} color="primary.main" sx={{ py: 3 }} component="p">
            All Questions ({campaignUpdateData?.postAnalysisQues?.length})
          </Typography>
          {campaignUpdateData?.postAnalysisQues?.length > 0 && (
            <Export id={campaignUpdateData?.entityId} type={'POST_ANALYSIS'} />
          )}
        </Stack>
      </Grid>
      {/* <Typography variant="h6" color="warning.main">
        {campaignUpdateData?.postAnalysisQues?.length}
      </Typography>
      {/* {campaignUpdateData?.postAnalysisQues?.length > 0 && ( */}
      {row.length > 0 && (
        <Grid item xs={12} md={4} sx={{ py: 2, textAlign: 'right' }}>
          <Export id={campaignUpdateData?.id} type={'POST_ANALYSIS'} />
        </Grid>
      )}
      {/* )} */}
      <ReusableTable headers={tableHeaders}>
        {row.length > 0 ? (
          row?.map((item) => (
            <TableRow key={item?.id}>
              <TableCell>{item.questionText || '-'}</TableCell>
              <TableCell>{item.targetUnit || '-'}</TableCell>
              <TableCell>{item.targetValue || '-'}</TableCell>
              <TableCell>{item.achieveValue || '-'}</TableCell>
              <TableCell>{item.variance || '-'}</TableCell>
              <TableCell>{item.rateDifference || '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={tableHeaders.length} align="center" color="text.secondary" height={50}>
              No data available
            </TableCell>
          </TableRow>
        )}
      </ReusableTable>
    </Paper>
  );
}
