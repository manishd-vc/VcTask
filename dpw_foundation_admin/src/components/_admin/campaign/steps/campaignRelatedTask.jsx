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
import { useState } from 'react';
import { useSelector } from 'react-redux';
import UpdateTaskSupervisor from 'src/components/dialog/updateTaskSupervisor';
import { EditIcon } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';
import TableStyle from 'src/components/table/table.styles';
import { fDateWithLocale } from 'src/utils/formatTime';
import Export from './export';

/**
 * PartnerFormView component renders a view of the partner information related to the campaign.
 * It displays the campaign's partner details such as the partner's name, description, and other relevant info.
 *
 * @returns {JSX.Element} The rendered PartnerFormView component.
 */

const tableHeaders = [
  { label: 'Task Description', key: 'taskDescription' },
  { label: 'Assign To', key: 'taskAssignee' },
  { label: 'Assign Date', key: 'assignedDate' },
  { label: 'Target Completion Date', key: 'targetCompletionDate' },
  { label: 'Actual Completion Date', key: 'actualCompletionDate' },
  { label: 'Progress Status', key: 'progressStatus' },
  { label: 'Action', key: 'action' }
]; // Component rendering logic goes here

export default function CampaignRelatedTask({ refetchCampaignApi, isSupervisor }) {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const targetData = campaignUpdateData?.campaignTasks;
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const theme = useTheme();
  const style = TableStyle(theme);
  const handleUpdate = (data) => {
    setRowData(data);
    setOpen(true);
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* <Typography variant="h6" component="h6" textTransform={'uppercase'} color="text.black" mb={3}>
        Campaign Related Task Details
      </Typography> */}
      <Grid container spacing={2} item xs={12} sm={12}>
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
            <Card variant="bordered" sx={{ height: '100%', mb: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondarydark">
                  Total Campaign Task
                </Typography>
                <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                  {campaignUpdateData?.campaignTasks?.length}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        {/* )} */}
      </Grid>
      {/* <Grid container spacing={2}> */}
      <Grid item xs={12} sm={6} lg={4}>
        <Stack flexDirection="column">
          <Typography variant="body3" color="text.secondary">
            Is there any sub task associated with this campaign?
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {campaignUpdateData?.isSubtaskRequired ? 'Yes' : 'No'}
          </Typography>
        </Stack>
      </Grid>
      {targetData?.length > 0 && (
        <>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              my: 2
            }}
          >
            <Typography
              variant="subtitle5"
              textTransform={'uppercase'}
              color="primary.main"
              sx={{ py: 3 }}
              component="p"
            >
              Total Task ({campaignUpdateData?.campaignTasks?.length})
            </Typography>
            <Export id={campaignUpdateData?.id} type={'CAMPAIGN_TASK'} />
          </Stack>
          <ReusableTable headers={tableHeaders}>
            {targetData?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>
                  <Box sx={style.CellMaxWidth}>{item?.taskDescription || '-'}</Box>
                </TableCell>
                <TableCell>{item?.taskAssigneeId?.firstName + ' ' + item?.taskAssigneeId?.lastName || '-'}</TableCell>
                <TableCell>{(item?.assignedDate && fDateWithLocale(item?.assignedDate)) || '-'}</TableCell>
                <TableCell>
                  {(item?.targetCompletionDate && fDateWithLocale(item?.targetCompletionDate)) || '-'}
                </TableCell>
                <TableCell>
                  {(item?.actualCompletionDate && fDateWithLocale(item?.actualCompletionDate)) || '-'}
                </TableCell>
                <TableCell>{item?.status || '-'}</TableCell>
                <TableCell>
                  {isSupervisor && campaignUpdateData?.status === 'ONGOING' ? (
                    <Tooltip title="Update" arrow>
                      <IconButton onClick={() => handleUpdate(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </ReusableTable>
          <UpdateTaskSupervisor
            open={open}
            onClose={() => setOpen(false)}
            refetchCampaignApi={refetchCampaignApi}
            data={rowData}
          />
        </>
      )}
    </Paper>
  );
}
