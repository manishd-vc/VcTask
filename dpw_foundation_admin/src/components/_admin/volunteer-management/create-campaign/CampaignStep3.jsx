import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ApprovalStageItem from '../../grant-management/create-request/ApprovalStageItem';
import AssessmentAddQuestion from './AssessmentAddQuestion';

const MAX_REQUEST_APPROVALS = 6;
export default function CampaignStep3() {
  const { values, setFieldValue } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const reqApprovalStages = getLabelObject(masterData, 'dpwf_volunteer_req_approval_stages_add');

  const handleDelete = (index) => {
    const updatedStages = [...values.approvalStages];
    updatedStages.splice(index, 1); // remove the item at index

    const reSequencedStages = updatedStages.map((item, idx) => ({
      ...item,
      sequence: idx + 1
    }));

    setFieldValue('approvalStages', reSequencedStages);
  };

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" textTransform={'uppercase'} color="text.black">
            Volunteer campaign Approval Process
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle6"
            component="h4"
            textTransform={'uppercase'}
            color="primary.main"
            sx={{ mb: 2 }}
          >
            checklist Questions
          </Typography>
          <AssessmentAddQuestion />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle6"
            component="h4"
            textTransform={'uppercase'}
            color="primary.main"
            sx={{ mb: 2, mt: 3 }}
          >
            Request Approvals
          </Typography>
          <FieldArray name="approvalStages">
            {({ push }) => (
              <Box>
                <Stack alignItems={'flex-end'}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      push({
                        stageName: '',
                        approverName: '',
                        approverId: '',
                        initialStage: 0,
                        sequence: values?.approvalStages?.length + 1
                      })
                    }
                    disabled={values?.approvalStages?.length >= MAX_REQUEST_APPROVALS}
                  >
                    Add More Approvals
                  </Button>
                </Stack>
                {values.approvalStages?.map((stage, index) => (
                  <ApprovalStageItem
                    key={stage?.sequence}
                    index={index}
                    stage={stage}
                    type="approvalStages"
                    stageOptions={reqApprovalStages?.values}
                    onDelete={() => handleDelete(index)}
                    moduleType="volunteer"
                  />
                ))}
              </Box>
            )}
          </FieldArray>
        </Grid>
      </Grid>
    </Paper>
  );
}
