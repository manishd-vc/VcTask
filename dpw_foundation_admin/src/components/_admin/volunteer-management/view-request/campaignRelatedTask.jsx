'use client';
import { Box, Card, CardContent, Grid, Paper, Stack, TableCell, TableRow, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import ReusableTable from 'src/components/table/ReusableTable';
import TableStyle from 'src/components/table/table.styles';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import Export from '../../campaign/steps/export';

const tableHeaders = [
  { label: 'Task Description', key: 'taskDescription' },
  { label: 'Assign To', key: 'taskAssignee' },
  { label: 'Assign Date', key: 'assignedDate' },
  { label: 'Target Completion Date', key: 'targetCompletionDate' },
  { label: 'Actual Completion Date', key: 'actualCompletionDate' },
  { label: 'Progress Status', key: 'progressStatus' },
  { label: 'Status', key: 'status' }
];

export default function CampaignRelatedTask() {
  const { volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const targetData = volunteerCampaignData?.campaignTasks;
  const theme = useTheme();
  const style = TableStyle(theme);
  const { masterData } = useSelector((state) => state?.common);

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={2} item xs={12} sm={12}>
        <Grid item xs={12} sm={6} md={3} display="flex">
          <Stack flexDirection="column" sx={{ width: { xs: '50%', sm: '100%' } }}>
            <Card variant="bordered" sx={{ height: '100%', mb: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondarydark">
                  Total Campaign Task
                </Typography>
                <Typography variant="h6" color="warning.main" sx={{ wordBreak: 'break-all' }}>
                  {volunteerCampaignData?.campaignTasks?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6} lg={4}>
        <Stack flexDirection={'column'} gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            Is there any sub task associated with this volunteer campaign?
          </Typography>
          <Typography variant="subtitle4" color="text.secondarydark">
            {volunteerCampaignData?.isSubtaskRequired ? 'Yes' : 'No'}
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
              mb: 2
            }}
          >
            <Typography
              variant="subtitle5"
              textTransform={'uppercase'}
              color="primary.main"
              sx={{ py: 3 }}
              component="p"
            >
              Total Task ({volunteerCampaignData?.campaignTasks?.length || 0})
            </Typography>
            <Export id={volunteerCampaignData?.id} type={'VOLUNTEER_CAMPAIGN_TASK'} isVolunteer={true} />
          </Stack>
          <ReusableTable headers={tableHeaders}>
            {targetData?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>
                  <Box sx={style.CellMaxWidth}>{item?.taskDescription || '-'}</Box>
                </TableCell>
                <TableCell>{item?.taskAssigneeName || '-'}</TableCell>
                <TableCell>{(item?.assignedDate && fDateWithLocale(item?.assignedDate)) || '-'}</TableCell>
                <TableCell>
                  {(item?.targetCompletionDate && fDateWithLocale(item?.targetCompletionDate)) || '-'}
                </TableCell>
                <TableCell>
                  {(item?.actualCompletionDate && fDateWithLocale(item?.actualCompletionDate)) || '-'}
                </TableCell>
                <TableCell>
                  {getLabelByCode(masterData, 'dpwf_volunteer_req_task_status', item?.status) || item?.status}
                </TableCell>
                <TableCell>
                  {getLabelByCode(masterData, 'dpwf_volunteer_req_task_status', item?.status) || item?.status}
                </TableCell>
              </TableRow>
            ))}
          </ReusableTable>
        </>
      )}
    </Paper>
  );
}
