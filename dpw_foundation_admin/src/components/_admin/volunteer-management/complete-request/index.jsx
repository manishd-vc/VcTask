'use client';
import { Button, Grid, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { buttonResponsiveStyle } from 'src/components/common.styles';
import { BackArrow } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';
import * as api from 'src/services';
import CancelDialog from '../../campaign/cancelDialog';

import LoadingFallback from 'src/components/loadingFallback';
import { setToastMessage } from 'src/redux/slices/common';
import { setVolunteerCampaignData } from 'src/redux/slices/volunteer';
import * as volunteerApi from 'src/services/volunteer';
import CampaignRelatedTask from './CampaignRelatedTask';
import VolunteerPostAnalysisQuestions from './VolunteerPostAnalysisQuestions';
import VolunteeringCampaignMilestone from './VolunteeringCampaignMilestone';

// Question list headers for the table
const questionListHeaders = [
  { label: 'Question', key: 'question' },
  { label: 'Target Unit', key: 'targetUnit' },
  { label: 'Target Value', key: 'targetValue' },
  { label: 'Achieved Value', key: 'achievedValue' },
  { label: 'Variance', key: 'variance' },
  { label: 'Success Rate', key: 'successRate' }
];
export default function CompleteRequest() {
  const router = useRouter();
  const dispatch = useDispatch();
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);
  const { volunteerCampaignNumericId, id } = volunteerCampaignData || {};

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openPostAnalysisDialog, setOpenPostAnalysisDialog] = useState(false);

  const { isLoading: isLoadingVolunteerCampaign, refetch: refetchVolunteerCampaign } = useQuery(
    ['volunteerCampaign', volunteerApi.fetchVolunteerCampaignById, id],
    () => volunteerApi.fetchVolunteerCampaignById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setVolunteerCampaignData(data));
      }
    }
  );

  // Fetch questions data
  const { data, refetch, isLoading } = useQuery(
    ['getVolunteerCampaignQuestions', id],
    () => api.getCampaignQuestions(id, 'VOLUNTEER_CAMPAIGN'),
    {
      refetchOnWindowFocus: false,
      enabled: !!id
    }
  );

  const { mutate, isLoading: isLoadingComplete } = useMutation(volunteerApi.volunteerCampaignComplete, {
    onSuccess: (response) => {
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      router.push(`/admin/volunteer-campaigns`);
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const handleClose = () => {
    setOpenCancelDialog(false);
  };

  const handleClosePostAnalysis = () => {
    setOpenPostAnalysisDialog(false);
  };

  const handleProceed = () => {
    setOpenCancelDialog(false);
    router.back(); // Navigate back when user confirms
  };

  const handleComplete = () => {
    mutate({ id });
  };

  if (isLoadingVolunteerCampaign) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<BackArrow />}
          onClick={() => router.back()}
          sx={{
            mb: { xs: 3 },
            '&:hover': { textDecoration: 'none' }
          }}
        >
          Back
        </Button>

        <Stack
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          flexDirection="row"
          gap={2}
          flexWrap="wrap"
          alignItems={'center'}
        >
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            sx={buttonResponsiveStyle('35%')}
            onClick={() => setOpenCancelDialog(true)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ width: { xs: '100%', sm: '28%', md: 'auto' } }}
            onClick={handleComplete}
            disabled={isLoadingComplete}
            loading={isLoadingComplete}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
      <Typography variant="h5" color={'primary.main'} sx={{ textTransform: 'uppercase', width: '100%', mb: 4 }}>
        Complete Volunteer Campaign - {volunteerCampaignNumericId}
      </Typography>
      <CancelDialog open={openCancelDialog} onClose={handleClose} onSubmit={handleProceed} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="column" spacing={3}>
          {data?.postAnalysisQues?.length > 0 ? (
            <>
              <Stack alignItems="center" direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
                <Typography variant="subtitle6" color="primary.main" textTransform="uppercase">
                  Post Analysis Report Questioner
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenPostAnalysisDialog(true)}
                  sx={{ textTransform: 'none' }}
                  size="small"
                >
                  Answer Questioner
                </Button>
              </Stack>
              <ReusableTable headers={questionListHeaders}>
                {data?.postAnalysisQues?.map((item) => (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.questionText || '-'}</TableCell>
                    <TableCell>{item?.targetUnit || '-'}</TableCell>
                    <TableCell>{item?.targetValue || '-'}</TableCell>
                    <TableCell>{item?.achieveValue || '-'}</TableCell>
                    <TableCell>{item?.variance || '-'}</TableCell>
                    <TableCell>
                      {item?.rateDifference !== null &&
                      item?.rateDifference !== undefined &&
                      item?.rateDifference !== ''
                        ? `${item.rateDifference}%`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </ReusableTable>
            </>
          ) : (
            <Grid container justifyContent="center" sx={{ py: 6 }}>
              <Grid item xs={12} textAlign="center">
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No Questions Available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  There are no post-analysis questions created for this volunteer campaign yet.
                </Typography>
              </Grid>
            </Grid>
          )}
          <CampaignRelatedTask refetch={refetchVolunteerCampaign} />
          <VolunteeringCampaignMilestone refetch={refetchVolunteerCampaign} />
        </Stack>
      </Paper>

      {openPostAnalysisDialog && (
        <VolunteerPostAnalysisQuestions
          open={openPostAnalysisDialog}
          onClose={handleClosePostAnalysis}
          id={id}
          mode="answer"
          data={data}
          isLoading={isLoading}
          refetch={refetch}
        />
      )}
    </>
  );
}
