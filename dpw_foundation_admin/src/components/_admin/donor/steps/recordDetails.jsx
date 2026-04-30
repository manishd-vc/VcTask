import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDateWithLocale } from 'src/utils/formatTime';

/**
 * RecordDetails component displays detailed information about the donor intent.
 * It fetches donor data from the Redux store and formats the values for display.
 *
 * @returns {JSX.Element} The component rendering the donor details.
 */
const RecordDetails = () => {
  const { getDonorAdminData } = useSelector((state) => state.donor); // Accessing donor data from Redux store

  return (
    <>
      <Paper sx={{ p: 3, my: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Record Created By
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
                {getDonorAdminData?.donorPledgeResponse?.createdByName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Record Created On
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.createdOn
                  ? fDateWithLocale(getDonorAdminData.donorPledgeResponse.createdOn)
                  : '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Record Updated By
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.updatedByName || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Record Updated On
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getDonorAdminData?.donorPledgeResponse?.updatedOn
                  ? fDateWithLocale(getDonorAdminData.donorPledgeResponse.updatedOn)
                  : '-'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default RecordDetails;
