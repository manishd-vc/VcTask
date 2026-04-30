'use client';
import { Button, LinearProgress, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as beneficiaryApi from 'src/services/beneficiary';
import BeneficiaryInformation from './BeneficiaryInformation';
import CampaignDetailsView from './CampaignDetailsView';
import InkindContribution from './InkindContribution';
import ProjectDistributionsView from './ProjectDistributionsView';

export default function ProjectView() {
  const router = useRouter();
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const { data: campaignData, isLoading } = useQuery(
    ['associatedCampaigns', projectId],
    () => beneficiaryApi.getAssociatedCampaigns(projectId),
    {
      enabled: !!projectId,
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
  console.log('campaignData', campaignData);
  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
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
      </Stack>
      <HeaderBreadcrumbs
        heading={`${campaignData?.campaignTitle || 'Project'} - ID : ${campaignData?.campaignNumericId || ''}`}
      />
      <BeneficiaryInformation campaignData={campaignData} />
      <CampaignDetailsView campaignData={campaignData} />
      <ProjectDistributionsView campaignUpdateData={campaignData} />
      <InkindContribution campaignData={campaignData} />
    </>
  );
}
