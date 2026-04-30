import { Box, Checkbox, FormControlLabel, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { donorStatusColorSchema } from 'src/utils/util';

/**
 * IntentDetails component displays detailed information about the donor intent.
 * It fetches donor data from the Redux store and formats the values for display.
 *
 * @returns {JSX.Element} The component rendering the donor details.
 */
const IntentDetails = ({ type, isDisabled, hasAllInfo, setHasAllInfo, isView }) => {
  const { getDonorAdminData } = useSelector((state) => state.donor); // Accessing donor data from Redux store
  const { masterData } = useSelector((state) => state?.common);

  const disabledStatusAdmin = [
    'AWAITING_APPROVAL',
    'ASSESSMENT_MORE_INFO_REQUIRED',
    'ASSESSMENT_REJECTED',
    'READY_TO_DONATE',
    'PLEDGE_REJECTED',
    'DONOR_MORE_INFO_REQUIRED',
    'DONATED',
    'AWAITING_DOCUMENT_CREATION',
    'AWAITING_DOCUMENT_APPROVAL',
    'DOCUMENT_MORE_INFO_REQUIRED'
  ];

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setHasAllInfo(checked);
  };

  const disabled = disabledStatusAdmin.includes(getDonorAdminData?.donorPledgeResponse?.status) || isView;
  const fCurrency = useCurrencyFormatter(getDonorAdminData?.donorPledgeResponse?.donationCurrency);

  return (
    <>
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          Donation Pledge
        </Typography>
        <Grid container spacing={2}>
          {/* {!isView && ( */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Status
              </Typography>
              <Typography
                variant="subtitle4"
                sx={{
                  color: (theme) =>
                    theme.palette[donorStatusColorSchema[getDonorAdminData?.donorPledgeResponse?.status]]?.main
                }}
              >
                {getLabelByCode(
                  masterData,
                  'dpw_foundation_donor_status',
                  getDonorAdminData?.donorPledgeResponse?.status
                )}
              </Typography>
            </Stack>
          </Grid>
          {/* )} */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Pledge ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.donationPledgeId || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Registered As
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.donorType || '-'}
              </Typography>
            </Stack>
          </Grid>
          {getDonorAdminData?.donorPledgeResponse?.donorType === 'Organization' && (
            <>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Stack direction="column" gap={0.5}>
                  <Typography variant="body3" color="text.secondary">
                    Organization Name
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {getDonorAdminData?.donorPledgeResponse?.organizationName
                      ? getDonorAdminData?.donorPledgeResponse?.organizationName
                      : '-'}
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
                    {getDonorAdminData?.donorPledgeResponse?.orgRegistrationNum
                      ? getDonorAdminData?.donorPledgeResponse?.orgRegistrationNum
                      : '-'}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
          {/* Donor Name */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getDonorAdminData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person First Name'
                  : 'First Name'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {getDonorAdminData?.firstName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getDonorAdminData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person Second Name'
                  : 'Second Name'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {getDonorAdminData?.lastName || '-'}
              </Typography>
            </Stack>
          </Grid>
          {/* Email */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getDonorAdminData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person Email ID'
                  : 'Email ID'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.email || '-'}
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Number */}
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                {getDonorAdminData?.donorPledgeResponse?.donorType === 'Organization'
                  ? 'Organization Contact Person Phone Number'
                  : 'Phone Number'}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.mobile || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <Stack direction="column" gap={0.5} mb={1}>
              <Typography variant="body3" color="text.secondary">
                Pledge Amount (AED)
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {(getDonorAdminData?.donorPledgeResponse?.pledgeAmount &&
                  fCurrency(getDonorAdminData?.donorPledgeResponse?.pledgeAmount)) ||
                  '-'}
              </Typography>
            </Stack>
          </Grid>
          {/* National ID */}
          <Grid item xs={12} sm={12}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Intent Description (Purpose of Donation)
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.intentDescription || '-'}
              </Typography>
            </Stack>
          </Grid>
          {/* Donation Amount */}
        </Grid>
      </Paper>
      {!isView && (
        <Paper sx={{ p: 3, my: 3 }}>
          <Typography variant="subtitle4" color="text.black" sx={{ pb: 3 }}>
            Procced to fill the donor information form if you have all the donor information{' '}
          </Typography>
          <Box sx={{ ml: '-10px' }}>
            <FormControlLabel
              control={
                <Tooltip
                  title="As an admin, you can complete this form on behalf of the donor and forward it for further approvals."
                  arrow
                >
                  <Checkbox disabled={disabled} checked={!!hasAllInfo} onChange={handleCheckboxChange} />
                </Tooltip>
              }
              label={'I have all the donor information'}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default IntentDetails;
