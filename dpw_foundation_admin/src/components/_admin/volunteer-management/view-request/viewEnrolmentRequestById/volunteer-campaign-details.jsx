'use client';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { formatDateWithFallback } from 'src/utils/formatTime';

const FieldDisplay = ({ label, value, textTransform, color, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle4"
        color="text.secondarydark"
        textTransform={textTransform}
        sx={color ? { color: (theme) => theme.palette[color]?.main } : {}}
      >
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function VolunteerCampaignDetails({ enrollmentData }) {
  const { volunteerCampaign, waiverFormContent } = enrollmentData || {};
  const [openWaiverDialog, setOpenWaiverDialog] = useState(false);
  const theme = useTheme();
  const style = { ...CommonStyle(theme), ...ModalStyle(theme) };

  const handleOpenWaiver = () => {
    setOpenWaiverDialog(true);
  };

  const handleCloseWaiver = () => {
    setOpenWaiverDialog(false);
  };
  const { masterData } = useSelector((state) => state?.common);

  // Fetching country data
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());

  const nationalityLabels =
    volunteerCampaign?.nationalityRequired?.length > 0
      ? volunteerCampaign.nationalityRequired
          .map((nationality) => {
            const countryData = country?.find((c) => c.code === nationality.code);
            return countryData?.label;
          })
          .filter(Boolean)
          .join(', ')
      : '-';

  const languageLabels =
    volunteerCampaign?.languageRequired?.length > 0
      ? volunteerCampaign.languageRequired
          .map((language) => getLabelByCode(masterData, 'dpwf_language', language.code))
          .filter(Boolean)
          .join(', ')
      : '-';

  const campaignFields = [
    { label: 'Volunteer Campaign Title', value: volunteerCampaign?.volunteerCampaignTitle },
    {
      label: 'Volunteer Campaign Description',
      value: volunteerCampaign?.volunteerCampaignDescription
    },
    {
      label: 'Campaign Start Date',
      value: formatDateWithFallback(volunteerCampaign?.startDateTime)
    },
    {
      label: 'Campaign End Date',
      value: formatDateWithFallback(volunteerCampaign?.endDateTime)
    },
    {
      label: 'Region',
      value: getLabelByCode(masterData, 'dpwf_volunteer_region', volunteerCampaign?.region) || '-'
    },
    { label: 'Organization Name', value: volunteerCampaign?.organizationName },
    { label: 'Address Line 1', value: volunteerCampaign?.addressLineOne },
    { label: 'Address Line 2', value: volunteerCampaign?.addressLineTwo },
    { label: 'Country', value: volunteerCampaign?.countryName },
    { label: 'State/Province', value: volunteerCampaign?.stateName },
    { label: 'City', value: volunteerCampaign?.city },
    {
      label: 'Event Type',
      value: getLabelByCode(masterData, 'dpwf_volunteer_event_type', volunteerCampaign?.eventType) || '-'
    }
  ];

  const enrollmentFields = [
    {
      label: 'Enrolment Start Date',
      value: formatDateWithFallback(volunteerCampaign?.enrollmentStartDateTime)
    },
    {
      label: 'Enrolment End Date',
      value: formatDateWithFallback(volunteerCampaign?.enrollmentEndDateTime)
    },
    {
      label: 'Gender Required',
      value: getLabelByCode(masterData, 'dpwf_volunteer_gender', volunteerCampaign?.genderRequired) || '-'
    },
    { label: 'Volunteers Required', value: volunteerCampaign?.noOfVolunteersRequired || '-' },
    { label: 'Minimum Hours Required', value: volunteerCampaign?.minimumHoursRequired },
    {
      label: 'From Age',
      value: volunteerCampaign?.fromAge || '-'
    },
    { label: 'To Age', value: volunteerCampaign?.toAge || '-' },
    { label: 'Nationality Required', value: nationalityLabels },
    { label: 'Language Required', value: languageLabels }
  ];

  return (
    <>
      <Typography variant="h6" color="primary.main" sx={{ mb: 3 }} textTransform={'uppercase'}>
        Volunteer Campaign Details
      </Typography>

      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 3 }}>
        Campaign Details
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {campaignFields?.map((field) => (
          <FieldDisplay
            key={`${field.label}-${field.value}`}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            color={field?.color}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>

      <Typography variant="subtitle6" color="primary.main" component="h4" textTransform={'uppercase'} sx={{ mb: 3 }}>
        Volunteer Enrolment and Selection Criteria
      </Typography>
      <Grid container spacing={3}>
        {enrollmentFields?.map((field) => (
          <FieldDisplay
            key={`${field.label}-${field.value}`}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            color={field?.color}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>

      <Typography component="h4" variant="subtitle4" color="text.black" sx={{ mb: 3, mt: 3 }}>
        Custom Criteria
      </Typography>
      <Box
        sx={{
          ...style.documentCard
        }}
      >
        {volunteerCampaign?.customCriteria?.length > 0 ? (
          volunteerCampaign.customCriteria.map((criteria) => (
            <Grid container spacing={3} key={criteria.id}>
              <FieldDisplay label="Criteria" value={criteria.criteria} gridProps={criteria?.gridProps} />
              <FieldDisplay
                label="Criteria Requirement"
                value={criteria.criteriaRequirement}
                gridProps={criteria?.gridProps}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No Custom Criteria available
          </Typography>
        )}
      </Box>
      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={enrollmentData?.termsAndConditionsWaiverAccepted || false} disabled />}
            label={
              <span>
                I accept and agree to the terms of this waiver.{' '}
                <Link
                  component="button"
                  variant="blue"
                  size="small"
                  onClick={handleOpenWaiver}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  View Waiver
                </Link>
              </span>
            }
          />
        </Grid>
      </Grid>

      {/* Waiver Dialog */}
      <Dialog open={openWaiverDialog} onClose={handleCloseWaiver} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main">
          Waiver form
        </DialogTitle>
        {/* Close button */}
        <IconButton aria-label="close" onClick={handleCloseWaiver} sx={style.closeModal}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body2">
            Thank you for volunteering to help with the DP World Foundation in{' '}
            {volunteerCampaign?.volunteerCampaignTitle || 'this campaign'}. Please read, complete, and sign the
            following form to participate in this campaign.
          </Typography>
          <Typography
            variant="subtitle4"
            color="text.black"
            component="h4"
            textTransform={'uppercase'}
            sx={{ mb: 2, mt: 3 }}
          >
            VOLUNTEER INFORMATION
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {`${enrollmentData?.firstName || ''} ${enrollmentData?.lastName || ''}`.trim() || '-'}
                </Typography>{' '}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Phone or email
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {enrollmentData?.phoneNumber || enrollmentData?.email || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {enrollmentData?.homeAddress || '-'}
                </Typography>
                <Typography variant="body1" color="text.secondarydark">
                  <i>
                    <small>(Optional if you would like us to contact you for future volunteer event)</small>
                  </i>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Typography
            variant="subtitle4"
            color="text.black"
            component="h4"
            textTransform={'uppercase'}
            sx={{ mb: 2, mt: 3 }}
          >
            EMERGENCY CONTACT INFORMATION
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {enrollmentData?.emergencyContactName || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {enrollmentData?.emergencyContactNumber || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Relationship to Volunteer
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {enrollmentData?.relationWithEmergencyContact || '-'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Typography
            variant="subtitle4"
            color="text.black"
            component="h4"
            textTransform={'uppercase'}
            sx={{ mb: 2, mt: 3 }}
          >
            VOLUNTEER AGREEMENT
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography variant="body2">
                {' '}
                <div dangerouslySetInnerHTML={{ __html: waiverFormContent || 'No waiver content available' }} />
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
