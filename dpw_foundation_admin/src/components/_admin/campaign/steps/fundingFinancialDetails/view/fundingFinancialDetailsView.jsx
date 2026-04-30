import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProjectDistributions from 'src/components/dialog/projectDistributions';
import UpdatePostProjectDetails from 'src/components/dialog/updatePostProjectDetails';
import { EditIcon } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency'; // Custom hook to format currency
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { formatDateWithFallback } from 'src/utils/formatTime';

import Export from '../../export';
import DistributionModalView from './distributionModalView';
import DistributionsDetails from './distributionsDetails';
import FundingInformation from './fundingInformation';

export default function FundingFinancialDetailsView({ isSupervisor, refetchCampaignApi, beneficiaryProject }) {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const { masterData } = useSelector((state) => state?.common);
  const distributions = Array.isArray(campaignUpdateData?.distributions) ? campaignUpdateData.distributions : [];
  const [distributionData, setDistributionData] = useState({});

  const handleOpenModal = (data) => {
    setOpen(true);
    setDistributionData(data);
  };
  const [open, setOpen] = useState(false);
  const [openImpact, setOpenImpact] = useState(false);
  const [rowData, setRowData] = useState(null);

  const handleOpenImpactModal = (data) => {
    setOpenImpact(true);
    setRowData(data);
  };

  const tableHeaders = [
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

  const isFundCamp = campaignUpdateData?.campaignType === 'FUNDCAMP';
  const isOngoing = campaignUpdateData?.status === 'ONGOING';
  const isGe = campaignUpdateData?.campaignCategory === 'GE';

  const fCurrency = useCurrencyFormatter('AED');

  const canShowActionColumn = isOngoing && isSupervisor;

  if (canShowActionColumn) {
    tableHeaders.push({ label: 'Action', key: 'action' });
  }

  const labels = {
    estimated: isFundCamp ? 'Estimated Expenses' : 'Estimated Fund Required',
    fundSource: isFundCamp ? 'Campaign Fund Source' : 'Project Fund Source'
  };

  return (
    <Paper sx={{ p: 3 }}>
      {isFundCamp ? (
        <FundingInformation
          isSupervisor={isSupervisor}
          campaignUpdateData={campaignUpdateData}
          refetchCampaignApi={refetchCampaignApi}
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {isGe && (
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Total Target Beneficiaries
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {campaignUpdateData?.totalBeneficiaryNo}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Estimated Distribution Value (AED)
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {campaignUpdateData?.totalDistributionValue
                              ? fCurrency(campaignUpdateData?.totalDistributionValue)
                              : '0.00'}{' '}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Actual Beneficiaries Benefited
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {distributions?.reduce((acc, curr) => acc + curr.actualBeneficiaryNo, 0) || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Actual Fund Dispensed
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {distributions?.reduce((acc, curr) => acc + curr.actualDistributionValue, 0) || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {!isGe && (
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Total Target Beneficiaries
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {campaignUpdateData?.totalBeneficiaryNo}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Estimated Distribution Value (AED)
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {campaignUpdateData?.totalDistributionValue
                              ? fCurrency(campaignUpdateData?.totalDistributionValue)
                              : '0.00'}{' '}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Actual Beneficiaries Benefited
                          </Typography>
                          <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                            {campaignUpdateData?.actualBeneficiaryNo || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} display="flex">
                    <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
                      <Card variant="bordered" sx={{ height: '100%', wordBreak: 'break-all' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondarydark">
                            Actual Fund Dispensed
                          </Typography>
                          <Typography variant="h6" color="warning.main">
                            {campaignUpdateData?.actualDistributionValue || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        {labels.estimated}
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {campaignUpdateData?.campaignTargetRequired}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Stack flexDirection="column">
                      <Typography variant="body3" color="text.secondary">
                        {labels.fundSource}
                      </Typography>
                      <Typography variant="subtitle4" color="text.secondarydark">
                        {getLabelByCode(
                          masterData,
                          'dpw_foundation_project_fund_source',
                          campaignUpdateData?.campaignProjectSource
                        )}
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
                        )}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {/* Additional Grid Data */}

            {isGe && (
              <>
                <Grid item xs={12} sm={6} lg={4}>
                  <Stack flexDirection="column">
                    <Typography variant="body3" color="text.secondary">
                      {labels.estimated}
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {campaignUpdateData?.campaignTargetRequired}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                  <Stack flexDirection="column">
                    <Typography variant="body3" color="text.secondary">
                      {labels.fundSource}
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {getLabelByCode(
                        masterData,
                        'dpw_foundation_project_fund_source',
                        campaignUpdateData?.campaignProjectSource
                      )}
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
                      )}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                  <Stack flexDirection="column">
                    <Typography variant="body3" color="text.secondary">
                      Sector / Focus Area
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {getLabelByCode(
                        masterData,
                        'dpw_foundation_campaign_category',
                        campaignUpdateData?.campaignCategory
                      )}
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
                      Project Coverage
                    </Typography>
                    <Typography variant="subtitle4" color="text.secondarydark">
                      {getLabelByCode(
                        masterData,
                        'dpw_foundation_campaign_coverage',
                        campaignUpdateData?.campaignCoverage
                      )}
                    </Typography>
                  </Stack>
                </Grid>{' '}
              </>
            )}
          </Grid>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" textTransform={'uppercase'} color="primary.main" sx={{ py: 3 }}>
                Project Distributions
              </Typography>{' '}
            </Grid>
            <Grid item xs={12} md={4} sx={{ py: 2, textAlign: 'right' }}>
              {isGe && <Export id={campaignUpdateData?.id} type={'CAMPAIGN_DISTRIBUTION'} />}
            </Grid>
          </Grid>
          {!isGe && (
            <>
              <DistributionsDetails
                isSupervisor={isSupervisor}
                campaignUpdateData={campaignUpdateData}
                setOpenImpact={setOpenImpact}
                handleOpenModal={handleOpenModal}
                masterData={masterData}
                beneficiaryProject={beneficiaryProject}
              />
              <ProjectDistributions
                open={open}
                onClose={() => setOpen(false)}
                distributionData={distributionData}
                isSingleDistribution={!isGe && isSupervisor}
                refetchCampaignApi={refetchCampaignApi}
              />
              <UpdatePostProjectDetails
                open={openImpact}
                onClose={() => setOpenImpact(false)}
                data={campaignUpdateData}
                refetchCampaignApi={refetchCampaignApi}
                isSingleDistribution={!isGe}
              />
            </>
          )}
          {isGe && (
            <>
              <ReusableTable headers={tableHeaders}>
                {distributions?.length > 0 ? (
                  distributions.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>
                        {getLabelByCode(masterData, 'dpw_foundation_campaign_category', item?.distributionCategory) ||
                          '-'}
                      </TableCell>
                      <TableCell>{item?.estimatedDistributionValue?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{item?.actualDistributionValue || '-'}</TableCell>
                      <TableCell>{item?.targetBeneficiaryNo || '-'}</TableCell>
                      <TableCell>{item?.actualBeneficiaryNo || '-'}</TableCell>
                      <TableCell>
                        {(item?.distributionStartTime && formatDateWithFallback(item?.distributionStartTime, true)) ||
                          '-'}
                      </TableCell>
                      <TableCell>
                        {(item?.actualDistributionStartTime &&
                          formatDateWithFallback(item?.actualDistributionStartTime, true)) ||
                          '-'}
                      </TableCell>
                      <TableCell>
                        {(item?.actualDistributionEndTime &&
                          formatDateWithFallback(item?.actualDistributionEndTime, true)) ||
                          '-'}
                      </TableCell>
                      <TableCell>
                        {getLabelByCode(masterData, 'dpw_foundation_campaign_distribution_status', item?.status) || '-'}
                      </TableCell>
                      <TableCell>{item?.impactDescription || '-'}</TableCell>
                      <TableCell>{item?.impactUnit || '-'}</TableCell>
                      <TableCell>{item?.targetImpactValue || '-'}</TableCell>
                      <TableCell>{item?.actualImpactValue || '-'}</TableCell>
                      <TableCell>{item?.successRate || '0'}%</TableCell>
                      {isOngoing && (
                        <TableCell>
                          <Tooltip title="Update" arrow>
                            <IconButton
                              onClick={() => {
                                isSupervisor ? handleOpenModal(item) : handleOpenImpactModal(item);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </ReusableTable>
              <UpdatePostProjectDetails
                open={openImpact}
                onClose={() => setOpenImpact(false)}
                data={rowData}
                refetchCampaignApi={refetchCampaignApi}
              />
              <ProjectDistributions
                open={open}
                onClose={() => setOpen(false)}
                distributionData={distributionData}
                refetchCampaignApi={refetchCampaignApi}
              />
            </>
          )}
          {!isSupervisor && isGe && (
            <>
              {isSupervisor && (
                <ProjectDistributions
                  open={open}
                  onClose={() => setOpen(false)}
                  distributionData={distributionData}
                  refetchCampaignApi={refetchCampaignApi}
                />
              )}
              {!isSupervisor && (
                <DistributionModalView
                  open={open}
                  onClose={() => setOpen(false)}
                  selectedDistribution={distributionData}
                />
              )}
            </>
          )}
        </>
      )}
    </Paper>
  );
}
