import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import PostAnalysisReportForm from './_admin/campaign/steps/postAnalysisReportForm'; // Import form component
import ModalStyle from './dialog/dialog.style'; // Import modal styles
import { CloseIcon } from './icons'; // Import custom close icon

DynamicQuestionModal.propTypes = {
  // 'open' is a boolean that determines if the modal is open
  open: PropTypes.bool.isRequired,

  // 'onClose' is a function to handle closing the modal
  onClose: PropTypes.func.isRequired,

  // 'isLoading' is a boolean that indicates if the modal is in a loading state
  isLoading: PropTypes.bool.isRequired,

  // 'isEdit' is a boolean to check if the modal is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'finalSubmit' is a function to handle the final submit action
  finalSubmit: PropTypes.func.isRequired,

  // 'modalTitle' is a string representing the title of the modal
  modalTitle: PropTypes.string.isRequired,

  // 'isAnalysisReport' is a boolean to indicate if the modal is for an analysis report
  isAnalysisReport: PropTypes.bool.isRequired
};

/**
 * DynamicQuestionModal Component
 *
 * A modal dialog for displaying and interacting with a dynamic form.
 * It conditionally renders a post-analysis report form and provides actions for submitting or canceling.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Controls the modal visibility.
 * @param {function} props.onClose - Function to handle modal close.
 * @param {boolean} props.isLoading - Indicates if the form is in a loading state.
 * @param {boolean} props.isEdit - Indicates if the form is in edit mode.
 * @param {function} props.finalSubmit - Function to handle form submission.
 * @param {string} props.modalTitle - The title of the modal.
 * @param {boolean} props.isAnalysisReport - Flag to conditionally render post-campaign analysis report form.
 *
 * @returns {JSX.Element} - The rendered DynamicQuestionModal component.
 */
export default function DynamicQuestionModal({
  open,
  onClose,
  isLoading,
  isEdit,
  finalSubmit,
  modalTitle,
  isAnalysisReport
}) {
  const theme = useTheme(); // Access Material-UI theme
  const style = ModalStyle(theme); // Apply modal styles based on the theme

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      {/* Dialog Title */}
      <DialogTitle sx={{ textTransform: 'uppercase' }} id="customized-dialog-title" variant="h5" color="primary.main">
        {isAnalysisReport && 'Prepare post campaign analysis report'}
      </DialogTitle>

      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>

      {/* Dialog Content with the form */}
      <DialogContent>
        <PostAnalysisReportForm
          isLoading={isLoading}
          isEdit={isEdit}
          isAnalysisReport={isAnalysisReport}
          modalTitle={modalTitle}
        />
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button variant="outlinedWhite" type="button" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={finalSubmit}
          disabled={!isEdit} // Disable the "Create" button if not in edit mode
          color="primary"
          type="button"
          form="emailCampaignForm" // The form to be submitted
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
