'use client';
import { Card, CardContent, Grid, Paper, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ReusableTable from 'src/components/table/ReusableTable';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { formatDateWithFallback } from 'src/utils/formatTime';

export default function ProjectDistributionsView({ campaignUpdateData }) {
  const { masterData } = useSelector((state) => state?.common);
  const fCurrency = useCurrencyFormatter('AED');
  const isGe = campaignUpdateData?.campaignCategory === 'GE';

  const distributions = Array.isArray(campaignUpdateData?.distributions) ? campaignUpdateData.distributions : [];

  // Use actual values from API response
  const actualBeneficiariesBenefited = campaignUpdateData?.actualBeneficiaryNo || 0;
  const actualFundDispensed = campaignUpdateData?.actualDistributionValue || 0;

  const distributionHeaders = [
    { label: 'Sector Name', key: 'distributionCategory' },
    { label: 'EST Distribution Value (AED)', key: 'estimatedDistributionValue' },
    { label: 'Actual Distribution Value (AED)', key: 'actualDistributionValue' },
    { label: 'Target Beneficiary', key: 'targetBeneficiaryNo' },
    { label: 'Actual Benefited', key: 'actualBenefited' },
    { label: 'Target Distribution Start Date', key: 'distributionStartTime' },
    { label: 'Actual Distribution Start Date', key: 'actualDistributionStartDate' },
    { label: 'Actual Distribution End Date', key: 'actualDistributionEndDate' },
    { label: 'Impact Status', key: 'status' },
    { label: 'Impact Description', key: 'impactDescription' },
    { label: 'Impact Unit / Measure', key: 'impactUnit' },
    { label: 'Target Impact Number', key: 'targetImpactNumber' },
    { label: 'Actual Impact number', key: 'actualImpactNumber' },
    { label: 'Success Rate', key: 'successRate' }
  ];

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      {isGe ? (
        <>
          <Typography variant="h6" textTransform="uppercase" color="primary.main" sx={{ mb: 3 }}>
            Campaign Distributions
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="bordered">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Actual Beneficiaries Benefited
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {actualBeneficiariesBenefited.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="bordered">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Actual Fund Dispensed
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {fCurrency(actualFundDispensed)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <ReusableTable headers={distributionHeaders}>
            {distributions.map((item) => (
              <TableRow key={`${item?.id || 'row'}`}>
                <TableCell>
                  {getLabelByCode(masterData, 'dpw_foundation_campaign_category', item?.distributionCategory) || '-'}
                </TableCell>
                <TableCell>{item?.estimatedDistributionValue?.toLocaleString() || '-'}</TableCell>
                <TableCell>{item?.actualDistributionValue?.toLocaleString() || '-'}</TableCell>
                <TableCell>{item?.targetBeneficiaryNo || '-'}</TableCell>
                <TableCell>{item?.actualBeneficiaryNo || '-'}</TableCell>
                <TableCell>
                  {item?.distributionStartTime ? formatDateWithFallback(item.distributionStartTime, true) : '-'}
                </TableCell>
                <TableCell>
                  {item?.actualDistributionStartTime
                    ? formatDateWithFallback(item.actualDistributionStartTime, true)
                    : '-'}
                </TableCell>
                <TableCell>
                  {item?.actualDistributionEndTime ? formatDateWithFallback(item.actualDistributionEndTime, true) : '-'}
                </TableCell>
                <TableCell>
                  {getLabelByCode(masterData, 'dpw_foundation_campaign_distribution_status', item?.status) || '-'}
                </TableCell>
                <TableCell>{item?.impactDescription || '-'}</TableCell>
                <TableCell>{item?.impactUnit || '-'}</TableCell>
                <TableCell>{item?.targetImpactValue || '-'}</TableCell>
                <TableCell>{item?.actualImpactValue || '-'}</TableCell>
                <TableCell>{item?.successRate || '0'}%</TableCell>
              </TableRow>
            ))}
          </ReusableTable>
        </>
      ) : (
        <>
          <Typography variant="h6" textTransform="uppercase" color="primary.main" sx={{ mb: 3 }}>
            Project Distributions
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="bordered">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Actual Beneficiaries Benefited
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {actualBeneficiariesBenefited.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card variant="bordered">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Actual Fund Dispensed
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {fCurrency(actualFundDispensed)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Stack sx={{ mb: 3 }}>
            <Typography variant="body3" color="text.secondary">
              Sector / Focus Area
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpw_foundation_campaign_category', campaignUpdateData?.campaignCategory) ||
                '-'}
            </Typography>
          </Stack>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack flexDirection="column">
                <Typography variant="body3" color="text.secondary">
                  Project Coverage
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {getLabelByCode(
                    masterData,
                    'dpw_foundation_campaign_coverage',
                    campaignUpdateData?.campaignCoverage
                  ) || '-'}
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
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Estimated Distribution Value (AED)
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.estimatedDistributionValue
                    ? fCurrency(campaignUpdateData.estimatedDistributionValue)
                    : '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Type Of Beneficiary
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.beneficiaryType || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Target Beneficiaries
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.totalBeneficiaryNo || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Target Beneficiary Description
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.targetBeneficiaryDescription || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Target Distribution Start Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {formatDateWithFallback(campaignUpdateData?.estimatedDistributionStartDate)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Target Distribution End Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {formatDateWithFallback(campaignUpdateData?.estimatedDistributionEndDate)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Typography variant="h6" textTransform="uppercase" color="primary.main" sx={{ mb: 3, mt: 4 }}>
            Distribution Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Actual Distribution Value (AED)
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.actualDistributionValue || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Actual Benefited
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.actualImpactValue || '-'}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Actual Distribution Start Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {formatDateWithFallback(campaignUpdateData?.actualDistributionStartTime)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Actual Distribution End Date
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {formatDateWithFallback(campaignUpdateData?.actualDistributionEndTime)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.distributionStatus || '-'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
}
