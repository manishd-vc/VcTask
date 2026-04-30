'use client';
import { Grid, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { EditIcon } from 'src/components/icons';
import ReusableTable from 'src/components/table/ReusableTable';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import EditMilestoneDialog from './EditMilestoneDialog';

export default function VolunteeringCampaignMilestone({ refetch }) {
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);
  const { riskAssessments, milestones } = volunteerCampaignData || {};
  const { masterData } = useSelector((state) => state?.common);

  // Use milestones if available, otherwise fall back to riskAssessments for demo
  const milestoneData = milestones || riskAssessments;

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleEditClick = (item, index) => {
    setSelectedMilestone(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMilestone(null);
  };

  // Table headers matching the screenshot
  const milestoneTableHeaders = [
    { label: 'Milestone ID', key: 'milestoneId' },
    { label: 'Milestone Description', key: 'milestoneDescription' },
    { label: 'Unit', key: 'unit' },
    { label: 'Target Number', key: 'targetNumber' },
    { label: 'Achieved Number', key: 'achievedNumber' },
    { label: 'Financial Value of Achieved Number', key: 'financialValue' },
    { label: 'Result', key: 'result' },
    { label: 'Action', key: 'action' }
  ];

  return (
    <>
      <Typography variant="subtitle6" color="primary.main" textTransform="uppercase" pt={1}>
        Volunteering Campaign Milestone
      </Typography>

      {milestoneData && milestoneData.length > 0 ? (
        <ReusableTable headers={milestoneTableHeaders}>
          {milestoneData.map((item, index) => (
            <TableRow key={item?.id}>
              <TableCell>{item?.milestoneUniqueId || '-'}</TableCell>
              <TableCell>{item?.milestoneDescription || '-'}</TableCell>
              <TableCell>{getLabelByCode(masterData, 'dpwf_volunteer_unit', item?.unit) || item?.unit}</TableCell>
              <TableCell>{item?.targetNumber || '-'}</TableCell>
              <TableCell>{item?.achievedNumber || '-'}</TableCell>
              <TableCell>{item?.financialValueAchieved || '-'}</TableCell>
              <TableCell>
                {item?.resultPercentage !== null &&
                item?.resultPercentage !== undefined &&
                item?.resultPercentage !== ''
                  ? `${item.resultPercentage}%`
                  : '-'}
              </TableCell>
              <TableCell>
                <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => handleEditClick(item, index)}>
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
              No Milestones Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no campaign milestones for this volunteer campaign yet.
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Edit Milestone Dialog */}
      <EditMilestoneDialog
        open={openDialog}
        onClose={handleCloseDialog}
        selectedMilestone={selectedMilestone}
        refetch={refetch}
        entityId={volunteerCampaignData?.id}
      />
    </>
  );
}
