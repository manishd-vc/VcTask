import { Box, Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function AdditionalDetails({ downloadMediaFile }) {
  const { financeDonationData } = useSelector((state) => state?.finance);
  const {
    accountType,
    acknowledgementPreference,
    communicationSubscription,
    isDpwEmployee,
    employeeId,
    companyName,
    department,
    isGovAffiliate,
    orgAttachments
  } = financeDonationData || {};
  const isIndividual = accountType === 'Individual';
  let govAffiliateLabel = '-';
  if (isGovAffiliate === true) {
    govAffiliateLabel = 'Yes';
  } else if (isGovAffiliate === false || isGovAffiliate === null) {
    govAffiliateLabel = 'No';
  }
  let dpwEmployeeLabel = '-';
  if (isDpwEmployee === true) {
    dpwEmployeeLabel = 'Yes';
  } else if (isDpwEmployee === false || isDpwEmployee === null) {
    dpwEmployeeLabel = 'No';
  }
  let communicationSubscriptionLabel = '-';
  if (communicationSubscription === true) {
    communicationSubscriptionLabel = 'Yes';
  } else if (communicationSubscription === false || communicationSubscription === null) {
    communicationSubscriptionLabel = 'No';
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Additional Details
        </Typography>
      </Grid>
      {!isIndividual && (
        <Grid item xs={12} md={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Organization Related Documents Attachments
            </Typography>
            <Stack flexDirection="row" flexWrap="wrap" alignItems="center" gap={1.2}>
              {orgAttachments && Array.from(orgAttachments)?.length > 0 ? (
                Array.from(orgAttachments).map((file, index) => (
                  <Box key={file?.id}>
                    <Typography component="div" variant="subtitle4" color="text.secondarydark">
                      <Box
                        component="span"
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={(event) => downloadMediaFile(event, file?.id)}
                      >
                        {file?.fileName ? file.fileName : '-'}
                      </Box>
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="subtitle4" color="text.secondarydark">
                  -
                </Typography>
              )}
            </Stack>
          </Stack>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Donation acknowledgement preferences
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {acknowledgementPreference || '-'}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Subscribe to Newsletter?
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {communicationSubscriptionLabel}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Is the donor is an employee of DP World group or its Sister Organizations? *
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {dpwEmployeeLabel}
          </Typography>
        </Stack>
      </Grid>
      {isDpwEmployee && (
        <>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Employee ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {employeeId || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Company Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {companyName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Department Name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {department || '-'}
              </Typography>
            </Stack>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Stack direction="column" gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Is the donor a Govt. institution or an organization affiliated with Govt. in UAE?
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {govAffiliateLabel}
          </Typography>
        </Stack>
      </Grid>
    </>
  );
}

AdditionalDetails.propTypes = {
  downloadMediaFile: PropTypes.func.isRequired
};
