import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services';
import AssessmentDialog from './assessmentQuestion';

export default function DonationProcess({
  checkboxes,
  setCheckboxes,
  handleClickAssessmentAnswer,
  handleClickAssessmentAnswerView,
  type,
  iacadRequired,
  setIacadRequired,
  iacadJustification,
  setIacadJustification,
  donorDataRefetch,
  isView
}) {
  const [open, setOpen] = useState(false);
  const [QuestionData, setQuestionData] = useState([]);
  const [loading, setloading] = useState(false);
  const questionDetails = useSelector((state) => state.common.submittedAssessment);
  const { getDonorAdminData } = useSelector((state) => state.donor);
  const disabledStatusAdmin = [
    'AWAITING_APPROVAL',
    'ASSESSMENT_MORE_INFO_REQUIRED',
    'ASSESSMENT_REJECTED',
    'READY_TO_DONATE',
    'PLEDGE_REJECTED',
    'DONOR_MORE_INFO_REQUIRED',
    'DONATED',
    'AWAITING_DOCUMENT_APPROVAL',
    'DOCUMENT_MORE_INFO_REQUIRED',
    'AWAITING_DOCUMENT_CREATION'
  ];

  const disabled = disabledStatusAdmin.includes(getDonorAdminData?.donorPledgeResponse?.status);

  const { mutate } = useMutation('getDonorAdminData', api.preDefinedefinedQuestions, {
    onSuccess: (data) => {
      setQuestionData(data.data);
      setloading(true);
    }
  });
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
    mutate();
  };

  const handleChange = (name) => (event) => {
    const checked = event.target.checked;

    setCheckboxes((prev) => {
      const updated = { ...prev, [name]: checked };

      if ((name === 'letterFlowRequired' || name === 'assessmentFlowRequired') && checked) {
        updated.directPayment = false;
      }

      if (name === 'directPayment' && checked && (prev.letterFlowRequired || prev.assessmentFlowRequired)) {
        return prev;
      }

      return updated;
    });
  };

  useEffect(() => {
    if (!checkboxes.letterFlowRequired && !checkboxes.assessmentFlowRequired && !checkboxes.directPayment) {
      setCheckboxes((prev) => ({
        ...prev,
        directPayment: true
      }));
    }
  }, [checkboxes]);

  const hasExistingQuestions =
    getDonorAdminData?.questionDetailsListResponse?.questions?.length > 0 || questionDetails?.questions?.length > 0;

  const buttonLabel = hasExistingQuestions ? 'Update Assessment Question' : '+ Assessment Questions';

  const handleChangeApprove = (event) => {
    setIacadJustification('');
    setIacadRequired(event.target.value === 'true');
  };

  const isAnswerSubmitted = getDonorAdminData?.questionDetailsListResponse?.responseReceived;

  const questionBtnDisabled =
    (getDonorAdminData?.donorPledgeResponse?.status === 'ASSESSMENT_MORE_INFO_REQUIRED' &&
      getDonorAdminData?.assessmentFlowRequired) ||
    getDonorAdminData?.donorPledgeResponse?.status === 'AWAITING_DOCUMENT_CREATION' ||
    getDonorAdminData?.donorPledgeResponse?.status === 'AWAITING_DOCUMENT_APPROVAL';

  const renderAssessmentButtons = () => {
    let button;

    if (type === 'assessment' && isView !== 'true') {
      button = (
        <Button variant="contained" size="small" onClick={handleClickAssessmentAnswer}>
          {isAnswerSubmitted ? 'Update the Answers' : 'Answer Assessment questions'}
        </Button>
      );
    } else if (isView === 'true') {
      button = (
        <Button variant="contained" onClick={handleClickAssessmentAnswerView}>
          View Assessment Answers
        </Button>
      );
    } else {
      button = (
        <Button variant="contained" size="small" onClick={handleOpen} disabled={questionBtnDisabled}>
          {buttonLabel}
        </Button>
      );
    }

    return <>{button}</>;
  };
  let helperText = '';
  if (iacadJustification?.length > 256) {
    helperText = 'Justification cannot exceed 256 characters';
  } else if (!iacadRequired && iacadRequired !== null && iacadJustification?.length === 0) {
    helperText = 'Justification is required';
  }

  return (
    <>
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" textTransform="uppercase" color="text.black" mb={1}>
          Select donation process
        </Typography>

        <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <FormControlLabel
            control={
              <Tooltip
                title=" If the Admin approves the donor based on financial criteria (≤ ₹50,000), an Acceptance Letter is issued; otherwise, an Agreement is prepared. Final approval is by the HOD, after which the donor can make the payment."
                arrow
              >
                <Checkbox
                  checked={checkboxes.letterFlowRequired}
                  disabled={type === 'assessment' || disabled}
                  onChange={handleChange('letterFlowRequired')}
                />
              </Tooltip>
            }
            label="Agreement / Acceptance Process"
          />

          <FormControlLabel
            control={
              <Tooltip
                title="Admin adds assessment questions; the Assessment Team completes the assessment and approves the donor. Then, the donor can make the payment."
                arrow
              >
                <Checkbox
                  checked={checkboxes.assessmentFlowRequired}
                  disabled={type === 'assessment' || disabled}
                  onChange={handleChange('assessmentFlowRequired')}
                />
              </Tooltip>
            }
            label="Assessment"
          />
          {checkboxes?.assessmentFlowRequired && renderAssessmentButtons()}
          <FormControlLabel
            control={
              <Tooltip title="Once the Admin Approves the donor information, Donor can make the payment." arrow>
                <Checkbox
                  checked={checkboxes.directPayment}
                  disabled={type === 'assessment' || disabled}
                  onChange={handleChange('directPayment')}
                />
              </Tooltip>
            }
            label="Direct Payment"
          />
        </FormGroup>
        {getDonorAdminData?.donationType === 'GENERAL' && (
          <Box sx={{ mt: 3, mr: 0, mb: 0, ml: 1 }}>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                <Typography variant="subtitle4" color="text.secondarydark">
                  Is IACAD approval required?
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={iacadRequired?.toString() || iacadRequired}
                onChange={handleChangeApprove}
                sx={{ flexDirection: 'row', gap: 3 }}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={disabled} />
                <FormControlLabel value="false" control={<Radio />} label="No" disabled={disabled} />
              </RadioGroup>
            </FormControl>
            {!iacadRequired && iacadRequired !== null && (
              <TextField
                id="iacadJustification"
                variant="standard"
                inputProps={{ maxLength: 256 }}
                required
                label="Provide Justification"
                fullWidth
                value={iacadJustification}
                onChange={(e) => setIacadJustification(e.target.value)}
                error={iacadJustification?.length > 256 || (!iacadRequired && iacadJustification?.length === 0)}
                helperText={helperText}
                disabled={disabled}
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        )}
      </Paper>
      {loading && (
        <AssessmentDialog
          open={open}
          handleClose={handleClose}
          QuestionData={QuestionData}
          donorDataRefetch={donorDataRefetch}
        />
      )}
    </>
  );
}
