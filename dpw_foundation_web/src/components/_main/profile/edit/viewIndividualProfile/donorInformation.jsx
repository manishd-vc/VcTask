import { Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function DonorInformation({ user }) {
  // Extract the nested ternary operation for donation interest

  const getDonationInterestText = () => {
    if (user?.donationInterested === true) return 'Yes';
    if (user?.donationInterested === false) return 'No';
    return '-';
  };

  // Extract the nested ternary operation for preferred communication
  const getPreferredCommunicationText = () => {
    if (user?.communicationSubscription === true) return 'Yes';
    if (user?.communicationSubscription === false) return 'Not for now';
    return '-';
  };

  return (
    <>
      <Typography variant="h6" component="h6" textTransform={'uppercase'} color="primary.main" sx={{ pb: 3, pt: 2 }}>
        Donor Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Are you interested in Donation with DPW Foundation ?
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getDonationInterestText()}
            </Typography>
          </Stack>
        </Grid>
        {user?.donationInterested === true && (
          <>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  What type of donations would you like to contribute?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.contributionType || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Donation Acknowledgement Preferences
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {user?.acknowledgementPreference || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Subscribe to Newsletter ?
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getPreferredCommunicationText()}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

// Add PropTypes
DonorInformation.propTypes = {
  user: PropTypes.shape({
    donationInterested: PropTypes.bool,
    contributionType: PropTypes.string,
    acknowledgementPreference: PropTypes.string,
    preferredCommunication: PropTypes.bool
  }).isRequired
};
