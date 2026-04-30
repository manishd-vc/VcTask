import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ApprovalStageItem from './ApprovalStageItem';
import GrantAssessmentQuestion from './GrantAssessmentQuestion';

const documentTypeOptions = [
  { label: 'Agreement', value: 'AGREEMENT' },
  { label: 'Contribution Letter', value: 'CONTRIBUTION' },
  { label: 'Confirmation Email', value: 'CONFIRM_EMAIL' }
];

const showDocumentApprovalStages = ['AGREEMENT', 'CONTRIBUTION'];
const MAX_REQUEST_APPROVALS = 6;
const MAX_DOCUMENT_APPROVALS = 3;

export default function GrantStep3() {
  const { masterData } = useSelector((state) => state?.common);
  const reqApprovalStages = getLabelObject(masterData, 'dpwf_grant_req_approval_stages_add');
  const documentApprovalStages = getLabelObject(masterData, 'dpwf_grant_doc_approval_stages_add');
  const { values, setFieldValue } = useFormikContext();

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
        Grant Request approval form
      </Typography>
      <GrantAssessmentQuestion />

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
                moduleType="grant"
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

      <FormControl>
        <FormLabel id="document-type-label">
          <Typography variant="body3" color="text.secondary" sx={{ mb: 1 }}>
            Document Type
          </Typography>
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="document-type-label"
          name="documentType"
          value={values?.documentType}
          onChange={(e) => setFieldValue('documentType', e.target.value)}
        >
          {documentTypeOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
              sx={{ mr: 3 }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {showDocumentApprovalStages.includes(values?.documentType) && (
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
                  moduleType="grant"
                />
              ))}
            </Box>
          )}
        </FieldArray>
      )}
    </>
  );
}
