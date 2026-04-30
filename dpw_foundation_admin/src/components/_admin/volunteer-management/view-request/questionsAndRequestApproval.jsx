import { Box, Button, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';

import VolunteerCampaignViewDetailsModal from 'src/components/dialog/VolunteerCampaignViewDetailsModal';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import ViewAssessmentQuestions from './view-assessment-questions';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6, md: 3 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function QuestionsAndRequestApproval() {
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);
  const { masterData } = useSelector((state) => state?.common);
  const [open, setOpen] = useState(false);
  const { approvalStages } = volunteerCampaignData || {};
  const theme = useTheme();
  const style = CommonStyle(theme);
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [viewDetailsData, setViewDetailsData] = useState(null);

  const handleViewDetails = (doc) => {
    setViewDetailsData(doc);
    setOpenViewDetails(true);
  };

  const renderApprovalList = (doc, index) => {
    const { approverName, stageName } = doc || {};

    const defaultStageName =
      index === 0
        ? getLabelByCode(masterData, 'dpwf_volunteer_req_approval_stages_view', stageName)
        : getLabelByCode(masterData, 'dpwf_volunteer_req_approval_stages_add', stageName);

    const fields = [
      { label: 'Approver Team', value: defaultStageName },
      { label: 'Approver Authority', value: approverName }
    ];

    return (
      <Box
        sx={{
          ...style.documentCard
        }}
        key={doc?.id}
      >
        <Grid container spacing={2} alignItems="flex-start">
          {fields?.map((field) => (
            <FieldDisplay
              key={field?.label}
              label={field?.label}
              value={field?.value}
              gridProps={{ xs: 12, sm: 6, md: 4 }}
            />
          ))}
          {doc?.status === 'APPROVED' && doc?.initialStage !== 1 && !doc?.lastHod && (
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" color="primary" size="small" onClick={() => handleViewDetails(doc)}>
                View Details
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              checklist questions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" size="small" color="primary" onClick={() => setOpen(true)}>
              View Checklist Questions
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle6"
              component="h4"
              textTransform={'uppercase'}
              color="primary.main"
              sx={{ mt: 1 }}
            >
              Request Approvals
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {approvalStages?.length > 0 ? (
              <Stack spacing={2}>{approvalStages?.map((doc, index) => renderApprovalList(doc, index))}</Stack>
            ) : (
              <Box sx={{ bgcolor: 'backgrounds.light', p: 4, width: '100%' }}>
                <Typography color="secondary.darker">No Request Approvals</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      <ViewAssessmentQuestions open={open} handleClose={handleClose} />
      {openViewDetails && (
        <VolunteerCampaignViewDetailsModal
          open={openViewDetails}
          onClose={() => setOpenViewDetails(false)}
          viewDetailsData={viewDetailsData}
        />
      )}
    </>
  );
}
