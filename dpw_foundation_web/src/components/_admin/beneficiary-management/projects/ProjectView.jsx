'use client';
import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { BackArrow } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import CampaignDetailsView from './CampaignDetailsView';

export default function ProjectView() {
  const router = useRouter();
  const { id: beneficiaryId } = useParams();
  const dispatch = useDispatch();

  const { data: campaignData, isLoading } = useQuery(
    ['associatedCampaigns', beneficiaryId],
    () => beneficiaryApi.getAssociatedCampaigns(beneficiaryId),
    {
      enabled: !!beneficiaryId,
      onError: (error) => {
        dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      }
    }
  );

  if (isLoading) {
    return (
      <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
        <LinearProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent={'space-between'}
        mb={{ xs: 6, sm: 3 }}
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
      </Stack>
      <Typography variant="h5" color="primary.main" sx={{ textTransform: 'uppercase' }} mb={4}>
        {`${campaignData?.campaignTitle || 'Project'} - ID : ${campaignData?.campaignNumericId || ''}`}
      </Typography>

      <CampaignDetailsView campaignData={campaignData} />
    </>
  );
}
