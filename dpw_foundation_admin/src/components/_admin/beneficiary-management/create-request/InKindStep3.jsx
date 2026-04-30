import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import UploadDocuments from 'src/components/dialog/uploadDocuments';
import UploadDocumentsRow from 'src/components/table/rows/uploadDocumentsRow';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ApprovalStageItem from '../../grant-management/create-request/ApprovalStageItem';
import AssessmentAddQuestion from './AssessmentAddQuestion';

const MAX_REQUEST_APPROVALS = 6;

export default function InKindStep3() {
  const { id } = useParams();
  const { values, setFieldValue } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const reqApprovalStages = getLabelObject(masterData, 'dpwf_contribution_req_approval_stages_add');
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);

  const { data: documentsList, refetch: refetchDocumentsList } = useQuery(
    ['getInKindBeneficiaryAgreementDocumentsList', id],
    () => beneficiaryApi.getInKindBeneficiaryAgreementDocumentsList({ entityId: id }, { enabled: !!id })
  );

  const handleCloseUploadDocuments = () => {
    setAddDocumentOpen(false);
    refetchDocumentsList();
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
  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        In kind contribution approval form
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack flexDirection="row" alignItems="flex-start" justifyContent="space-between">
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" pb={1}>
              Agreement Document
            </Typography>
            {values.isAgreedDocImplemented && (
              <>
                <Button
                  disabled={documentsList?.length >= 1}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => setAddDocumentOpen(true)}
                >
                  Add Documents
                </Button>
              </>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel id="waiver-radio-buttons-group-label" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondarydark">
                Is Any Agreed doc Implemented?
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={values.isAgreedDocImplemented ? 'true' : 'false'}
              onChange={(e) => {
                setFieldValue('isAgreedDocImplemented', e.target.value === 'true');
              }}
            >
              <FormControlLabel value="true" control={<Radio />} sx={{ mr: 3 }} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {values.isAgreedDocImplemented && (
            <Box sx={{ mt: 1 }}>
              <UploadDocumentsRow
                rowData={documentsList}
                targetEntityId={id}
                refetchDocumentsList={refetchDocumentsList}
                type={'inKindAgreement'}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      {addDocumentOpen && (
        <UploadDocuments
          open={addDocumentOpen}
          onClose={handleCloseUploadDocuments}
          targetEntityId={id}
          type={'inKindAgreement'}
        />
      )}
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
                moduleType="beneficiary"
              />
            ))}
          </Box>
        )}
      </FieldArray>
    </>
  );
}
