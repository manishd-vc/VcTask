// Importing required components from Material UI library
import { Grid, Paper, Stack, Typography } from '@mui/material'; // Grid for layout, Paper for container, Stack for stacking elements, Typography for text styling
import PropTypes from 'prop-types';

// Define Step3View component which receives 'data' as a prop
const Step3View = ({ data }) => {
  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Additional Information
      </Typography>
      {/* Grid component used to structure the questions in a responsive layout */}
      <Grid container spacing={3}>
        {data?.questionDetailsListResponse?.questions?.map((question, index) => (
          <Grid item xs={12} md={12} key={question.id || index}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                {question?.questionText}
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {question?.response || '-'}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

Step3View.propTypes = {
  data: PropTypes.shape({
    questionDetailsListResponse: PropTypes.shape({
      questions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired, // Ensure each question has an ID
          questionText: PropTypes.string.isRequired, // Question text is required
          response: PropTypes.string // Response is optional
        })
      ).isRequired
    }).isRequired
  }).isRequired
};

// Export Step3View component to be used in other parts of the application
export default Step3View;
