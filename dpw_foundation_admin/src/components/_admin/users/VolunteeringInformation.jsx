'use client';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { useSelector } from 'react-redux';
import SkillCertificationsTable from 'src/components/table/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/table/VolunteeringSupportDocumentsTable';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelsFromCodes } from 'src/utils/getLabelsFromCodes';
import AvailabilityList from './AvailabilityList';

const formatBooleanAnswer = (value) => (value === true ? 'Yes' : 'No');

const InfoItem = ({ question, answer, colSize }) => (
  <Grid item xs={12} md={colSize}>
    <Stack direction="column" gap={0.5}>
      <Typography variant="body3" color="text.secondary">
        {question}
      </Typography>
      <Typography
        variant="subtitle4"
        component="p"
        display="flex"
        flexWrap="wrap"
        color="text.secondarydark"
        sx={{ wordBreak: 'break-word' }}
      >
        {answer || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function VolunteeringInformation({ userData }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { masterData } = useSelector((state) => state?.common);
  if (userData?.accountType !== 'Individual') {
    return null;
  }

  const otherLanguage = getLabelsFromCodes(userData?.otherLanguage, 'dpwf_language', masterData);
  const volunteeringArea = getLabelsFromCodes(
    userData?.volunteeringArea,
    'dpw_foundation_user_volunteering',
    masterData
  );
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main">
            Volunteering information
          </Typography>
        </Grid>
        <InfoItem
          colSize={6}
          question="Are you interested in Volunteering with DPW Foundation ?"
          answer={formatBooleanAnswer(userData?.isVolunteer)}
        />
        <InfoItem colSize={6} question="Is DPW Group Employee?" answer={formatBooleanAnswer(userData?.isDpwEmployee)} />
        {userData?.isVolunteer === true && userData?.accountType === 'Individual' && (
          <>
            <InfoItem colSize={6} question="Employee ID" answer={userData?.employeeId} />
            <InfoItem colSize={6} question="Company" answer={userData?.companyName} />
            <InfoItem colSize={6} question="Department" answer={userData?.department} />
            <InfoItem
              colSize={6}
              question="Have Driver License"
              answer={formatBooleanAnswer(userData?.dlAvailability)}
            />
            <InfoItem colSize={6} question="Has Own Car" answer={formatBooleanAnswer(userData?.carAvailability)} />
            <InfoItem colSize={6} question="Home Phone" answer={userData?.homePhoneNumber} />
            <InfoItem
              colSize={6}
              question="Native Language"
              answer={getLabelByCode(masterData, 'dpwf_language', userData?.nativeLanguage)}
            />
            <InfoItem
              colSize={6}
              question="Other Language Proficiency"
              answer={otherLanguage || (userData?.otherLanguage ? 'Yes' : 'No')}
            />
            <InfoItem colSize={6} question="Volunteering areas of Interest" answer={volunteeringArea} />
            {userData?.volunteeringArea?.map((item) => item.code === 'other').includes(true) && (
              <InfoItem colSize={6} question="Add area of Interest" answer={userData?.otherVolunteeringArea} />
            )}
            <Grid item xs={12}>
              <SkillCertificationsTable data={userData?.skillCertifications} isEditable={false} userData={userData} />
            </Grid>
            <Grid item xs={12}>
              <VolunteeringSupportDocumentsTable
                data={userData?.volunteeringSupportDocuments}
                isEditable={false}
                userData={userData}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                disabled={true}
                control={<Checkbox checked={userData?.volunteerReleaseAccepted} />}
                label="Volunteer Release and Undertaking"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack mb={3}>
                <Typography textAlign="left" variant="h7" color="primary.main" textTransform="uppercase">
                  Available for Volunteering?
                </Typography>
              </Stack>
              <Grid item xs={12}>
                <Box sx={{ border: (theme) => `1px solid ${theme.palette.warning.dark}`, py: 3, px: 2 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row', md: 'row' }}
                    flexWrap="wrap"
                    divider={isDesktop && <Divider orientation="vertical" flexItem />}
                    spacing={{ xs: 0, md: 3, lg: 5 }}
                    rowGap={3}
                  >
                    <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                      <Typography variant="subtitle1" color="text.secondarydark">
                        Morning:
                      </Typography>
                      <Typography variant="body1" color="text.secondarydark" component="p">
                        5:00 AM - 11:59 AM
                      </Typography>
                    </Box>
                    <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                      <Typography variant="subtitle1" color="text.secondarydark">
                        Afternoon:
                      </Typography>
                      <Typography variant="body1" color="text.secondarydark" component="p">
                        12:00 PM - 4:59 PM
                      </Typography>
                    </Box>
                    <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                      <Typography variant="subtitle1" color="text.secondarydark">
                        Evening:
                      </Typography>
                      <Typography variant="body1" color="text.secondarydark" component="p">
                        5:00 PM - 8:59 PM
                      </Typography>
                    </Box>
                    <Box sx={{ width: { sm: '48%', md: 'auto' } }}>
                      <Typography variant="subtitle1" color="text.secondarydark">
                        Night:
                      </Typography>
                      <Typography variant="body1" color="text.secondarydark" component="p">
                        9:00 PM - 4:59 AM
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} mt={2}>
                <AvailabilityList userData={userData?.availability} />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}
