'use client';
import { Grid, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { EditIcon } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';

import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import EditTaskDialog from './EditTaskDialog';

export default function CampaignRelatedTask({ refetch }) {
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);
  const { campaignTasks } = volunteerCampaignData || {};
  const { masterData } = useSelector((state) => state?.common);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  // Table headers matching the screenshot
  const taskTableHeaders = [
    { label: 'Task Description', key: 'taskDescription' },
    { label: 'Assign To', key: 'assignTo' },
    { label: 'Assign Date', key: 'assignDate' },
    { label: 'Target Completion Date', key: 'targetCompletionDate' },
    { label: 'Actual Completion Date', key: 'actualCompletionDate' },
    { label: 'Status', key: 'status' },
    { label: 'Action', key: 'action' }
  ];

  return (
    <>
      <Typography variant="subtitle6" color="primary.main" textTransform="uppercase" pt={2}>
        Campaign Related Task
      </Typography>

      {campaignTasks && campaignTasks.length > 0 ? (
        <ReusableTable headers={taskTableHeaders}>
          {campaignTasks.map((task) => (
            <TableRow key={task?.id}>
              <TableCell>{task?.taskDescription || '-'}</TableCell>
              <TableCell>{task?.taskAssigneeName || '-'}</TableCell>
              <TableCell>{task?.assignedDate ? fDateWithLocale(task?.assignedDate) : '-'}</TableCell>
              <TableCell>{task?.targetCompletionDate ? fDateWithLocale(task?.targetCompletionDate) : '-'}</TableCell>
              <TableCell>{task?.actualCompletionDate ? fDateWithLocale(task?.actualCompletionDate) : '-'}</TableCell>
              <TableCell>
                {getLabelByCode(masterData, 'dpwf_volunteer_req_task_status', task?.status) || task?.status}
              </TableCell>
              <TableCell>
                <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => handleEditClick(task)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </ReusableTable>
      ) : (
        <Grid container justifyContent="center" sx={{ py: 6 }}>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No Tasks Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no campaign-related tasks for this volunteer campaign yet.
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Edit Task Dialog */}
      <EditTaskDialog
        open={openDialog}
        onClose={handleCloseDialog}
        selectedTask={selectedTask}
        refetch={refetch}
        entityId={volunteerCampaignData?.id}
      />
    </>
  );
}
