import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import SkillCertificationsTable from 'src/components/tables/SkillCertificationsTable';
import VolunteeringSupportDocumentsTable from 'src/components/tables/VolunteeringSupportDocumentsTable';
import { getLabelObject } from 'src/utils/extractLabelValues';

export default function VolunteeringInformation({ user }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { masterData } = useSelector((state) => state?.common);
  const languages = getLabelObject(masterData, 'dpwf_language');
  const userVolunteering = getLabelObject(masterData, 'dpw_foundation_user_volunteering');

  const getLanguageLabel = (code) => {
    return languages?.values?.find((lang) => lang.code === code)?.label || code;
  };

  const getVolunteeringAreaLabel = (code) => {
    return userVolunteering?.values?.find((area) => area.code === code)?.label || code;
  };

  const getVolunteerStatusText = () => {
    if (user?.isVolunteer === true) return 'Yes';
    if (user?.isVolunteer === false) return 'No';
    return '-';
  };

  const getDrivingLicenseStatusText = () => {
    if (user?.dlAvailability === true) return 'Yes';
    if (user?.dlAvailability === false) return 'No';
    return '-';
  };

  return (
    <>
      <Grid container spacing={3} mt={1}>
        <Grid item md={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Volunteering information
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Are you interested in Volunteering with DPW Foundation ?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getVolunteerStatusText()}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Is DPW Group Employee?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {user?.isDpwEmployee ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Grid>
        {user?.isDpwEmployee && (
          <>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.employeeId || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Company
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.companyName || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.department || '-'}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
        {user?.isVolunteer === true && (
          <>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Have a driving Licence ?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getDrivingLicenseStatusText()}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Do you have Own Car ?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.carAvailability ? 'Yes' : 'No'}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
        {user?.isVolunteer === true && (
          <>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Home Phone Number
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.homePhoneNumber || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Native Language
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.nativeLanguage ? getLanguageLabel(user.nativeLanguage) : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Other Language Proficiency
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.otherLanguage?.map((lang) => getLanguageLabel(lang.code)).join(', ') || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Volunteering Areas of Interests
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.volunteeringArea?.map((area) => getVolunteeringAreaLabel(area.code)).join(', ') || '-'}
                </Typography>
              </Stack>
            </Grid>
            {user?.volunteeringArea?.map((item) => item.code === 'other').includes(true) && (
              <Grid item xs={12} sm={6}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Areas of Interest
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {user?.otherVolunteeringArea || '-'}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {/* Skills Certifications Table */}
            <Grid item xs={12} mt={1}>
              <SkillCertificationsTable data={user?.skillCertifications || []} isEditable={false} />
            </Grid>

            {/* Volunteering Supporting Documents Table */}
            <Grid item xs={12}>
              <VolunteeringSupportDocumentsTable data={user?.volunteeringSupportDocuments || []} isEditable={false} />
            </Grid>

            {/* Volunteer Release Checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user?.volunteerReleaseAccepted === 'true' || user?.volunteerReleaseAccepted === true}
                    disabled
                  />
                }
                label="Volunteer Release and Undertaking"
              />
            </Grid>
            {user?.isVolunteer === true && (
              <>
                <Grid item md={12}>
                  <Typography variant="h7" color="primary.main" textTransform="uppercase">
                    Available for Volunteering?
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ border: (theme) => `1px solid ${theme.palette.warning.dark}`, py: 3, px: 2 }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row', md: 'row' }}
                      flexWrap="wrap"
                      divider={isDesktop && <Divider orientation="vertical" flexItem />}
                      Identity
                      Documnets
                      Details
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
                <Grid item xs={12} md={12}>
                  <TableContainer component={Box}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: { xs: '100px', sm: '120px', md: '160px', lg: '180px' } }}>
                            Days
                          </TableCell>
                          <TableCell>
                            <Grid container>
                              <Grid item xs={12} sm={3} sx={{ px: 1 }}>
                                Time
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {user?.availability?.map((slot) => (
                          <TableRow key={slot?.id}>
                            <TableCell>
                              <Typography variant="subtitle1" color="text.secondarydark">
                                {slot?.day}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Grid container>
                                {slot?.timeSlots?.map((timeSlot) => (
                                  <Grid item xs={12} sm={3} key={timeSlot} sx={{ p: 1 }}>
                                    <Typography variant="body1" color="text.secondarydark">
                                      {timeSlot}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
}
