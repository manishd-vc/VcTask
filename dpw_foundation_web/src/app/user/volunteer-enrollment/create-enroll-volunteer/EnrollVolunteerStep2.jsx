import { Box, Checkbox, FormControlLabel, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import WaiverDialog from 'src/components/dialogs/WaiverDialog';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function EnrollVolunteerStep2() {
  const { values, setFieldValue } = useFormikContext();
  const theme = useTheme();
  const style = CommonStyle(theme);
  const [openWaiverDialog, setOpenWaiverDialog] = useState(false);
  const { volunteerEnrollmentData } = useSelector((state) => state?.profile);
  const { masterData } = useSelector((state) => state?.common);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const getNationalityLabels = (nationalities) => {
    if (!nationalities?.length) return '-';
    return nationalities.map((n) => country?.find((c) => c.code === n.code)?.label || n.code).join(', ');
  };
  const {
    volunteerCampaignTitle,
    volunteerCampaignDescription,
    startDateTime,
    endDateTime,
    region,
    organizationName,
    addressLineOne,
    addressLineTwo,
    countryName,
    stateName,
    city,
    eventType,
    enrollmentStartDateTime,
    enrollmentEndDateTime,
    genderRequired,
    noOfVolunteersRequired,
    minimumHoursRequired,
    fromAge,
    toAge,
    nationalityRequired,
    languageRequired,
    customCriteria,
    waiverFormContent
  } = volunteerEnrollmentData?.volunteerCampaign || {};

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        volunteer campaign details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform="uppercase" color="primary.main">
            Campaign details
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Volunteer Campaign Title
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {volunteerCampaignTitle || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Volunteer Campaign Description
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {volunteerCampaignDescription || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign Start Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(startDateTime && fDateWithLocale(startDateTime)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Campaign End Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(endDateTime && fDateWithLocale(endDateTime)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Region
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {region || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Organization Name
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {organizationName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Address Line 1
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {addressLineOne || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Address Line 2
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {addressLineTwo || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Country
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {countryName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              State/Province
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {stateName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              City
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {city || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Event Type
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {eventType || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform="uppercase" color="primary.main">
            volunteer Enrolment and selection criteria
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Enrolment Start Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(enrollmentStartDateTime && fDateWithLocale(enrollmentStartDateTime)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Enrolment End Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(enrollmentEndDateTime && fDateWithLocale(enrollmentEndDateTime)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Gender Required
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {genderRequired || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Volunteers Required
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {noOfVolunteersRequired || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Minimum Hours Required
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {minimumHoursRequired || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              From Age
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {fromAge || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              To Age
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {toAge || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Nationality Required
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getNationalityLabels(nationalityRequired)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Language Required
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {languageRequired
                ?.map((item) => getLabelByCode(masterData, 'dpwf_language', item?.code) || item?.code)
                .join(', ') || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h4" variant="subtitle4" color="text.black">
            Custom Criteria
          </Typography>{' '}
          {customCriteria?.map((item) => (
            <Box
              key={item?.id}
              sx={{
                ...style.documentCard
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Criteria
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {item?.criteria || '-'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={0.5}>
                    <Typography variant="body3" color="text.secondary">
                      Criteria Requirement
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {item?.criteriaRequirement || '-'}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.waiverRequired === 'true' || values.waiverRequired === true}
                onChange={(e) => {
                  if (values.waiverRequired !== 'true' && e.target.checked) {
                    setOpenWaiverDialog(true);
                  } else {
                    setFieldValue('waiverRequired', e.target.checked ? 'true' : 'false');
                  }
                }}
              />
            }
            label="I accept and agree to the terms of this waiver."
          />
          {openWaiverDialog && (
            <WaiverDialog
              templateData={waiverFormContent}
              open={openWaiverDialog}
              onClose={() => setOpenWaiverDialog(false)}
              onAgree={() => {
                setFieldValue('waiverRequired', 'true');
                setOpenWaiverDialog(false);
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
