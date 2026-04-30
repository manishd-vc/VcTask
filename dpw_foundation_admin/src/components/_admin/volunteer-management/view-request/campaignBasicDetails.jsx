'use client';
import { Box, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateShortMonth } from 'src/utils/formatTime';

export default function CampaignBasicDetails() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const { masterData } = useSelector((state) => state?.common);
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4}>
          <Stack sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}>
            <Image
              src={volunteerCampaignData?.coverImageUrl || '/dpwfadm/images/default.png'}
              alt="Cover Image"
              width={800}
              height={600}
              layout="responsive"
              unoptimized={true}
              style={{ maxHeight: '150px', objectFit: 'contain' }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={6}>
              <Stack flexDirection={'column'} gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Campaign Start Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {volunteerCampaignData?.startDateTime ? fDateShortMonth(volunteerCampaignData.startDateTime) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <Stack flexDirection={'column'} gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Campaign End Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {volunteerCampaignData?.endDateTime ? fDateShortMonth(volunteerCampaignData.endDateTime) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <Stack flexDirection={'column'} gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Organization Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {volunteerCampaignData?.organizationName || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <Stack flexDirection={'column'} gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Region
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getLabelByCode(masterData, 'dpwf_volunteer_region', volunteerCampaignData?.region)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <Stack flexDirection={'column'} gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Volunteer Campaign Description
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              Lorem ipsum dolor sit amet, consectetur Lorem ipsum
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
