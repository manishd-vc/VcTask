'use client';
// mui
import { Grid } from '@mui/material';
import { useQuery } from 'react-query';
import DashboardCard from 'src/components/_admin/dashboard/dashboardCard';
import DonorEnrollments from 'src/components/charts/donorEnrollments';
import * as api from 'src/services';
import CampaignDonation from '../../charts/campaignDonation';

/**
 * CampaignStatisticDashboard renders a dashboard displaying campaign statistics such as donations,
 * active campaigns, and donor enrollments.
 *
 * @returns {JSX.Element} Rendered dashboard component
 */
CampaignStatisticDashboard.propTypes = {};

export default function CampaignStatisticDashboard() {
  const { data, isLoading, isError, error } = useQuery('campaignDashboard', api.campaignDashboard, {
    onSuccess: () => {},
    onError: (error) => {
      console.error('Error fetching dashboard data:', error);
    }
  });
  if (isError) {
    return <div>Error: {error?.message}</div>;
  }
  const dashboardCardData = data?.data;
  return (
    <Grid container spacing={3}>
      {/* Total Donations Card */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard
              isAmount
              title="Total Donation Received (AED)"
              value={dashboardCardData?.noDonationAchieved || 0}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Active Campaigns Card */}
      <Grid item xs={12} sm={6} md={4}>
        <DashboardCard
          title="Active Campaigns"
          value={dashboardCardData?.noCampaignActive || 0}
          isLoading={isLoading}
        />
      </Grid>

      {/* Donation Amount Card */}
      <Grid item xs={12} sm={6} md={4}>
        <DashboardCard
          isAmount
          title="Total Donations"
          value={dashboardCardData?.totalAmountOfDonationAchieved || 0}
          isLoading={isLoading}
        />
      </Grid>

      {/* Donor Count Card */}
      <Grid item xs={12} sm={6} md={4}>
        <DashboardCard
          isAmount
          title="No of Donors"
          value={dashboardCardData?.totalDonorParticipated || 0}
          isLoading={isLoading}
        />
      </Grid>

      {/* On-the-Spot Donations Card */}
      <Grid item xs={12} sm={6} md={4}>
        <DashboardCard
          isAmount
          title="On the spot Donations"
          value={dashboardCardData?.onSpotDonation || 0}
          isLoading={isLoading}
        />
      </Grid>

      {/* General Donations Card */}
      <Grid item xs={12} sm={6} md={4}>
        <DashboardCard
          isAmount
          title="General Donations"
          value={dashboardCardData?.selfDonation || 0}
          isLoading={isLoading}
        />
      </Grid>

      {/* Event-Specific Donations Card */}
      <Grid item xs={12} sm={6} md={4}>
        <DashboardCard
          isAmount
          title="Event specific donations"
          value={dashboardCardData?.campaignThroughDonations || 0}
          isLoading={isLoading}
        />
      </Grid>

      {/* Campaign Donation Chart */}
      <Grid item xs={12} sm={6} md={8}>
        <CampaignDonation data={dashboardCardData?.campaignDonations} isLoading={isLoading} />
      </Grid>

      {/* Donor Enrollment Chart */}
      <Grid item xs={12} sm={6} md={4}>
        <DonorEnrollments data={dashboardCardData?.donorEnrollments} isLoading={isLoading} />
      </Grid>
    </Grid>
  );
}
