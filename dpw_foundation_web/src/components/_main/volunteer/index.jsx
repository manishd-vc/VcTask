'use client';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import * as api from 'src/services';
import { fDateWithLocale, formatTime } from 'src/utils/formatTime';

import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import { CalendarIcon, ClockIcon, LocationIcon, TrueSignIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import {
  setVolunteerEnrollmentData,
  setVolunteerEnrollmentLoading,
  setVolunteerFormData
} from 'src/redux/slices/profile';
import * as volunteerApi from 'src/services/volunteer';
import { getImageUrl } from 'src/utils/util';
import CampaignStyle from '../campaign/campaign.styles';

function TableRowComponent({ label, value, theme }) {
  return (
    <TableRow>
      <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" fontWeight="bold">
          {label}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{value || '-'}</Typography>
      </TableCell>
    </TableRow>
  );
}

VolunteerDetails.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};

export default function VolunteerDetails({ params }) {
  const theme = useTheme();
  const styles = CampaignStyle(theme);
  const router = useRouter();
  const pathname = usePathname();
  let paramData = JSON.parse(params?.value);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(({ user }) => user);
  const { user } = useSelector((state) => state?.user);

  const { mutate: enrollVolunteerMutation } = useMutation(volunteerApi.createUpdateVolunteerEnrollment, {
    onSuccess: (data, variables) => {
      dispatch(setVolunteerFormData(data?.data));
      dispatch(setVolunteerEnrollmentLoading(false));
      enrollVolunteerMutate(variables.volunteerCampaignId);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
      dispatch(setVolunteerEnrollmentLoading(false));
    }
  });

  const { mutate: enrollVolunteerMutate } = useMutation(volunteerApi.enrollVolunteer, {
    onSuccess: (data) => {
      dispatch(setVolunteerEnrollmentData(data?.data));
      router.push(`/user/volunteer-enrollment/${data?.data?.volunteerCampaignId}`);
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error?.response?.data?.message, variant: 'error' }));
    }
  });

  const getNationalityLabels = (nationalities) => {
    if (!nationalities?.length) return '-';
    return nationalities.map((n) => n.label || n.code).join(', ');
  };

  const { data } = useQuery(['volunteerDetails', paramData.slug], () =>
    api.getVolunteerCampaignDetails(paramData.slug)
  );

  const {
    id: campaignId,
    customCriteria,
    addressLineOne,
    addressLineTwo,
    city,
    stateName,
    countryName,
    coverImageUrl,
    volunteerCampaignTitle,
    volunteerCampaignDescription,
    startDateTime,
    endDateTime,
    genderRequired,
    noOfVolunteersRequired,
    minimumHoursRequired,
    fromAge,
    toAge,
    nationalityRequired,
    languageRequired
  } = data || {};

  const address = [addressLineOne, addressLineTwo, city, stateName, countryName].filter(Boolean).join(', ');
  const enrollVolunteer = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${pathname}`);
    } else {
      dispatch(setVolunteerEnrollmentLoading(true));
      enrollVolunteerMutation({ userId: user?.userId, volunteerCampaignId: campaignId });
    }
  };

  return (
    <>
      <Box
        sx={{
          ...styles.campaignBanner,
          backgroundImage: `url(${getImageUrl(coverImageUrl || '')})`
        }}
      >
        <Container maxWidth="xl">
          <Stack sx={styles.bannerContent} alignItems="Center">
            <Typography
              textTransform="uppercase"
              component="h1"
              variant="h1"
              color="text.white"
              textAlign="center"
              sx={{ lineHeight: '1' }}
            >
              Volunteer <br /> Campaign
            </Typography>
            <Paper variant="plainPaper" sx={{ px: 3, pt: 3, pb: 4, width: 1, mt: 5 }}>
              <Typography
                variant="h5"
                component="h2"
                color="text.secondarydark"
                textTransform="uppercase"
                sx={{ mb: 3 }}
              >
                {volunteerCampaignTitle}
              </Typography>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                flexWrap={{ xs: 'wrap' }}
                spacing={2}
                sx={{ width: '100%' }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Project Date & Time
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, pr: 3 }}>
                      <CalendarIcon />
                      <Typography component="p" variant="subtitle4" color="text.secondarydark">
                        {startDateTime ? fDateWithLocale(startDateTime) : '-'} {' - '}
                        {endDateTime ? fDateWithLocale(endDateTime) : '-'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <ClockIcon />
                      <Typography component="p" variant="subtitle4" color="text.secondarydark">
                        {startDateTime ? formatTime(startDateTime) : '-'} {' - '}
                        {endDateTime ? formatTime(endDateTime) : '-'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body3" color="text.secondary">
                    Location
                  </Typography>
                  <Typography component="p" variant="subtitle4" color="text.secondarydark" sx={{ mt: 0.5 }}>
                    {address || '-'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', lg: 'flex-end' },
                    alignItems: 'flex-start',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: { xs: '100%', lg: 'auto' },
                    mt: { xs: 2, md: '16px !important' }
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={enrollVolunteer}
                    endIcon={<img src="/icons/Arrow-Right.svg" alt="arrow icon" />}
                    sx={{ mt: 0.5 }}
                  >
                    Enroll
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ pt: 7 }}>
        <Typography variant="h5" color="text.secondarydark" component="h2" textTransform="uppercase">
          Introduction
        </Typography>
        <Typography variant="body1" component="p" color="text.secondarydark" sx={{ pt: 3 }}>
          {volunteerCampaignDescription}
        </Typography>
        <Box sx={{ pt: 4 }}>
          <Typography variant="h5" color="text.secondarydark" component="h2" sx={{ mb: 4 }} textTransform="uppercase">
            volunteer campaign details
          </Typography>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <LocationIcon sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  Location Details
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  {address || '-'}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <ClockIcon sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  Date & Time
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  {startDateTime ? fDateWithLocale(startDateTime, true) : '-'}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box sx={styles.iconContainer}>
                <TrueSignIcon sx={{ width: 24, height: 24 }} />
              </Box>
              <Stack
                spacing={2}
                sx={{
                  width: {
                    xs: '80%',
                    sm: '80%',
                    md: '100%'
                  }
                }}
              >
                <Typography variant="h7" color="text.secondarydark" textTransform="uppercase">
                  Selection Criteria
                </Typography>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Box
                      sx={{
                        borderTop: `5px solid ${theme.palette.text.black}`,
                        borderLeft: `1px solid ${theme.palette.divider}`,
                        borderRight: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRowComponent label="Gender Required" value={genderRequired} theme={theme} />
                            <TableRowComponent
                              label="Volunteer Required"
                              value={noOfVolunteersRequired}
                              theme={theme}
                            />
                            <TableRowComponent
                              label="Minimum Hours Required"
                              value={minimumHoursRequired}
                              theme={theme}
                            />
                            <TableRowComponent
                              label="Age Required"
                              value={fromAge && toAge ? `From ${fromAge} Years to ${toAge} Years` : '-'}
                              theme={theme}
                            />
                            <TableRowComponent
                              label="Nationality Required"
                              value={getNationalityLabels(nationalityRequired)}
                              theme={theme}
                            />
                            <TableRowComponent
                              label="Language Required"
                              value={languageRequired?.map((item) => item?.code).join(', ')}
                              theme={theme}
                            />
                            {customCriteria?.length > 0 &&
                              customCriteria?.map((item) => (
                                <TableRowComponent
                                  key={item?.id}
                                  label={item?.criteria}
                                  value={item?.criteriaRequirement}
                                  theme={theme}
                                />
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
