import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { formatDateWithFallback } from 'src/utils/formatTime';

export default function DistributionsDetails({
  isSupervisor,
  campaignUpdateData,
  setOpenImpact,
  handleOpenModal,
  masterData,
  beneficiaryProject
}) {
  const isGe = campaignUpdateData?.campaignCategory === 'GE';
  const isCompleted = campaignUpdateData?.status === 'COMPLETED';
  return (
    !isGe && (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Sector / Focus Area
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_campaign_category', campaignUpdateData?.campaignCategory)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Project Coverage
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {getLabelByCode(masterData, 'dpw_foundation_campaign_coverage', campaignUpdateData?.campaignCoverage)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Sector Distribution Description
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.estimatedDistributionDescription || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Estimated Distribution Value
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.estimatedDistributionValue || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Type Of Beneficiary
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.beneficiaryType || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                No Of Beneficiary
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.targetBeneficiaryNo || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Target Beneficiary Description
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.targetBeneficiaryDescription || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Estimated Distribution Start Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {formatDateWithFallback(campaignUpdateData?.estimatedDistributionStartDate)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Stack flexDirection="column">
              <Typography variant="body3" color="text.secondary">
                Estimated Distribution End Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {formatDateWithFallback(campaignUpdateData?.estimatedDistributionEndDate)}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {!isSupervisor && (
          <>
            <Typography variant="h6" textTransform={'uppercase'} color="primary.main" sx={{ py: 3 }}>
              Distribution Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Actual Distribution Value
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.actualDistributionValue || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Actual Benefited Value
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.actualImpactValue || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Actual Distribution Start Date
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {formatDateWithFallback(campaignUpdateData?.actualDistributionStartTime)}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Actual Distribution End Date
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {formatDateWithFallback(campaignUpdateData?.actualDistributionEndTime)}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.distributionStatus || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="h6" textTransform={'uppercase'} color="primary.main" sx={{ py: 3 }}>
                Update Impact Details
              </Typography>
              {isCompleted && !beneficiaryProject && (
                <Button variant="contained" size="small" onClick={() => setOpenImpact(true)}>
                  Update Impact details
                </Button>
              )}
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Impact Description
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.impactDescription || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Impact Unit /Measure
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.impactUnit || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Target Impact Number
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.targetImpactValue || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Actual Impact Number
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.actualImpactValue || '-'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </>
        )}

        {isSupervisor && (
          <>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="h6" textTransform={'uppercase'} color="primary.main" sx={{ py: 3 }}>
                Update Distribution Details
              </Typography>
              <Button variant="contained" size="small" onClick={() => handleOpenModal(campaignUpdateData)}>
                Update Distribution
              </Button>
            </Box>
            <Card variant="borderednoshadow">
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        Actual Distribution Value
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {campaignUpdateData?.actualDistributionValue || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        Actual Benefited
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {campaignUpdateData?.actualBeneficiaryNo || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        Actual Distribution Start Date
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {formatDateWithFallback(campaignUpdateData?.actualDistributionStartTime)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        Actual Distribution End Date
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {formatDateWithFallback(campaignUpdateData?.actualDistributionEndTime)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {campaignUpdateData?.distributionStatus || '-'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </>
    )
  );
}
