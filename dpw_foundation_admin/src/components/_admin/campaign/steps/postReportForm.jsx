'use client';
// mui
import { Button, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
// api
import PropTypes from 'prop-types';
import * as api from 'src/services';
// yup
// formik
import { useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import DynamicQuestionModal from 'src/components/dynamicQuestionModal';
import { DeleteIconRed } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';

PostReportForm.propTypes = {
  // 'isEdit' is a boolean indicating if the form is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isLoading' is a boolean indicating whether the form is loading data
  isLoading: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the form is in approve mode
  isApprove: PropTypes.bool.isRequired
};

/**
 * PostReportForm component for managing campaign questions and reports.
 * Handles creating and deleting questions, as well as displaying success/error messages.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isEdit - Flag indicating if the form is in edit mode.
 * @param {boolean} props.isLoading - Flag indicating if the form is loading.
 * @param {boolean} props.isApprove - Flag indicating if the campaign is approved.
 *
 * @returns {JSX.Element} The rendered PostReportForm component.
 */
export default function PostReportForm({ isEdit, isLoading, isApprove }) {
  const dispatch = useDispatch(); // Redux dispatch hook for updating the state.
  const params = useParams(); // Hook to get route parameters (campaign ID).
  const { values, validateForm, setTouched, setFieldValue } = useFormikContext(); // Formik hooks for form management.
  const [openReport, setOpenReport] = useState(false); // State for managing the report modal visibility.

  // Mutation hook for creating a campaign question.
  const { mutate } = useMutation('createCampaignQuestion', api.createCampaignQuestions, {
    onSuccess: (response) => {
      // Dispatch success message and close report modal on success.
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      handleCloseReport();
    },
    onError: (error) => {
      // Dispatch error message on failure.
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  // Mutation hook for deleting a project analysis report.
  const { mutate: deleteReport } = useMutation('deleteProjectAnalysisReport', api.deleteProjectAnalysisReport, {
    onSuccess: async (response) => {
      // Dispatch success message and reset questions on deletion success.
      dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
      setFieldValue('questions', []);
    },
    onError: (error) => {
      // Dispatch error message on failure.
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  /**
   * Opens the report modal when triggered.
   */
  const handleClickOpenReport = () => {
    setOpenReport(true);
  };

  /**
   * Closes the report modal when triggered.
   */
  const handleCloseReport = () => {
    setOpenReport(false);
  };

  /**
   * Validates the form and creates questions if no errors are found.
   * This is triggered when the user submits the form to create a question.
   */
  const handleCreateQuestion = async () => {
    // Set touched fields for validation
    setTouched({
      questions: values.questions.map(() => ({
        questionType: true,
        questionText: true,
        options: true
      }))
    });

    // Validate the form
    const currentErrors = await validateForm();

    // If no errors found, proceed with mutation to create the questions
    if (!currentErrors.questions) {
      const payload = {
        entityId: params?.id, // Campaign ID from URL params
        entityType: 'CAMPAIGN', // Entity type
        questionModuleType: 'CAMPAIGN_POST_ANALYSIS',
        postAnalysisQues: values?.questions // Questions from form values
      };
      mutate({ ...payload });
    }
  };

  /**
   * Deletes the campaign's project analysis report.
   * This is triggered when the user decides to delete the report.
   */
  const handleDeleteQuestion = () => {
    deleteReport({ type: 'CAMPAIGN', id: params?.id });
  };

  return (
    <>
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
          {campaignUpdateData?.campaignType === 'FUNDCAMP'
            ? 'Post Campaign analysis report'
            : 'Post project analysis report'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {!isApprove && (
              <Button
                variant="contained"
                type="button"
                size="small"
                onClick={handleClickOpenReport}
                disabled={!isEdit || values?.questions?.length}
              >
                {campaignUpdateData?.campaignType === 'FUNDCAMP'
                  ? 'Create Post Campaign analysis report'
                  : 'Create Post project analysis report'}
              </Button>
            )}
            {Boolean(values?.questions?.length) && (
              <>
                <Button
                  variant="blueLink"
                  onClick={handleClickOpenReport}
                  size="small"
                  sx={{ ml: 2.5, mt: { xs: 3, md: 0 } }}
                >
                  {campaignUpdateData?.campaignType === 'FUNDCAMP'
                    ? 'View / Edit Post Campaign analysis report questioner'
                    : 'View / Edit Post project analysis report questioner'}
                </Button>

                <Tooltip title="Delete" arrow>
                  <IconButton aria-label="delete" onClick={handleDeleteQuestion}>
                    <DeleteIconRed />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      {openReport && (
        <DynamicQuestionModal
          open={openReport}
          onClose={handleCloseReport}
          isLoading={isLoading}
          isEdit={isEdit}
          finalSubmit={handleCreateQuestion}
          modalTitle="Prepare Questions"
          isAnalysisReport={true}
        />
      )}
    </>
  );
}
