'use client';
import { Box, Chip, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import StepperStyle from '../stepper.styles';
/**
 * TargetFormView component displays the view for managing and displaying
 * campaign beneficiaries. It calculates the total number of beneficiaries based
 * on the campaign data and uses the `StepperStyle` for styling.
 *
 * @param {Object} props - The component props.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function TargetFormView() {
  const theme = useTheme();
  const styles = StepperStyle(theme);
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const totalBeneficiariesCount = useMemo(() => {
    return campaignUpdateData?.campaignBeneficiaries.reduce(
      (total, { targetBeneficiaryNo }) => total + (Number(targetBeneficiaryNo) || 0),
      0
    );
  }, [campaignUpdateData?.campaignBeneficiaries]);

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Box sx={{ pb: 2 }}>
        <Stack
          gap={3}
          justifyContent="space-between"
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ pb: 3 }}
        >
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Beneficiary Details
          </Typography>
        </Stack>
        <Stack gap={2} justifyContent="flex-start" flexDirection="row" alignItems="center">
          <Typography variant="subtitle2" textTransform={'uppercase'} color="text.black">
            Total Beneficiaries:
          </Typography>
          <Chip label={totalBeneficiariesCount} variant="grey" size="small" />
        </Stack>
      </Box>
      <Box>
        {campaignUpdateData?.campaignBeneficiaries?.map((item) => (
          <Box sx={{ ...styles.moreBox }} key={`banifi_${item.beneficiaryType}`}>
            <Grid container rowSpacing={2} spacing={2}>
              <Grid item xs={12} md={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Type of Beneficiary
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.beneficiaryType}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    No of Target Beneficiaries
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.targetBeneficiaryNo}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack flexDirection="column">
                  <Typography variant="body3" color="text.secondary">
                    Target Beneficiary Description
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {item?.targetBeneficiaryDescription}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
