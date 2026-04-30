'use client';
import { Box, Grid, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { fDateShortMonth } from 'src/utils/formatTime';
/**
 * CampaignDetailsView component displays the view for the campaign's contribution section.
 * It retrieves the updated campaign data from the Redux store.
 */
export default function CampaignDetailsView() {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  return (
    <Box>
      {/* <Typography variant="h6" component="p" textTransform="uppercase" color="text.black" mb={3}>
        Basic Details
      </Typography> */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={4}>
          <Stack sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}>
            <Image
              src={campaignUpdateData?.bannerUrl || '/dpwfadm/images/default.png'}
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
            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Start Date' : 'Project Start Date'}
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.startDateTime ? fDateShortMonth(campaignUpdateData.startDateTime) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign End Date' : 'Project End Date'}
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.endDateTime ? fDateShortMonth(campaignUpdateData.endDateTime) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Supervisor' : 'Project Supervisor'}
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.projectManagerName || '-'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        {campaignUpdateData?.campaignType === 'FUNDCAMP' && (
          <Grid item xs={12} sm={12} lg={12}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Applied Method
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.appliedMethod || '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Description' : 'Project Description'}{' '}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.campaignDescription || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
