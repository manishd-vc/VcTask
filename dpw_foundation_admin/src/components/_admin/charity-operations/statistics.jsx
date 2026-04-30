'use client';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// mui
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItemText,
  Stack,
  Switch,
  Typography,
  useTheme
} from '@mui/material';
import ModalStyle from 'src/components/dialog/dialog.style';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { CloseIcon, MoreInfoIcon } from 'src/components/icons';
import LoadingFallback from 'src/components/loadingFallback';
import CustomTabs from 'src/components/tabs/tabs';
import { setAllStatistics } from 'src/redux/slices/statistics';

const CampaignStatisticsSuspense = React.lazy(() => import('../campaign/campaignStatistics'));
const ProjectStatisticsSuspense = React.lazy(() => import('../campaign/projectStatistics'));

const tabsData = [
  {
    label: 'Fundraising Campaigns',
    value: 'campaign-statistics',
    content: (
      <Suspense fallback={<LoadingFallback />}>
        <CampaignStatisticsSuspense />
      </Suspense>
    )
  },
  {
    label: 'Charitable Projects',
    value: 'projects-statistics',
    content: (
      <Suspense fallback={<LoadingFallback />}>
        <ProjectStatisticsSuspense />
      </Suspense>
    )
  }
];

export default function Statistics() {
  //use searchParams to show modal data according open tab
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const dispatch = useDispatch();
  const isAllStatistics = useSelector((state) => state.statistics.isAllStatistics);

  const switchHandleChange = (event) => {
    dispatch(setAllStatistics(event.target.checked));
  };

  const theme = useTheme();
  const style = ModalStyle(theme);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <HeaderBreadcrumbs admin heading="Statistics" />
        </Grid>
        <Suspense fallback={<LoadingFallback />}>
          <Grid item xs={12} sm={6}>
            <Stack flexDirection="row" alignItems={'center'} justifyContent={'space-between'}>
              <Button variant="outlined" size="small" onClick={handleOpen}>
                <Stack sx={{ mr: 0.5 }}>
                  <MoreInfoIcon height={20} width={20} />{' '}
                </Stack>
                View Statistics Guideline
              </Button>
              <Stack flexDirection="row" alignItems={'center'}>
                <Typography variant="body3" sx={{ mr: 1 }}>
                  My Statistics
                </Typography>
                <FormControlLabel
                  control={<Switch checked={isAllStatistics} onChange={switchHandleChange} />}
                  label={
                    <Typography variant="body3" sx={{ marginLeft: '-10px' }}>
                      All Statistics
                    </Typography>
                  }
                  labelPlacement="end"
                />
              </Stack>
            </Stack>
          </Grid>
        </Suspense>
      </Grid>
      <Suspense fallback={<LoadingFallback />}>
        <CustomTabs tabs={tabsData} defaultValue="campaign-statistics" />
      </Suspense>

      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle textTransform={'uppercase'} pb={1} variant="h6" color="primary.main">
          {initialTab === 'campaign-statistics'
            ? 'Fundraising Campaions Statistics Understanding Guidelines'
            : 'Charitable Projects Statistics Understanding Guidelines'}
        </DialogTitle>

        {/* Close button */}
        <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>

        <DialogContent>
          {initialTab === 'campaign-statistics' ? (
            <>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} mb={2} textTransform={'uppercase'}>
                Fundraising Performance Metrics
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                This section gives a snapshot of how fundraising efforts are progressing. It shows:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Total funds raised compared to the overall goal to track progress.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Donation trends over time (daily, weekly, monthly) to identify peak periods.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      The average donation amount, helping to understand donor capacity.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      The largest single donation, offering insights into top contributors.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Campaign milestones, tracking how much has been raised and how much time is left to reach the
                      target.
                    </Typography>
                  }
                />
              </List>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} my={2} textTransform={'uppercase'}>
                Donor Engagement & Behavior
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                This area provides insights into donor activity and preferences:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Total number of donors, giving a sense of reach and participation.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      A breakdown of new vs. returning donors, indicating donor retention.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Top donor segments such as individuals or organizations for targeted engagement.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      A geographical map showing where donations are coming from.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      A summary of donation channels used (like website, mobile app, or bank transfer), helping optimize
                      user experience.
                    </Typography>
                  }
                />
              </List>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} my={2} textTransform={'uppercase'}>
                {' '}
                Ongoing Campaigns
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                This section highlights active fundraising campaigns:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Each campaign is listed with its title.
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      A goal tracker (progress bar) shows how much has been raised versus the campaign target, making it
                      easy to monitor progress at a glance.
                    </Typography>
                  }
                />
              </List>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} my={2} textTransform={'uppercase'}>
                Campaign Status
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mb={1}>
                This visual breaks down all campaigns by their current status:
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                Upcoming, In Progress, and Completed campaigns are shown in a chart, offering an overview of how many
                campaigns are at each stage.
              </Typography>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} my={2} textTransform={'uppercase'}>
                Location-wise Campaigns
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mb={1}>
                This pie chart displays:
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                The distribution of campaigns by location, along with the number of campaigns and funds collected from
                each area. It helps identify high-performing regions.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} textTransform={'uppercase'}>
                Project Performance Metrics
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mt={2}>
                Total Funds Spent (Current vs. Anticipated)
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                A comparison chart showing how much has been spent so far versus what was planned—helps track financial
                efficiency.
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mt={2}>
                Number of Charitable Projects Executed (Monthly Trend)
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                A line or bar graph that shows how many projects were completed each month—useful for monitoring
                activity levels over time.
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mt={2}>
                Average Spend per Sector (Health, Food, Education, etc.)
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                A comparative chart indicating how much, on average, is being spent across different focus areas—great
                for evaluating sectoral impact.
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mt={2}>
                Largest Single Spend
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                Highlights the project with the highest individual expenditure, showing its title and amount—useful for
                identifying major investments.
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'} component={'h5'} mt={2}>
                Total Number of Beneficiaries
              </Typography>
              <Typography variant="body2" color={'text.secondarydark'}>
                A metric indicating how many people have benefited across all projects—captures the overall social
                impact.
              </Typography>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} my={2} textTransform={'uppercase'}>
                Ongoing Projects
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                Displays a list or grouped view of current projects, with the following details:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Project Title
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Sector
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Location
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Start Date
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Expected Completion Date
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      This gives a quick snapshot of what's currently in progress and where.
                    </Typography>
                  }
                />
              </List>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} my={2} textTransform={'uppercase'}>
                Project Status Overview
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                A status distribution chart (e.g., doughnut or bar chart) showing the count of projects in each phase:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Upcoming
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      In Progress
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Completed
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Helps monitor project pipeline and timelines.
                    </Typography>
                  }
                />
              </List>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} textTransform={'uppercase'} my={2}>
                Location-Wise Projects
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                A pie chart or geo-distribution chart showing:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Number of projects per location
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Total funds spent per location
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Useful for assessing geographic spread and resource allocation.
                    </Typography>
                  }
                />
              </List>
              <Typography variant="h7" color={'text.secondarydark'} component={'h5'} textTransform={'uppercase'} my={2}>
                Sector-Wise Projects
              </Typography>
              <Typography variant="subtitle4" color={'text.secondarydark'}>
                A pie or stacked bar chart representing:
              </Typography>
              <List sx={{ listStyleType: 'disc' }}>
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Number of projects per sector (Health, Education, etc.)
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Funds allocated to each sector
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Total beneficiaries per sector
                    </Typography>
                  }
                />
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondarydark">
                      Gives a clear picture of sectoral focus and reach.
                    </Typography>
                  }
                />
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
