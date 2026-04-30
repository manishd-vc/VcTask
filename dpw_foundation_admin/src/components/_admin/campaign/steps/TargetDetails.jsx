'use client';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateTargetSupervisor from 'src/components/dialog/updateTargetSupervisor';
import { EditIcon } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';
import TableStyle from 'src/components/table/table.styles';
import Export from './export';

/**
 * PartnerFormView component renders a view of the partner information related to the campaign.
 * It displays the campaign's partner details such as the partner's name, description, and other relevant info.
 *
 * @returns {JSX.Element} The rendered PartnerFormView component.
 */

const tableHeaders = [
  { label: 'Target Description', key: 'targetDescription' },
  { label: 'Unit', key: 'targetUnit' },
  { label: 'Target Number', key: 'targetNumber' },
  { label: 'Achieved Number', key: 'achievedNumber' },
  { label: 'Value of Achieved Number', key: 'achievedNumberValue' },
  { label: 'Remarks', key: 'remarks' },
  { label: 'Action', key: 'action' }
];

const tableHeadersapprover = [
  { label: 'Target Description', key: 'targetDescription' },
  { label: 'Unit', key: 'targetUnit' },
  { label: 'Target Number', key: 'targetNumber' }
]; // Component rendering logic goes here
export default function CampaignTarget({ isSupervisor, refetchCampaignApi }) {
  // Using Material-UI's theme and creating custom styles
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const targetData = campaignUpdateData?.campaignTargets;
  const [rowData, setRowData] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const theme = useTheme();
  const style = TableStyle(theme);

  const handleUpdate = (data) => {
    setRowData(data);
    setUpdateModal(true);
  };

  const totalValueAchievedNumber = useCallback(() => {
    let totalValue = 0;
    targetData?.forEach((item) => {
      totalValue += item?.achievedValue;
    });
    return totalValue;
  }, [targetData]);

  return (
    <Paper sx={{ p: 3 }}>
      {/* <Typography variant="h6" component="p" textTransform={'uppercase'} color="text.black" mb={3}>
        Campaign Target
      </Typography> */}
      <Grid container spacing={2} item xs={12} sm={12}>
        {/* {campaignUpdateData?.isPartnerRequired && ( */}
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
            <Card variant="bordered" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondarydark">
                  Campaign Target
                </Typography>
                <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                  {campaignUpdateData?.campaignTargets?.length}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        {campaignUpdateData?.campaignType === 'FUNDCAMP' && isSupervisor && (
          <Grid item xs={12} sm={6} md={3} display="flex">
            <Stack display="flex" flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
              <Card variant="bordered" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondarydark">
                    Total Value of Achieved Number
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                    {totalValueAchievedNumber()}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        )}
      </Grid>
      {targetData?.length > 0 && (
        <>
          <Stack flexDirection="row" spacing={{ sm: 2, md: 3 }} alignItems="center" justifyContent="space-between">
            <Typography
              variant="subtitle5"
              textTransform={'uppercase'}
              color="primary.main"
              sx={{ py: 3 }}
              component="p"
            >
              Total Targets ({campaignUpdateData?.campaignTargets?.length})
            </Typography>
            <Export id={campaignUpdateData?.id} type={'CAMPAIGN_TARGET'} />
          </Stack>

          <ReusableTable headers={isSupervisor ? tableHeaders : tableHeadersapprover}>
            {targetData?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell align="center">
                  <Stack>
                    <Box>{item?.targetDescription || '-'}</Box>
                  </Stack>
                </TableCell>
                <TableCell>{item?.targetUnit || '-'}</TableCell>
                <TableCell>{item?.targetNumber || '-'}</TableCell>
                {isSupervisor && (
                  <>
                    <TableCell>{item?.achievedNumber || '-'}</TableCell>
                    <TableCell>{item?.achievedValue || '-'}</TableCell>
                    <TableCell>
                      <Box sx={style.CellMaxWidth}>{item?.remarks || '-'}</Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Update" arrow>
                        <IconButton aria-label="update" onClick={() => handleUpdate(item)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </ReusableTable>
        </>
      )}
      <UpdateTargetSupervisor
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        data={rowData}
        refetchCampaignApi={refetchCampaignApi}
      />
    </Paper>
  );
}
