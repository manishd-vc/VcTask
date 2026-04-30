import { Button, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateFundSupervisor from 'src/components/dialog/updateFundSupervisor';
import { getLabelByCode } from 'src/utils/extractLabelByCode';

export default function FundingInformation({ isSupervisor, campaignUpdateData, refetchCampaignApi }) {
  const [openFundAddModal, setOpenFundAddModal] = useState(false);
  const { masterData } = useSelector((state) => state?.common);

  const isFundCamp = campaignUpdateData?.campaignType === 'FUNDCAMP';

  return (
    <>
      <Grid container spacing={3}>
        {/* First Row */}
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Estimated Expenses
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.campaignTargetRequired || '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Campaign Fund Source
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(
                masterData,
                'dpw_foundation_project_fund_source',
                campaignUpdateData?.campaignProjectSource
              ) || '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Currency
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(
                masterData,
                'dpw_foundation_currency',
                campaignUpdateData?.campaignTargetRequiredCurrency
              ) || '-'}
            </Typography>
          </Stack>
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Sector / Focus Area
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_campaign_category', campaignUpdateData?.campaignCategory) ||
                '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Campaign Ref. No
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.campaignRef || '-'}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <Stack flexDirection="column">
            <Typography variant="body3" color="text.secondary">
              Campaign Coverage
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_campaign_coverage', campaignUpdateData?.campaignCoverage) ||
                '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {isFundCamp && isSupervisor && (
        <>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              my: 3
            }}
          >
            <Typography variant="h6" component="p" textTransform={'uppercase'} color="text.black">
              Update Fund Utilization
            </Typography>
            <Button variant="contained" onClick={() => setOpenFundAddModal(true)}>
              Update Utilization
            </Button>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <Stack flexDirection="column">
                <Typography variant="body3" color="text.secondary">
                  Actual Fund Spend
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.fundsSpent || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={9}>
              <Stack flexDirection="column">
                <Typography variant="body3" color="text.secondary">
                  Fund Utilization Description
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.fundUtilizationDescription || '-'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <UpdateFundSupervisor
            data={campaignUpdateData}
            open={openFundAddModal}
            onClose={() => setOpenFundAddModal(false)}
            refetchCampaignApi={refetchCampaignApi}
          />
        </>
      )}
    </>
  );
}
