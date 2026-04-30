'use client';
import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import { fDateWithLocale } from 'src/utils/formatTime';
import VolunteerQuestionForm from './VolunteerQuestionForm';

export default function VolunteerPostAnalysisForm({
  isLoading,
  modalTitle = 'Prepare Volunteer Campaign Questions',
  campaignUpdateData,
  mode,
  isAnswerMode,
  isCreateMode
}) {
  const { values, setFieldValue } = useFormikContext();

  const handleAddQuestion = () => {
    const newQuestion = {
      targetUnit: '',
      questionText: '',
      targetValue: '',
      achieveValue: '',
      sequence: (campaignUpdateData?.postAnalysisQues?.length || values.questions.length) + 1
    };

    setFieldValue('questions', [...values.questions, newQuestion]);
  };

  return (
    <>
      {!isAnswerMode && (
        <Grid container spacing={3} sx={{ pb: 2 }}>
          <Grid item xs={12} md={3}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Volunteer Campaign Report Analysis ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.analysisReportId || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Volunteer Campaign ID
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.campaignNumbericId || campaignUpdateData?.volunteerCampaignNumericId || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Analysis Report Title
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                Analysis report for - {campaignUpdateData?.reportTitle || campaignUpdateData?.title || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Target Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {(campaignUpdateData?.targetDate && fDateWithLocale(campaignUpdateData?.targetDate)) ||
                  (campaignUpdateData?.startDate && fDateWithLocale(campaignUpdateData?.startDate)) ||
                  (campaignUpdateData?.projectStartDate && fDateWithLocale(campaignUpdateData?.projectStartDate)) ||
                  '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                End Date
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {(campaignUpdateData?.endDate && fDateWithLocale(campaignUpdateData?.endDate)) ||
                  (campaignUpdateData?.projectEndDate && fDateWithLocale(campaignUpdateData?.projectEndDate)) ||
                  '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Assign To
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.supervisorName || campaignUpdateData?.assignedTo || '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack flexDirection={'column'} gap={0.5}>
              <Typography variant="body3" color="text.secondary">
                Campaign Post Analysis Status
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {campaignUpdateData?.status?.toLowerCase()?.replace(/^\w/, (c) => c.toUpperCase()) ||
                  campaignUpdateData?.analysisStatus?.toLowerCase()?.replace(/^\w/, (c) => c.toUpperCase()) ||
                  '-'}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Divider sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      )}

      {!isAnswerMode && (
        <Stack alignItems="center" direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
          <Typography variant="subtitle6" color="primary.main" textTransform="uppercase">
            {modalTitle}
          </Typography>
          {isCreateMode && (
            <Button variant="contained" size="small" onClick={handleAddQuestion} color="primary">
              Add More Questions
            </Button>
          )}
        </Stack>
      )}

      <FieldArray name="questions">
        {({ remove }) => (
          <VolunteerQuestionForm
            values={values}
            isLoading={isLoading}
            remove={remove}
            mode={mode}
            isAnswerMode={isAnswerMode}
            isCreateMode={isCreateMode}
          />
        )}
      </FieldArray>
    </>
  );
}

VolunteerPostAnalysisForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string,
  campaignUpdateData: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  isAnswerMode: PropTypes.bool.isRequired,
  isCreateMode: PropTypes.bool.isRequired
};
