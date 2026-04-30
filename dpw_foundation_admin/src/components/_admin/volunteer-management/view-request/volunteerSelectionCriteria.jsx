'use client';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';

import CommonStyle from 'src/components/common.styles';
import { getLabelsFromCodes } from 'src/utils/getLabelsFromCodes';
export default function VolunteerSelectionCriteria() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const { masterData } = useSelector((state) => state?.common);

  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const theme = useTheme();
  const style = CommonStyle(theme);
  const nationalityLabels =
    volunteerCampaignData?.nationalityRequired?.length > 0
      ? volunteerCampaignData.nationalityRequired
          .map((nationality) => {
            const countryData = country?.find((c) => c.code === nationality.code);
            return countryData?.label;
          })
          .filter(Boolean)
          .join(', ')
      : '-';

  const languageLabels = getLabelsFromCodes(volunteerCampaignData?.languageRequired, 'dpwf_language', masterData);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Gender Required
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {getLabelByCode(masterData, 'dpwf_volunteer_gender', volunteerCampaignData?.genderRequired)}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Volunteers Required
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.volunteersRequiredCount}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Minimum Hours Required
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.minimumHoursRequired}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            From Age
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.fromAge}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            To Age
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.toAge}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Nationality Required
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {nationalityLabels}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Language Required
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {languageLabels}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle4" color="text.black">
          Custom Criteria
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {volunteerCampaignData?.customCriteria?.length > 0 && (
          <Stack spacing={2}>
            {volunteerCampaignData?.customCriteria?.map((criteria, index) => (
              <Box
                sx={{
                  ...style.documentCard
                }}
                key={criteria?.id}
              >
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack flexDirection={'column'} gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Criteria
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {criteria?.criteria}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack flexDirection={'column'} gap={0.5}>
                      <Typography variant="body3" color="text.secondary">
                        Criteria Requirement
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {criteria?.criteriaRequirement}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
