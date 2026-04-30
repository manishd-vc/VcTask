'use client';
import { LinearProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import * as enrollmentApi from 'src/services/myEnrolment';
import CampaignInformation from './campaign-information';
import PageHeader from './page-header';
import RequestDetails from './request-details';
import VolunteerInformation from './volunteer-information';
export default function ViewVolunteerRequest() {
  const { id } = useParams();

  const { data: enrolmentData, isLoading } = useQuery(['enrolment', id], () => enrollmentApi.getEnrolmentById(id), {
    enabled: !!id
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <PageHeader data={enrolmentData?.data} />
      <Stack spacing={3} sx={{ mt: 2 }}>
        <RequestDetails data={enrolmentData?.data} />
        <VolunteerInformation data={enrolmentData?.data} enrollmentData={enrolmentData?.data} />

        <CampaignInformation
          data={enrolmentData?.data?.volunteerCampaign}
          enrollmentData={enrolmentData?.data}
          enrollmentId={id}
        />
      </Stack>
    </>
  );
}
