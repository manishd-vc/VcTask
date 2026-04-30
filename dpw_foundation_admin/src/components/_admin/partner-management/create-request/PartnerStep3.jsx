import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ApprovalStageItem from '../../grant-management/create-request/ApprovalStageItem';
import AssessmentAddQuestion from './AssessmentAddQuestion';

const MAX_REQUEST_APPROVALS = 6;
const MAX_DOCUMENT_APPROVALS = 3;

export default function PartnerStep3() {
  const { values, setFieldValue } = useFormikContext();

  const { masterData } = useSelector((state) => state?.common);
  const reqApprovalStages = getLabelObject(masterData, 'dpwf_partner_req_approval_stages_add');
  const documentApprovalStages = getLabelObject(masterData, 'dpwf_partner_doc_approval_stages_add');

  const handleAddStage = (fieldName, existing) => {
    const newStage = {
      stageName: '',
      approverName: '',
      approverId: '',
      initialStage: 0,
      sequence: 0
    };

    const backendStages = existing.filter((s) => s.initialStage !== 0);
    const userStages = existing.filter((s) => s.initialStage === 0);

    // Find the index of the first stage with matching stageName
    const insertIndex = userStages.findIndex((s) => s.stageName?.toLowerCase() === newStage.stageName?.toLowerCase());

    let updatedUserStages;
    if (insertIndex === -1) {
      // No match: insert at bottom of user stages
      updatedUserStages = [...userStages, newStage];
    } else {
      // Insert below the matching stage
      updatedUserStages = [...userStages.slice(0, insertIndex + 1), newStage, ...userStages.slice(insertIndex + 1)];
    }

    // Recombine and update sequence
    const updatedStages = [...updatedUserStages, ...backendStages].map((stage, i) => ({
      ...stage,
      sequence: i + 1
    }));

    setFieldValue(fieldName, updatedStages);
  };

  const handleDelete = (index) => {
    const updatedStages = [...values.requestApprovalStages];
    updatedStages.splice(index, 1); // remove the item at index

    const reSequencedStages = updatedStages.map((item, idx) => ({
      ...item,
      sequence: idx + 1
    }));

    setFieldValue('requestApprovalStages', reSequencedStages);
  };

  const handleDeleteDocumentApprovalStages = (indexToDelete) => {
    const updatedStages = values.documentApprovalStages.filter((_, i) => i !== indexToDelete);

    const reordered = [...updatedStages]
      .sort((a, b) => {
        if (a.initialStage === 0 && b.initialStage !== 0) return -1;
        if (a.initialStage !== 0 && b.initialStage === 0) return 1;
        return 0;
      })
      .map((stage, i) => ({
        ...stage,
        sequence: i + 1
      }));

    setFieldValue('documentApprovalStages', reordered);
  };
  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Partnership Request Approval Process
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Partner Verification Status
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {getLabelByCode(masterData, 'dpwf_partner_verification_status', values?.partnerVerificationStatus) || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ mb: 2, mt: 3 }}
      >
        Assessment Questions
      </Typography>
      <AssessmentAddQuestion />

      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ mb: 2, mt: 3 }}
      >
        Request Approvals
      </Typography>

      <FieldArray name="requestApprovalStages">
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
                    sequence: values?.requestApprovalStages?.length + 1
                  })
                }
                disabled={values?.requestApprovalStages?.length >= MAX_REQUEST_APPROVALS}
              >
                Add More Approvals
              </Button>
            </Stack>
            {values.requestApprovalStages?.map((stage, index) => (
              <ApprovalStageItem
                key={stage?.sequence}
                index={index}
                stage={stage}
                type="requestApprovalStages"
                stageOptions={reqApprovalStages?.values}
                onDelete={() => handleDelete(index)}
                moduleType="partnership"
              />
            ))}
          </Box>
        )}
      </FieldArray>
      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ pt: 2, pb: 2 }}
      >
        Document Creation Approvals
      </Typography>
      <FieldArray name="documentApprovalStages">
        {() => (
          <Box>
            <Stack alignItems={'flex-end'}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleAddStage('documentApprovalStages', values.documentApprovalStages)}
                disabled={
                  values?.documentApprovalStages?.filter((s) => s.initialStage === 0).length >= MAX_DOCUMENT_APPROVALS
                }
              >
                Add More Approvals
              </Button>
            </Stack>
            {values?.documentApprovalStages?.map((stage, index) => (
              <ApprovalStageItem
                key={stage?.sequence}
                index={index}
                stage={stage}
                type="documentApprovalStages"
                stageOptions={documentApprovalStages?.values}
                onDelete={() => handleDeleteDocumentApprovalStages(index)}
                moduleType="partnership"
              />
            ))}
          </Box>
        )}
      </FieldArray>
    </>
  );
}
