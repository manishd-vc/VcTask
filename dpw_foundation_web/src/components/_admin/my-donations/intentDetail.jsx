'use client'; // Indicates that the component is a client-side rendered component in Next.js
import { Grid, Stack, Typography } from '@mui/material'; // Import MUI components for layout and styling
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency'; // Custom hook to format currency
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { donorStatusColorSchema } from 'src/utils/util';

// IntentDetail component displays the details of an intent donation
const IntentDetail = ({ data }) => {
  // Initialize currency formatter for AED (Arab Emirate Dirham)
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  return (
    // Grid container to layout the form fields in a responsive grid
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography
              variant="subtitle4"
              sx={{
                color: (theme) => theme.palette[donorStatusColorSchema[data?.status]]?.main
              }}
            >
              {getLabelByCode(masterData, 'dpw_foundation_donor_status', data?.status)}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.secondary">
              Pledge ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.donationPledgeId ? data?.donationPledgeId : '-'}
            </Typography>
          </Stack>
        </Grid>
        {(data?.status == 'PLEDGE_REJECTED' || data?.status == 'REJECTED') && (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body2" color="text.secondary">
                Rejection Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {data?.updatedOn ? fDateWithLocale(data?.updatedOn) : '-'}
              </Typography>
            </Stack>
          </Grid>
        )}
        {/* Donor Type Section */}
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Registered As
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform={'capitalize'}>
              {data?.donorType ? data?.donorType : '-'} {/* Display donor type or '-' if missing */}
            </Typography>
          </Stack>
        </Grid>
        {data?.donorType === 'Organization' && (
          <>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Organization Name
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {data?.organizationName ? data?.organizationName : '-'}
                </Typography>
              </Stack>
            </Grid>
            {/* Organization Registration Number */}
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Organization Registration Number
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {data?.orgRegistrationNum ? data?.orgRegistrationNum : '-'}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {data?.donorType === 'Organization' ? 'Organization Contact Person First Name' : 'First Name'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {data?.firstName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {data?.donorType === 'Organization' ? 'Organization Contact Person Second Name' : 'Second Name'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {data?.lastName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {data?.donorType === 'Organization' ? 'Organization Contact Person Email ID' : 'Email ID'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.email ? data?.email : '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              {data?.donorType === 'Organization' ? 'Organization Contact Person Phone Number' : 'Phone Number'}
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.contactNumber ? data?.contactNumber : '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Pledge Amount (AED)
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.pledgeAmount ? fCurrency(data?.pledgeAmount) : '0.00'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction="column" gap={0.5}>
            <Typography variant="body3" color="text.secondary">
              Intent Description (Purpose of Donation)
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.intentDescription ? data?.intentDescription : '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
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
