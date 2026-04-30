import { Box, Grid, IconButton, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { DeleteIconRed } from 'src/components/icons';
import StepperStyle from './stepper.styles';
/**
 * QuestionDeleteButton Component
 *
 * This component renders a delete button for removing a question. The button
 * is disabled if the form is in view-only mode (i.e., not in edit mode).
 *
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the current question.
 * @param {Function} props.remove - Function to remove the question at the specified index.
 *
 * @returns {JSX.Element} The rendered QuestionDeleteButton component.
 */
const QuestionDeleteButton = ({ index, remove }) => {
  const theme = useTheme();
  const styles = StepperStyle(theme);
  return (
    <Grid item xs={12} md={3}>
      <Box sx={styles.deleteIcon}>
        <IconButton onClick={() => remove(index)}>
          <DeleteIconRed />
        </IconButton>
      </Box>
    </Grid>
  );
};

// Prop types validation
QuestionDeleteButton.propTypes = {
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired
};

export default QuestionDeleteButton;
