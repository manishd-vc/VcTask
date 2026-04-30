'use client'; // Indicates that the component is a client-side rendered component in Next.js
import { Grid, Stack, Typography } from '@mui/material'; // Import MUI components for layout and styling
import PropTypes from 'prop-types';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency'; // Custom hook to format currency
import { fDateWithLocale } from 'src/utils/formatTime'; // Utility function to format date with locale

// IntentDetail component displays the details of an intent donation
const IntentDetail = ({ data }) => {
  // Initialize currency formatter for AED (Arab Emirate Dirham)
  const fCurrency = useCurrencyFormatter('AED');

  return (
    // Grid container to layout the form fields in a responsive grid
    <Grid container spacing={2}>
      {/* Donor Type Section */}
      <Grid item xs={12} md={3} px={1} mb={2}>
        <Stack>
          <Typography variant="body3" color="text.secondary">
            Donor Type
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {data?.donorPledgeResponse?.donorType ? data?.donorPledgeResponse?.donorType : '-'}{' '}
            {/* Display donor type or '-' if missing */}
          </Typography>
        </Stack>
      </Grid>

      {/* Conditional rendering based on the donor type */}
      {data?.donorPledgeResponse?.donorType === 'ORGANIZATION' && (
        <>
          {/* Organization Registration Number */}
          <Grid item xs={12} md={3} px={1} mb={2}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Org Registration Number
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.donorPledgeResponse?.orgRegistrationNum ? data?.donorPledgeResponse?.orgRegistrationNum : '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Person Name */}
          <Grid item xs={12} md={3} px={1} mb={2}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Contact Person name
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.donorPledgeResponse?.contactPersonName ? data?.donorPledgeResponse?.contactPersonName : '-'}
              </Typography>
            </Stack>
          </Grid>
        </>
      )}

      {/* Donor Name */}
      <Grid item xs={12} md={3} px={1} mb={2}>
        <Stack>
          <Typography variant="body3" color="text.secondary">
            Donor Full Name
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {data?.donorPledgeResponse?.donorName ? data?.donorPledgeResponse?.donorName : '-'}
          </Typography>
        </Stack>
      </Grid>

      {/* Email Address */}
      <Grid item xs={12} md={3} px={1} mb={2}>
        <Stack>
          <Typography variant="body3" color="text.secondary">
            Email ID
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {data?.donorPledgeResponse?.email ? data?.donorPledgeResponse?.email : '-'}
          </Typography>
        </Stack>
      </Grid>

      {/* Contact Number */}
      <Grid item xs={12} md={3} px={1} mb={2}>
        <Stack>
          <Typography variant="body3" color="text.secondary">
            Contact Number
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {data?.donorPledgeResponse?.contactNumber ? data?.donorPledgeResponse?.contactNumber : '-'}
          </Typography>
        </Stack>
      </Grid>

      {/* Donation Amount */}
      <Grid item xs={12} md={12} px={1} mb={2}>
        <Stack>
          <Typography variant="body3" color="text.secondary">
            Intent Description (Purpose of Donation)
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {data?.donorPledgeResponse?.intentDescription ? data?.donorPledgeResponse?.intentDescription : '-'}
            {/* Format donation amount */}
          </Typography>
        </Stack>
      </Grid>

      {/* Donation Amount */}
      <Grid item xs={12} md={12} px={1} mb={2}>
        <Stack direction="column" gap={0.5} mb={1}>
          <Typography variant="body3" color="text.secondary">
            Pledge Amount (AED)
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {data?.donorPledgeResponse?.donationAmount ? fCurrency(data?.donorPledgeResponse?.donationAmount) : '0.00'}{' '}
            {/* Format donation amount */}
          </Typography>
        </Stack>
      </Grid>

      {/* Conditional rendering for Individual donor type */}
      {data?.donorPledgeResponse?.donorType === 'INDIVIDUAL' && (
        <Grid item xs={12} md={4} px={1} mb={2}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              DOB
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.donorPledgeResponse?.dob ? fDateWithLocale(data?.donorPledgeResponse?.dob) : '-'}{' '}
              {/* Format date of birth */}
            </Typography>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

IntentDetail.propTypes = {
  data: PropTypes.shape({
    donorType: PropTypes.string,
    orgRegistrationNum: PropTypes.string,
    contactPersonName: PropTypes.string,
    donorName: PropTypes.string,
    donationAmount: PropTypes.number,
    email: PropTypes.string,
    contactNumber: PropTypes.string,
    nationalId: PropTypes.string,
    dob: PropTypes.string
  }).isRequired
};
// Export the IntentDetail component
export default IntentDetail;
