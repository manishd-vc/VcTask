'use client';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getMatchingString } from 'src/utils/onSpotUtils';
import { donorStatusColorSchema } from 'src/utils/util';

/**
 * ViewDonorInfo component
 *
 * Displays details about the donor record, including donor status,
 * created by, created on, updated by, and updated on. Each field is displayed in a grid layout.
 *
 * return <ViewDonorInfo />;
 */
export default function ViewDonorInfo({ donorData, donationTypeData }) {
  const { masterData } = useSelector((state) => state?.common);

  const { data: campaignsList } = useQuery(['getCampaign', donorData?.campaignId], api.getCampaignListing, {
    enabled: !!donorData?.campaignId
  });

  const campaign = getMatchingString(campaignsList?.data, donorData?.campaignId, 'campaignId', 'campaignTitle');
  const donorType = getMatchingString(donationTypeData?.values, donorData?.donationType, 'code');

  const renderInfoItem = (label, value) => (
    <Stack direction="column" gap={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
        {value || '-'}
      </Typography>
    </Stack>
  );

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {renderInfoItem('Record Created By', donorData?.createdBy)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderInfoItem('Record Created On', donorData?.createdOn ? fDateWithLocale(donorData.createdOn) : null)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderInfoItem('Record Updated By', donorData?.updatedBy)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {renderInfoItem('Record Updated On', donorData?.updatedOn ? fDateWithLocale(donorData.updatedOn) : null)}
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Stack direction="column" gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Status
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                <Typography
                  variant="subtitle4"
                  sx={{
                    color: (theme) => theme.palette[donorStatusColorSchema[donorData?.status]]?.main
                  }}
                >
                  {getLabelByCode(masterData, 'dpw_foundation_donor_status', donorData?.status)}
                </Typography>
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderInfoItem('Donation Type', donorType)}
          </Grid>
          {donorData?.donationType !== 'GENERAL' ? (
            <Grid item xs={12} sm={6} md={4}>
              {renderInfoItem('Campaign/Project', campaign)}
            </Grid>
          ) : (
            ''
          )}
        </Grid>
      </Paper>
    </>
  );
}

ViewDonorInfo.propTypes = {
  donorData: PropTypes.shape({
    status: PropTypes.string,
    createdBy: PropTypes.string,
    createdByName: PropTypes.string,
    createdOn: PropTypes.string,
    updatedByName: PropTypes.string,
    updatedBy: PropTypes.string,
    updatedOn: PropTypes.string,
    registeredAs: PropTypes.string,
    donationType: PropTypes.string,
    campaignId: PropTypes.string
  }),
  donationTypeData: PropTypes.shape({
    values: PropTypes.array
  })
};

ViewDonorInfo.defaultProps = {
  donorData: {}
};
