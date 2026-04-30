import { Box, Checkbox, FormControlLabel, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import WaiverDialog from 'src/components/dialog/WaiverDialog';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function EnrollVolunteerStep2() {
  const theme = useTheme();
  const style = CommonStyle(theme);
  const { values, getFieldProps, errors, touched, setFieldValue } = useFormikContext();
  const [openWaiverDialog, setOpenWaiverDialog] = useState(false);
  const { volunteerEnrollmentLoading } = useSelector((state) => state?.volunteer);
  const { masterData } = useSelector((state) => state?.common);
  const { data: volunteerEnrollmentCampaigns } = useQuery(['getVolunteerEnrollmentCampaigns'], () =>
    volunteerApi.getVolunteerEnrollmentCampaigns()
  );
  const { data: volunteerEnrollmentCampaignById } = useQuery(
    ['getVolunteerEnrollmentCampaignById', values?.volunteerCampaignId],
    () => {}
  );
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
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
  } = volunteerEnrollmentCampaignById || {};

  const newVolunteerEnrollmentCampaigns = volunteerEnrollmentCampaigns?.map((campaign) => ({
    code: campaign.id,
    label: campaign.volunteerCampaignTitle
  }));
  const nationalityLabels =
    nationalityRequired?.length > 0
      ? nationalityRequired
          .map((nationality) => {
            const countryData = country?.find((c) => c.code === nationality.code);
            return countryData?.label;
          })
          .filter(Boolean)
          .join(', ')
      : '-';

  const languageLabels =
    languageRequired?.length > 0
      ? languageRequired
          .map((language) => getLabelByCode(masterData, 'dpwf_language', language.code))
          .filter(Boolean)
          .join(', ')
      : '-';

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        volunteer campaign details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={volunteerEnrollmentLoading}
            error={touched.volunteerCampaignId && errors.volunteerCampaignId}
          >
            <TextFieldSelect
              id="volunteerCampaignId"
              label={
                <>
                  Select Volunteer Campaign{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={newVolunteerEnrollmentCampaigns}
              value={values?.volunteerCampaignId}
              onChange={(e) => setFieldValue('volunteerCampaignId', e.target.value)}
              error={Boolean(touched?.volunteerCampaignId && errors?.volunteerCampaignId)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        {volunteerEnrollmentCampaignById && (
          <>
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
                  {getLabelByCode(masterData, 'dpwf_volunteer_region', region) || '-'}
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
                  {getLabelByCode(masterData, 'dpwf_volunteer_event_type', eventType) || '-'}
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
                  {getLabelByCode(masterData, 'dpwf_volunteer_gender', genderRequired) || '-'}
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
                  {nationalityLabels || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Language Required
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {languageLabels}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h4" variant="subtitle4" color="text.black">
                Custom Criteria
              </Typography>

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
                    checked={values.waiverRequired}
                    onChange={(e) => {
                      if (!values.waiverRequired && e.target.checked) {
                        setOpenWaiverDialog(true);
                      } else {
                        setFieldValue('waiverRequired', e.target.checked);
                      }
                    }}
                  />
                }
                label="I accept and agree to the terms of this waiver."
              />
            </Grid>
          </>
        )}
      </Grid>
      {openWaiverDialog && (
        <WaiverDialog
          open={openWaiverDialog}
          templateData={waiverFormContent}
          volunteerCampaignTitle={volunteerCampaignTitle}
          onClose={() => setOpenWaiverDialog(false)}
          onAgree={() => {
            setFieldValue('waiverRequired', true);
            setOpenWaiverDialog(false);
          }}
        />
      )}
    </>
  );
}
